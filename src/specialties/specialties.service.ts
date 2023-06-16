import { Injectable } from '@nestjs/common'
import { CreateSpecialtyDto } from './dto/create-specialty.dto'
import { UpdateSpecialtyDto } from './dto/update-specialty.dto'
import { PrismaService } from 'src/_common/prisma/prisma.service'
import { SpecialtyId, SpecialtyQueryParams } from './entities/specialty.entity'
import { Prisma } from '@prisma/client'
import { CreateOfferDto } from './dto/careste-offer.dto'
import { UpdateOfferDto } from './dto/update-offer.dto'

@Injectable()
export class SpecialtiesService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(createSpecialtyDto: CreateSpecialtyDto) {
        const { profileUserId, checked } = createSpecialtyDto
        return Promise.all(checked.map(async subcategoryId => {
            const category = await this.prismaService.category.findFirst({
                where: {
                    subcategories: {
                        some: { id: subcategoryId }
                    }
                }
            })
            return this.prismaService.specialty.upsert({
                where: {
                    profileUserId_subcategoryId: { profileUserId, subcategoryId }
                },
                update: {},
                create: {
                    profile: { connect: { userId: profileUserId } },
                    subcategory: { connect: { id: subcategoryId } },
                    categoryId: category.id
                }
            })
        }))
    }

    async findAllBySubcategory(params: SpecialtyQueryParams & { city: string }, id: number | undefined) {
        let take = params.perPage ? +params.perPage : 20
        let page = params.page ? +params.page : 1
        let skip = (page * take) - take
        let orderBy = params.orderBy ?? 'id'
        let sort = params.sort ?? 'asc'
        let search = params.s ?? ''

        const mode: Prisma.QueryMode = 'insensitive'

        const filter = {
            where: id !== 0 ? {
                subcategoryId: id,
                isVisible: true,
                profile: {
                    addresses: {
                        some: { city: { contains: params.city } }
                    }
                }
            } : {
                isVisible: true,
                offers: { some: { title: { contains: search, mode } } },
                profile: {
                    addresses: {
                        some: { city: { contains: params.city } }
                    }
                }
            }
        }

        const [count, specialties] = await Promise.all([
            this.prismaService.specialty.count(filter),
            this.prismaService.specialty.findMany({
                ...filter,
                distinct: ['profileUserId'],
                include: {
                    offers: {
                        include: {
                            currency: true
                        },
                        orderBy: { id: 'desc' }
                    },
                    profile: {
                        include: {
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    city: true
                                }
                            },
                            userReviews: true,
                            _count: {
                                select: { userReviews: true }
                            }
                        }
                    },
                },
                skip,
                take,
                // orderBy: { : sort }
            })
        ])
        let last = Math.ceil(count / take)
        return {
            specialties,
            pages: {
                first: 1,
                previous: page !== 1 ? page - 1 : null,
                current: page,
                next: page !== last ? page + 1 : null,
                last
            }
        }
    }

    findAllByUser(id: number) {
        return this.prismaService.category.findMany({
            where: {
                subcategories: {
                    some: {
                        specialties: {
                            some: {
                                profileUserId: id
                            }
                        }
                    }
                }
            },
            include: {
                subcategories: {
                    where: {
                        specialties: {
                            some: {
                                profileUserId: id
                            }
                        }
                    },
                    include: {
                        specialties: {
                            include: {
                                offers: {
                                    include: { currency: true },
                                    orderBy: { id: 'desc' }
                                },
                                params: { select: { specialtyParamsOptionId: true } },
                                subcategory: true,
                            }
                        },
                        specialtyParams: {
                            select: { specialtyParams: { include: { options: true } } }
                        }
                    }
                }
            }
        })
    }

    findOneByUser(id: SpecialtyId) {
        return this.prismaService.specialty.findUnique({
            where: { profileUserId_subcategoryId: id }
        })
    }

    update(id: SpecialtyId, updateSpecialtyDto: UpdateSpecialtyDto) {
        const { offers, params, ...rest } = updateSpecialtyDto
        return this.prismaService.specialty.update({
            where: { profileUserId_subcategoryId: id },
            data: {
                ...rest,
                params: {
                    deleteMany: {},
                    createMany: { data: params }
                }
            }
        })
    }

    remove(id: SpecialtyId) {
        return this.prismaService.specialty.delete({
            where: { profileUserId_subcategoryId: id }
        })
    }

    addOffer(profileUserId: number, subcategoryId: number, createOfferDto: CreateOfferDto) {
        const { currencyId, ...rest } = createOfferDto
        return this.prismaService.offer.create({
            data: {
                ...rest,
                specialty: {
                    connect: {
                        profileUserId_subcategoryId: { profileUserId, subcategoryId }
                    }
                },
                currency: {
                    connect: {
                        id: currencyId
                    }
                }
            }
        })
    }

    updateOffer(id: number, updateOfferDto: UpdateOfferDto) {
        return this.prismaService.offer.update({
            where: { id },
            data: updateOfferDto
        })
    }
}
