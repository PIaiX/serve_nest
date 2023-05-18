import { FastifyRequest } from 'fastify'
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common'
import { SpecialtiesService } from './specialties.service'
import { CreateSpecialtyDto } from './dto/create-specialty.dto'
import { UpdateSpecialtyDto } from './dto/update-specialty.dto'
import { AuthGuard } from 'src/_common/guards/auth.guard'
import { SpecialtyId } from './entities/specialty.entity'

@Controller('specialties')
@UseGuards(AuthGuard)
export class SpecialtiesController {
    constructor(private readonly specialtiesService: SpecialtiesService) { }

    @Post()
    create(@Req() request: FastifyRequest, @Body() createSpecialtyDto: CreateSpecialtyDto) {
        if (request.headers.userId !== createSpecialtyDto.profileUserId.toString()) throw new ForbiddenException()
        return this.specialtiesService.create(createSpecialtyDto)
    }

    @Get()
    findAll(@Req() request: FastifyRequest) {
        return this.specialtiesService.findAll(+request.headers.userId)
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.specialtiesService.findOne({ profileUserId: Number(id.split('_')[0]), subcategoryId: Number(id.split('_')[1]) })
    }

    @Patch(':id')
    update(@Req() request: FastifyRequest, @Param('id') id: string, @Body() updateSpecialtyDto: UpdateSpecialtyDto) {
        if (request.headers.userId !== updateSpecialtyDto.profileUserId.toString()) throw new ForbiddenException()
        // return this.specialtiesService.update(+id, updateSpecialtyDto)
    }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //   return this.specialtiesService.remove(+id)
    // }
}
