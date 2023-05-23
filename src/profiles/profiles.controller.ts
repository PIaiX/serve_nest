import { FastifyRequest } from 'fastify'
import { Controller, Get, Post, Body, Patch, Param, UseGuards, ForbiddenException, Req, Delete } from '@nestjs/common'
import { ProfilesService } from './profiles.service'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { AuthGuard } from 'src/_common/guards/auth.guard'
import { CreateAddressDto } from './dto/create-address.dto'
import { UpdateAddressDto } from './dto/update-address.dto'

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

    @Post(':id/addresses')
    createAddress(@Req() request: FastifyRequest, @Param('id') id: string, @Body() createAddressDto: CreateAddressDto) {
        if (request.headers.userId !== id) throw new ForbiddenException()
        return this.profilesService.createAddress(+id, createAddressDto)
    }

    @Patch(':id/addresses/:addressId')
    updateAddress(@Req() request: FastifyRequest, @Param('addressId') id: string, @Body() updateAddressDto: UpdateAddressDto) {
        if (request.headers.userId !== id) throw new ForbiddenException()
        return this.profilesService.updateAddress(+id, updateAddressDto)
    }

    @Delete(':id/addresses/:addressId')
    deleteAddress(@Req() request: FastifyRequest, @Param('id') id: string, @Param('addressId') addressId: string) {
        if (request.headers.userId !== id) throw new ForbiddenException()
        return this.profilesService.deleteAddress(+addressId)
    }
}
