import { Injectable } from '@nestjs/common'
import { CreateSpecialtyDto } from './dto/create-specialty.dto'
import { UpdateSpecialtyDto } from './dto/update-specialty.dto'
import { PrismaService } from 'src/_common/prisma/prisma.service'
import { SpecialtyId } from './entities/specialty.entity'

@Injectable()
export class SpecialtiesService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(createSpecialtyDto: CreateSpecialtyDto) {
        const { profileUserId, checked } = createSpecialtyDto
        return Promise.all(checked.map(async subcategoryId => {
            const category = await this.prismaService.category.findFirst({
                where: {
                    subcategories: {
                        some: { id: subcategoryId }
                    }
                }
            })
            return this.prismaService.specialty.upsert({
                where: {
                    profileUserId_subcategoryId: { profileUserId, subcategoryId }
                },
                update: {},
                create: {
                    profile: { connect: { userId: profileUserId } },
                    subcategory: { connect: { id: subcategoryId } },
                    categoryId: category.id
                }
            })
        }))
    }

    findAll(id: number) {
        return this.prismaService.category.findMany({
            where: {
                subcategories: {
                    some: {
                        specialties: {
                            some: {
                                profileUserId: id
                            }
                        }
                    }
                }
            },
            include: {
                subcategories: {
                    where: {
                        specialties: {
                            some: {
                                profileUserId: id
                            }
                        }
                    },
                    include: {
                        specialties: {
                            include: {
                                offers: { select: { title: true, price: true, priceUnit: true } },
                                params: { select: { specialtyParamsOptionId: true } },
                                subcategory: true
                            }
                        },
                        specialtyParams: {
                            select: { specialtyParams: { include: { options: true } } }
                        }
                    }
                }
            }
        })
    }

    findOne(id: SpecialtyId) {
        return this.prismaService.specialty.findUnique({
            where: { profileUserId_subcategoryId: id }
        })
    }

    update(id: SpecialtyId, updateSpecialtyDto: UpdateSpecialtyDto) {
        const { offers, params, ...rest } = updateSpecialtyDto
        return this.prismaService.specialty.update({
            where: { profileUserId_subcategoryId: id },
            data: {
                ...rest,
                offers: {
                    deleteMany: {},
                    createMany: { data: offers }
                },
                params: {
                    deleteMany: {},
                    createMany: { data: params }
                }
            }
        })
    }

    remove(id: SpecialtyId) {
        return this.prismaService.specialty.delete({
            where: { profileUserId_subcategoryId: id }
        })
    }
}
