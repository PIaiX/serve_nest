import { Module } from '@nestjs/common'
import { CitiesService } from './cities.service'
import { CitiesController } from './cities.controller'
import { PrismaModule } from 'src/_common/prisma/prisma.module'
import { JwtModule } from '@nestjs/jwt'

// --------------------------------------------------------------------------------

@Module({
  controllers: [CitiesController],
  providers: [CitiesService],
  imports: [PrismaModule, JwtModule]
})
export class CitiesModule { }
