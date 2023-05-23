import { FastifyRequest } from 'fastify'
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { OrderQueryParams } from './entities/order.entity'
import { AuthGuard } from 'src/_common/guards/auth.guard'

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
    update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
        return this.ordersService.update(+id, updateOrderDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.ordersService.remove(+id);
    }

    @Post(':id/response')
    respond(@Req() request: FastifyRequest, @Param('id') id: string) {
        return this.ordersService.respond(+id, +request.headers.userId);
    }

    @Delete(':id/response')
    removeResponse(@Req() request: FastifyRequest, @Param('id') id: string) {
        return this.ordersService.removeResponse(+id, +request.headers.userId);
    }

}
