import { FastifyRequest } from 'fastify'
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException, Query } from '@nestjs/common'
import { AuthGuard } from 'src/_common/guards/auth.guard'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { SpecialtiesService } from 'src/specialties/specialties.service'
import { CreateSpecialtyDto } from 'src/specialties/dto/create-specialty.dto'
import { UpdateSpecialtyDto } from 'src/specialties/dto/update-specialty.dto'

@Controller('users/:userId/specialties')
@UseGuards(AuthGuard)
@ApiTags('User specialties')
export class UserSpetialtiesController {
    constructor(private readonly specialtiesService: SpecialtiesService) { }

    @Post()
    create(@Req() request: FastifyRequest, @Body() createSpecialtyDto: CreateSpecialtyDto) {
        if (request.headers.userId !== createSpecialtyDto.profileUserId.toString()) throw new ForbiddenException()
        return this.specialtiesService.create(createSpecialtyDto)
    }

    @Get()
    findAll(@Req() request: FastifyRequest, @Param('userId') userId: string) {
        if (request.headers.userId !== userId.toString()) throw new ForbiddenException()
        return this.specialtiesService.findAllByUser(+request.headers.userId)
    }

    @Get(':id')
    findOne(@Req() request: FastifyRequest, @Param('userId') userId: string, @Param('id') id: string) {
        if (request.headers.userId !== userId.toString()) throw new ForbiddenException()
        return this.specialtiesService.findOneByUser({ profileUserId: +request.headers.userId, subcategoryId: +id })
    }

    @Patch(':id')
    update(@Req() request: FastifyRequest, @Param('userId') userId: string, @Param('id') id: string, @Body() updateSpecialtyDto: UpdateSpecialtyDto) {
        if (request.headers.userId !== userId.toString()) throw new ForbiddenException()
        return this.specialtiesService.update({ profileUserId: +request.headers.userId, subcategoryId: +id }, updateSpecialtyDto)
    }

    @Delete(':id')
    remove(@Req() request: FastifyRequest, @Param('userId') userId: string, @Param('id') id: string) {
        if (request.headers.userId !== userId.toString()) throw new ForbiddenException()
        return this.specialtiesService.remove({ profileUserId: +request.headers.userId, subcategoryId: +id })
    }
}
