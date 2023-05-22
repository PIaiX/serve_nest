import { Controller, Get, Param } from '@nestjs/common'
import { SpecialtiesService } from './specialties.service'

@Controller('specialties')
export class SpecialtiesController {
    constructor(private readonly specialtiesService: SpecialtiesService) { }

    @Get(':subcategoryId')
    findAll(@Param('subcategoryId') subcategoryId: string) {
        return this.specialtiesService.findAllBySubcategory(+subcategoryId)
    }

    @Get(':subcategoryId/:profileUserId')
    findOne(@Param('subcategoryId') sId: string, @Param('profileUserId') uId: string) {
        return this.specialtiesService.findOneByUser({ profileUserId: +uId, subcategoryId: +sId })
    }

}
