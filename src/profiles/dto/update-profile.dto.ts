import { PartialType, PickType } from '@nestjs/swagger'
import { Profile } from '../entities/profile.entity'
import Prisma from '@prisma/client'

export class UpdateProfileDto extends PartialType(PickType(Profile, ['userId'] as const)) {
    isVisible?: boolean
}