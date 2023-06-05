import { PartialType, PickType } from '@nestjs/swagger'
import { Profile } from '../entities/profile.entity'
import Prisma from '@prisma/client'

export class UpdateProfileDto extends PartialType(PickType(Profile, ['userId'] as const)) {
    isVisible?: boolean
    examples?: Omit<Example, 'id' | 'profileUserId'>[]
}

class Example implements Prisma.Example {
    id: number
    profileUserId: number
    image: string | null
    title: string | null
    description: string | null
    price: number | null
}