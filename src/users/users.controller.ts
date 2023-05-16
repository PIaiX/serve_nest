import { FastifyRequest } from 'fastify'
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException, Query } from '@nestjs/common'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { AuthGuard } from 'src/_common/guards/auth.guard'
import { Roles } from 'src/_common/guards/roles.decorator'
import { User, Users } from './entities/user.entity'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { PaginationQueryParams } from 'src/_common/@types/pagination.entity'
import { UpdateUserPasswordDto } from './dto/update-user-password.dto'

@Controller('users')
@UseGuards(AuthGuard)
@ApiTags('Users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    /** Get all user (ADMIN) */
    @Get()
    @Roles('ADMIN')
    @ApiOkResponse({ type: Users })
    findAll(@Query() params: PaginationQueryParams) {
        return this.usersService.findAll()
    }

    /** Get user by ID */
    @Get(':id')
    @ApiOkResponse({ type: User })
    findOne(@Req() request: FastifyRequest, @Param('id') id: string) {
        if (request.headers.userId !== id) throw new ForbiddenException()
        return this.usersService.findOne(+id)
    }

    /** Update user info */
    @Patch(':id')
    @ApiOkResponse({ type: User })
    update(@Req() request: FastifyRequest, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        if (request.headers.userId !== id) throw new ForbiddenException()
        return this.usersService.update(+id, updateUserDto)
    }

    /** Delete user */
    @Delete(':id')
    @ApiOkResponse({ type: User })
    remove(@Req() request: FastifyRequest, @Param('id') id: string) {
        if (request.headers.userId !== id) throw new ForbiddenException()
        return this.usersService.remove(+id)
    }

    /** Update password */
    @Post('update-password')
    @ApiOkResponse({ type: User })
    updatePassword(@Req() request: FastifyRequest, @Body() { password, currentPassword }: UpdateUserPasswordDto) {
        return this.usersService.updatePassword(+request.headers.userId, password, currentPassword)
    }

    /** Get user orders */
    @Get(':id/orders')
    @ApiOkResponse({ type: User })
    userOrders(@Req() request: FastifyRequest, @Param('id') id: string) {
        if (request.headers.userId !== id) throw new ForbiddenException()
        return this.usersService.userOrders(+id)
    }
}
