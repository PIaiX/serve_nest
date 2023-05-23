import { Injectable } from '@nestjs/common'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { PrismaService } from 'src/_common/prisma/prisma.service'
import { OrderQueryParams } from './entities/order.entity'

@Injectable()
export class OrdersService {
    constructor(private readonly prismaService: PrismaService) { }

    create(createOrderDto: CreateOrderDto) {
        return this.prismaService.order.create({
            data: createOrderDto
        })
    }

    async findAll(params: OrderQueryParams, userId?: number) {
        let take = params.perPage ? +params.perPage : 20
        let page = params.page ? +params.page : 1
        let skip = (page * take) - take
        let orderBy = params.orderBy ?? 'id'
        let sort = params.sort ?? 'asc'
        let search = params.s ?? ''

        const userRespondedOrders = userId ? {
            responses: {
                some: {
                    userId
                }
            }
        } : {}

        const filter = {
            where: {
                isActive: true,
                ...userRespondedOrders
            }
        }

        const [count, orders] = await Promise.all([
            this.prismaService.order.count(filter),
            this.prismaService.order.findMany({
                ...filter,
                include: {
                    subcategory: {
                        select: {
                            name: true,
                            category: { select: { name: true } }
                        }
                    },
                    city: true,
                    responses: true,
                    user: {
                        select: {
                            firstName: true,
                            profile: {
                                select: { image: true }
                            }
                        }
                    }
                },
                skip,
                take,
                orderBy: { [orderBy]: sort }
            })
        ])
        let last = Math.ceil(count / take)
        return {
            orders,
            pages: {
                first: 1,
                previous: page !== 1 ? page - 1 : null,
                current: page,
                next: page !== last ? page + 1 : null,
                last
            }
        }
    }

    findOne(id: number) {
        return this.prismaService.order.findFirst({
            where: { id }
        })
    }

    update(id: number, updateOrderDto: UpdateOrderDto) {
        return this.prismaService.order.update({
            where: { id },
            data: updateOrderDto
        })
    }

    remove(id: number) {
        return this.prismaService.order.delete({
            where: { id }
        })
    }

    respond(orderId: number, userId: number) {
        return this.prismaService.response.create({
            data: {
                userId,
                orderId
            }
        })
    }

    removeResponse(orderId: number, userId: number) {
        return this.prismaService.response.delete({
            where: {
                userId_orderId: {
                    userId,
                    orderId
                }
            }
        })
    }
}
