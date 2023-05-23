import { Injectable } from '@nestjs/common'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { PrismaService } from 'src/_common/prisma/prisma.service'
import { CreateAddressDto } from './dto/create-address.dto'
import { UpdateAddressDto } from './dto/update-address.dto'

@Injectable()
export class ProfilesService {
    constructor(private readonly prismaService: PrismaService) { }

    findOne(userId: number) {
        return this.prismaService.profile.findUnique({
            where: { userId },
            include: {
                addresses: true,
                specialties: true
            }
        })
    }

    update(userId: number, updateProfileDto: UpdateProfileDto) {
        return this.prismaService.profile.update({
            where: { userId },
            data: updateProfileDto
        })
    }

    createAddress(userId: number, createAddressDto: CreateAddressDto) {
        return this.prismaService.address.create({
            data: {
                ...createAddressDto,
                profile: {
                    connect: { userId }
                }
            }
        })
    }

    updateAddress(id: number, updateAddressDto: UpdateAddressDto) {
        return this.prismaService.address.update({
            where: { id },
            data: updateAddressDto
        })
    }

    deleteAddress(id: number) {
        return this.prismaService.address.delete({
            where: { id }
        })
    }
}
