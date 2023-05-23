import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { PrismaModule } from 'src/_common/prisma/prisma.module'
import { JwtModule } from '@nestjs/jwt'
import { CryptoModule } from 'src/_common/crypto/crypto.module'
import { UserSpetialtiesController } from './user-specialties.controller'
import { SpecialtiesModule } from 'src/specialties/specialties.module'
import { OrdersModule } from 'src/orders/orders.module'

@Module({
  controllers: [UsersController, UserSpetialtiesController],
  providers: [UsersService],
  imports: [PrismaModule, JwtModule, CryptoModule, SpecialtiesModule, OrdersModule],
  exports: [UsersService]
})
export class UsersModule { }
