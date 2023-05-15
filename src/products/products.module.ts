import { Module } from '@nestjs/common'
import { ProductsService } from './products.service'
import { ProductsController } from './products.controller'
import { JwtModule } from '@nestjs/jwt'
import { PrismaModule } from 'src/_common/prisma/prisma.module'

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [JwtModule, PrismaModule]
})
export class ProductsModule { }
