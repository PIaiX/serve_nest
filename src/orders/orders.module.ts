import { Module } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { OrdersController } from './orders.controller'
import { PrismaModule } from 'src/_common/prisma/prisma.module'

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [PrismaModule]
})
export class OrdersModule { }
