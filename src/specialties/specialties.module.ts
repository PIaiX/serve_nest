import { Module } from '@nestjs/common'
import { SpecialtiesService } from './specialties.service'
import { SpecialtiesController } from './specialties.controller'
import { PrismaModule } from 'src/_common/prisma/prisma.module'
import { JwtModule } from '@nestjs/jwt'

@Module({
  controllers: [SpecialtiesController],
  providers: [SpecialtiesService],
  imports: [PrismaModule, JwtModule],
  exports: [SpecialtiesService]
})
export class SpecialtiesModule { }
