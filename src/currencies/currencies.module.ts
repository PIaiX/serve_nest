import { Module } from '@nestjs/common'
import { CurrenciesService } from './currencies.service'
import { CurrenciesController } from './currencies.controller'
import { PrismaModule } from 'src/_common/prisma/prisma.module'
import { JwtModule } from '@nestjs/jwt'

// --------------------------------------------------------------------------------

@Module({
  controllers: [CurrenciesController],
  providers: [CurrenciesService],
  imports: [PrismaModule, JwtModule]
})
export class CurrenciesModule { }
