import { FastifyRequest } from 'fastify'
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, ForbiddenException } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { OrderQueryParams } from './entities/order.entity'
import { AuthGuard } from 'src/_common/guards/auth.guard'
import { CreateOrderResponseDto } from './dto/create-order-response.dto'

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    create(@Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.create(createOrderDto);
    }

    @Get()
    findAll(@Query() params: OrderQueryParams) {
        return this.ordersService.findAll(params)
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(+id);
    }

    @Patch(':id')
    update(@Req() request: FastifyRequest, @Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
        if (+request.headers.userId !== updateOrderDto.userId) throw new ForbiddenException()
        return this.ordersService.update(+id, updateOrderDto);
    }

    @Delete(':id')
    remove(@Req() request: FastifyRequest, @Param('id') id: string) {
        return this.ordersService.remove(+id, +request.headers.userId);
    }

    @Post(':id/response')
    respond(@Req() request: FastifyRequest, @Param('id') id: string, @Body() createOrderResponseDto: CreateOrderResponseDto) {
        return this.ordersService.respond(+id, +request.headers.userId, createOrderResponseDto);
    }

    @Delete(':id/response')
    removeResponse(@Req() request: FastifyRequest, @Param('id') id: string) {
        return this.ordersService.removeResponse(+id, +request.headers.userId);
    }

}
