import { OmitType, PartialType, PickType } from "@nestjs/swagger"
import { Specialty } from "../entities/specialty.entity"

export class CreateSpecialtyDto {
    profileUserId: number
    checked: number[]
}
