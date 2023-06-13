import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { SpecialtiesService } from './specialties.service'
import { SpecialtyQueryParams } from './entities/specialty.entity'
import { CreateOfferDto } from './dto/careste-offer.dto'
import { UpdateOfferDto } from './dto/update-offer.dto'

@Controller('specialties')
export class SpecialtiesController {
    constructor(private readonly specialtiesService: SpecialtiesService) { }

    @Get(':subcategoryId')
    findAll(@Query() params: SpecialtyQueryParams & { city: string }, @Param('subcategoryId') subcategoryId: string) {
        return this.specialtiesService.findAllBySubcategory(params, +subcategoryId)
    }

    @Get(':subcategoryId/:profileUserId')
    findOne(@Param('subcategoryId') sId: string, @Param('profileUserId') uId: string) {
        return this.specialtiesService.findOneByUser({ profileUserId: +uId, subcategoryId: +sId })
    }

    @Post(':subcategoryId/:profileUserId/offers')
    addOffer(@Param('subcategoryId') sId: string, @Param('profileUserId') uId: string, @Body() createOfferDto: CreateOfferDto) {
        return this.specialtiesService.addOffer(+uId, +sId, createOfferDto)
    }

    @Patch(':subcategoryId/:profileUserId/offers/:id')
    updateOffer(@Param('id') id: string, @Body() updateOfferDto: UpdateOfferDto) {
        return this.specialtiesService.updateOffer(+id, updateOfferDto)
    }

}
