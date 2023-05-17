import { FastifyRequest } from 'fastify'
import { Controller, Get, Post, Body, Patch, Param, UseGuards, ForbiddenException, Req } from '@nestjs/common'
import { ProfilesService } from './profiles.service'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { AuthGuard } from 'src/_common/guards/auth.guard'

@Controller('profiles')
@UseGuards(AuthGuard)
export class ProfilesController {
    constructor(private readonly profilesService: ProfilesService) { }

    @Get(':id')
    findOne(@Req() request: FastifyRequest, @Param('id') id: string) {
        if (request.headers.userId !== id) throw new ForbiddenException()
        return this.profilesService.findOne(+id)
    }

    @Patch(':id')
    update(@Req() request: FastifyRequest, @Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
        if (request.headers.userId !== id) throw new ForbiddenException()
        return this.profilesService.update(+id, updateProfileDto)
    }

}
