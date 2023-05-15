import { Injectable, UseGuards } from '@nestjs/common'
import { CreateCityDto } from './dto/create-city.dto'
import { UpdateCityDto } from './dto/update-city.dto'
import { PrismaService } from 'src/_common/prisma/prisma.service'
import { Role } from '@prisma/client'
import { Roles } from 'src/_common/guards/roles.decorator'
import { AuthGuard } from 'src/_common/guards/auth.guard'

@Injectable()
export class CitiesService {
  constructor(private readonly prismaService: PrismaService) { }

  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  create(createCityDto: CreateCityDto) {
    return this.prismaService.city.create({
      data: createCityDto
    })
  }

  findAll() {
    return this.prismaService.city.findMany()
  }

  findOne(id: number) {
    return this.prismaService.city.findUnique({
      where: { id }
    })
  }

  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  update(id: number, updateCityDto: UpdateCityDto) {
    return this.prismaService.city.update({
      where: { id },
      data: updateCityDto
    })
  }

  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  remove(id: number) {
    return this.prismaService.city.delete({
      where: { id }
    })
  }
}
