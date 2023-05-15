import { OmitType } from "@nestjs/swagger"
import { Subcategory } from "../entities/subcategory.entity"

export class CreateSubcategoryDto extends OmitType(Subcategory, ['id'] as const) { }
