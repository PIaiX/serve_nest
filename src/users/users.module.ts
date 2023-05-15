import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { PrismaModule } from 'src/_common/prisma/prisma.module'
import { JwtModule } from '@nestjs/jwt'
import { CryptoModule } from 'src/_common/crypto/crypto.module'

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PrismaModule, JwtModule, CryptoModule],
  exports: [UsersService]
})
export class UsersModule { }
