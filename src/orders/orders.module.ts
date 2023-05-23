import { Module } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { OrdersController } from './orders.controller'
import { PrismaModule } from 'src/_common/prisma/prisma.module'
import { JwtModule } from '@nestjs/jwt'

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [PrismaModule, JwtModule],
  exports: [OrdersService]
})
export class OrdersModule { }
