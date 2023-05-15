import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { PrismaModule } from 'src/_common/prisma/prisma.module'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from 'src/users/users.module'
import { CryptoModule } from 'src/_common/crypto/crypto.module'
import { MailService } from 'src/_common/mail/mail.service'

@Module({
  controllers: [AuthController],
  providers: [AuthService, MailService],
  imports: [UsersModule, PrismaModule, JwtModule, CryptoModule]
})
export class AuthModule { }
