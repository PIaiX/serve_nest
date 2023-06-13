import { Injectable } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { PrismaService } from 'src/_common/prisma/prisma.service'

@Injectable()
export class CategoriesService {
    constructor(private readonly prismaService: PrismaService) { }

    create(createCategoryDto: CreateCategoryDto) {
        return this.prismaService.category.create({
            data: createCategoryDto
        })
    }

    findAll(city: string) {
        return this.prismaService.category.findMany({
            include: {
                subcategories: {
                    include: {
                        _count: {
                            select: {
                                specialties: {
                                    where: {
                                        profile: {
                                            addresses: {
                                                some: { city: { contains: city } }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        specialties: {
                            _count: 'desc'
                        }
                    }
                }
            }
        })
    }

    findOne(id: number) {
        return this.prismaService.category.findUnique({
            where: { id }
        })
    }

    update(id: number, updateCategoryDto: UpdateCategoryDto) {
        return this.prismaService.category.update({
            where: { id },
            data: updateCategoryDto
        })
    }

    remove(id: number) {
        return this.prismaService.category.delete({
            where: { id }
        })
    }

}
