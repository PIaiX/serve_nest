import { PartialType, PickType } from '@nestjs/swagger'
import { Profile } from '../entities/profile.entity'

export class UpdateProfileDto extends PartialType(PickType(Profile, ['userId'] as const)) {
    isVisible?: boolean
}
