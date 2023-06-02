import Prisma from "@prisma/client"

// --------------------------------------------------------------------------------

export class ProfileReview implements Prisma.ProfileReview {
    id: number
    profileUserId: number
    specialtyProfileUserId: number
    specialtySubcategoryId: number
    userId: number
    review: string | null
    rating: number
    createdAt: Date
}
