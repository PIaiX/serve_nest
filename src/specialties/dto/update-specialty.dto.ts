import { OmitType, PartialType } from '@nestjs/swagger'
import { ParamInSpecialty, Specialty } from '../entities/specialty.entity'
import { Offer } from '@prisma/client'

export class UpdateSpecialtyDto extends PartialType(OmitType(Specialty, ['categoryId', 'subcategoryId'])) {
    offers?: Pick<Offer, 'title' | 'price' | 'priceUnit'>[]
    params?: Pick<ParamInSpecialty, 'specialtyParamsOptionId'>[]
}
