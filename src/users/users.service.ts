import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from 'src/_common/prisma/prisma.service'
import { AUTH } from 'src/constants'
import { CryptoService } from 'src/_common/crypto/crypto.service'
import { PaginationQueryParams } from 'src/_common/@types/pagination.entity'

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService, private readonly cryptoService: CryptoService) { }

    async create(createUserDto: CreateUserDto) {
        const { password, ...userData } = createUserDto
        const passwordHash = await this.cryptoService.hash(password)
        return this.prismaService.user.create({
            data: {
                ...userData,
                password: {
                    create: {
                        hash: passwordHash
                    }
                },
                profile: {
                    create: {}
                }
            }
        })
    }

    async findAll() {
        return this.prismaService.user.findMany()
    }

    // async findAll(params: PaginationQueryParams) {
    //     let take = params.perPage ? +params.perPage : 20
    //     let page = params.page ? +params.page : 1
    //     let skip = (page * take) - take
    //     let orderBy = params.orderBy ?? 'id'
    //     let sort = params.sort ?? 'asc'
    //     const [count, users] = await Promise.all([
    //         this.prismaService.product.count(),
    //         this.prismaService.product.findMany({
    //             skip,
    //             take,
    //             orderBy: { [orderBy]: sort }
    //         })
    //     ])
    //     let last = Math.ceil(count / take)
    //     return {
    //         users,
    //         pages: {
    //             first: 1,
    //             previous: page !== 1 ? page - 1 : null,
    //             current: page,
    //             next: page !== last ? page + 1 : null,
    //             last
    //         }
    //     }
    // }

    async findOne(id: number) {
        return this.prismaService.user.findUnique({
            where: { id }
        })
    }

    async findOneByEmail(email: string) {
        return this.prismaService.user.findUnique({
            where: { email },
            include: { password: true }
        })
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const userWithPhone = updateUserDto.phone
            ? await this.prismaService.user.findUnique({
                where: { phone: updateUserDto.phone }
            })
            : null
        if (userWithPhone && userWithPhone.id !== id)
            throw new BadRequestException(AUTH.SIGNUP_ERROR_IN.PHONE)

        return this.prismaService.user.update({
            where: { id },
            data: updateUserDto
        })
    }

    async updatePassword(id: number, password: string, currentPassword: string) {
        const { hash } = await this.prismaService.password.findUnique({ where: { userId: id } })
        const isPasswordValid = await this.cryptoService.compare(currentPassword, hash)
        if (!isPasswordValid)
            throw new UnauthorizedException(AUTH.LOGIN_ERROR_IN.PASSWORD)

        const passwordHash = await this.cryptoService.hash(password)
        return this.prismaService.user.update({
            where: { id },
            data: {
                password: { update: { hash: passwordHash } }
            }
        })
    }

    async remove(id: number) {
        return this.prismaService.user.delete({
            where: { id }
        })
    }

    async userOrders(userId: number) {
        return this.prismaService.order.findMany({
            where: { userId },
            include: {
                subcategory: {
                    select: {
                        name: true,
                        category: { select: { name: true } }
                    }
                },
                city: true,
                responses: true
            }
        })
    }
}
