import { Injectable } from '@nestjs/common'
import { CreateCityDto } from './dto/create-city.dto'
import { UpdateCityDto } from './dto/update-city.dto'
import { PrismaService } from 'src/_common/prisma/prisma.service'

// --------------------------------------------------------------------------------

@Injectable()
export class CitiesService {
    constructor(private readonly prismaService: PrismaService) { }

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

    update(id: number, updateCityDto: UpdateCityDto) {
        return this.prismaService.city.update({
            where: { id },
            data: updateCityDto
        })
    }

    remove(id: number) {
        return this.prismaService.city.delete({
            where: { id }
        })
    }
}
