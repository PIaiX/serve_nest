import { Injectable } from '@nestjs/common'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { PrismaService } from 'src/_common/prisma/prisma.service'

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) { }

  create(createOrderDto: CreateOrderDto) {
    return this.prismaService.order.create({
      data: createOrderDto
    })
  }

  findAll() {
    return this.prismaService.order.findMany()
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
}
