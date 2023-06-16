import { Injectable } from '@nestjs/common'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { PrismaService } from 'src/_common/prisma/prisma.service'
import { OrderQueryParams } from './entities/order.entity'
import { CreateOrderResponseDto } from './dto/create-order-response.dto'

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

        const subcategory = params.subcatId ? {
            subcategoryId: +params.subcatId
        } : {}

        const filter = {
            where: {
                isActive: true,
                ...userRespondedOrders,
                ...subcategory
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
                            category: { select: { id: true, name: true } }
                        }
                    },
                    city: true,
                    responses: true,
                    currency: true,
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
        return this.prismaService.order.findUnique({
            where: { id },
            include: {
                subcategory: {
                    select: {
                        name: true,
                        category: { select: { id: true, name: true } }
                    }
                },
                city: true,
                responses: true,
                currency: true,
                user: {
                    select: {
                        firstName: true,
                        profile: {
                            select: { image: true }
                        }
                    }
                }
            }
        })
    }

    update(id: number, updateOrderDto: UpdateOrderDto) {
        return this.prismaService.order.update({
            where: { id },
            data: updateOrderDto
        })
    }

    remove(id: number, userId: number) {
        return this.prismaService.order.deleteMany({
            where: { id, userId }
        })
    }

    respond(orderId: number, userId: number, createOrderResponseDto?: CreateOrderResponseDto) {
        return this.prismaService.response.create({
            data: {
                userId,
                orderId,
                ...createOrderResponseDto
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
