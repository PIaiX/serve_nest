import { OmitType, PartialType } from '@nestjs/swagger'
import { Specialty } from '../entities/specialty.entity'

export class UpdateSpecialtyDto extends PartialType(OmitType(Specialty, ['categoryId', 'subcategoryId'])) { }
