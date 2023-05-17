import { Module } from '@nestjs/common'
import { ProfilesService } from './profiles.service'
import { ProfilesController } from './profiles.controller'
import { PrismaModule } from 'src/_common/prisma/prisma.module'
import { JwtModule } from '@nestjs/jwt'

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService],
  imports: [PrismaModule, JwtModule]
})
export class ProfilesModule { }
