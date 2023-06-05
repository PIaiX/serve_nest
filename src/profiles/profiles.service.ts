import { Injectable } from '@nestjs/common'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { PrismaService } from 'src/_common/prisma/prisma.service'
import { CreateAddressDto } from './dto/create-address.dto'
import { UpdateAddressDto } from './dto/update-address.dto'
import { CreateProfileReviewDto } from './dto/create-profile-review.dto'
import { UpdateProfileReviewDto } from './dto/update-profile-review.dto'

@Injectable()
export class ProfilesService {
    constructor(private readonly prismaService: PrismaService) { }

    findOne(userId: number) {
        return this.prismaService.profile.findUnique({
            where: { userId },
            include: {
                user: true,
                addresses: true,
                specialties: {
                    include: {
                        offers: true,
                        subcategory: {
                            select: {
                                name: true,
                                category: {
                                    select: { name: true }
                                }
                            }
                        },
                        params: {
                            select: {
                                specialtyParamsOption: {
                                    select: {
                                        name: true,
                                        specialtyParams: {
                                            select: { name: true }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                userReviews: true,
                _count: { select: { userReviews: true } }

            }
        })
    }

    update(userId: number, updateProfileDto: UpdateProfileDto) {
        const { isVisible, ...rest } = updateProfileDto
        return this.prismaService.profile.update({
            where: { userId },
            data: {
                ...rest,
                specialties: {
                    updateMany: {
                        where: {},
                        data: "isVisible" in updateProfileDto ? { isVisible } : {}
                    }
                }
            }
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

    createProfileReview(id: number, profileUserId: number, createProfileReviewDto: CreateProfileReviewDto) {
        const { subcategoryId, ...rest } = createProfileReviewDto
        return this.prismaService.profileReview.create({
            data: {
                ...rest,
                user: { connect: { id } },
                profile: { connect: { userId: profileUserId } },
                specialty: {
                    connect: {
                        profileUserId_subcategoryId: {
                            profileUserId,
                            subcategoryId
                        }
                    }
                }
            }
        })
    }

    findProfileReviews(profileUserId: number) {
        return this.prismaService.profileReview.findMany({
            where: { profileUserId },
            include: {
                user: true,
                specialty: {
                    select: {
                        subcategory: {
                            select: {
                                id: true,
                                name: true,
                                category: { select: { id: true, name: true } }
                            }
                        }
                    }
                }
            }
        })
    }

    findOneProfileReview(id: number) {
        return this.prismaService.profileReview.findUnique({
            where: { id }
        })
    }

    updateProfileReview(id: number, updateProfileReviewDto: UpdateProfileReviewDto) {
        return this.prismaService.profileReview.update({
            where: { id },
            data: updateProfileReviewDto
        })
    }

    removProfileReview(id: number) {
        return this.prismaService.profileReview.delete({
            where: { id }
        })
    }
}
