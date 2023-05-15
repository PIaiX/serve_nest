import { Injectable } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { PrismaService } from 'src/_common/prisma/prisma.service'

@Injectable()
export class ProductsService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(createProductDto: CreateProductDto, id: number) {
        const user = await this.prismaService.user.findUnique({ where: { id } })
        return this.prismaService.product.create({
            data: {
                ...createProductDto,
                createdBy: `${user.firstName} ${user.lastName}`
            }
        })
    }

    async findAll() {
        return `This action returns all products`
    }

    async findOne(id: number) {
        return `This action returns a #${id} product`
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        return `This action updates a #${id} product`
    }

    async remove(id: number) {
        return `This action removes a #${id} product`
    }
}
