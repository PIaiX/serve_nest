import { FastifyReply, FastifyRequest } from 'fastify'
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common'
import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { AuthGuard } from 'src/_common/guards/auth.guard'
import { Roles } from 'src/_common/guards/roles.decorator'
import { ApiTags } from '@nestjs/swagger'

@Controller('products')
@ApiTags('Products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @UseGuards(AuthGuard)
    @Roles('ADMIN', 'MANAGER')
    create(@Req() request: FastifyRequest, @Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto, +request.headers.userId)
    }

    @Get()
    findAll() {
        return this.productsService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(+id)
    }

    @Patch(':id')
    @UseGuards(AuthGuard)
    @Roles('ADMIN', 'MANAGER')
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(+id, updateProductDto)
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    @Roles('ADMIN', 'MANAGER')
    remove(@Param('id') id: string) {
        return this.productsService.remove(+id)
    }
}
