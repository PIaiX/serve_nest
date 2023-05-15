import { Injectable } from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { PrismaService } from 'src/_common/prisma/prisma.service';

@Injectable()
export class SubcategoriesService {
  constructor(private readonly prismaService: PrismaService) { }

  create(createSubcategoryDto: CreateSubcategoryDto) {
    return this.prismaService.subcategory.create({
      data: createSubcategoryDto
    })
  }

  findAll() {
    return this.prismaService.subcategory.findMany()
  }

  findOne(id: number) {
    return this.prismaService.subcategory.findFirst({
      where: { id }
    })
  }

  update(id: number, updateSubcategoryDto: UpdateSubcategoryDto) {
    return this.prismaService.subcategory.update({
      where: { id },
      data: updateSubcategoryDto
    })
  }

  remove(id: number) {
    return this.prismaService.subcategory.delete({
      where: { id }
    })
  }

}
