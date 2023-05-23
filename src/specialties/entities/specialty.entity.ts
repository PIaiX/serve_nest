import Prisma, { Locations } from "@prisma/client"

export class Specialty implements Prisma.Specialty {
    profileUserId: number
    subcategoryId: number
    categoryId: number
    days: string[]
    timeStart: string
    timeEnd: string
    additional: string | null
    tillDate: Date
    sale: number | null
    descr: string | null
    locations: Locations[]
    images: string[]
}

export class SpecialtyId {
    profileUserId: number
    subcategoryId: number
}

export class Offer implements Prisma.Offer {
    id: number
    specialtyProfileUserId: number
    specialtySubcategoryId: number
    title: string
    price: number
    priceUnit: string | null
}

export class ParamInSpecialty implements Prisma.ParamInSpecialty {
    specialtyParamsOptionId: number
    specialtyProfileUserId: number
    specialtySubcategoryId: number
}