import { Controller, Get, Param, Query } from '@nestjs/common'
import { SpecialtiesService } from './specialties.service'
import { SpecialtyQueryParams } from './entities/specialty.entity'

@Controller('specialties')
export class SpecialtiesController {
    constructor(private readonly specialtiesService: SpecialtiesService) { }

    @Get(':subcategoryId')
    findAll(@Query() params: SpecialtyQueryParams, @Param('subcategoryId') subcategoryId: string) {
        return this.specialtiesService.findAllBySubcategory(params, +subcategoryId)
    }

    @Get(':subcategoryId/:profileUserId')
    findOne(@Param('subcategoryId') sId: string, @Param('profileUserId') uId: string) {
        return this.specialtiesService.findOneByUser({ profileUserId: +uId, subcategoryId: +sId })
    }

}
