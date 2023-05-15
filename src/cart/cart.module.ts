import { Module } from '@nestjs/common'
import { CartService } from './cart.service'
import { CartController } from './cart.controller'
import { JwtModule } from '@nestjs/jwt'
import { PrismaModule } from 'src/_common/prisma/prisma.module'

@Module({
  controllers: [CartController],
  providers: [CartService],
  imports: [JwtModule, PrismaModule]
})
export class CartModule { }
