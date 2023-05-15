import { Module } from '@nestjs/common'
import { MailService } from './mail.service'
import { PrismaModule } from 'src/_common/prisma/prisma.module'
import { JwtModule } from '@nestjs/jwt'

@Module({
    providers: [MailService],
    exports: [MailService],
    imports: [PrismaModule, JwtModule]
})
export class MailModule { }
