import Prisma, { Locations } from "@prisma/client"

export class Specialty implements Prisma.Specialty {
    profileUserId: number
    subcategoryId: number
    categoryId: number
    days: string[]
    timeStart: string[]
    timeEnd: string[]
    additional: string | null
    tillDate: Date
    sale: number | null
    descr: string | null
    locations: Locations[]
}

export class SpecialtyId {
    profileUserId: number
    subcategoryId: number
}