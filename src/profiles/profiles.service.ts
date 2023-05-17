import { Injectable } from '@nestjs/common'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { PrismaService } from 'src/_common/prisma/prisma.service'

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
}
