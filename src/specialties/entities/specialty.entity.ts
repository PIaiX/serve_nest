import Prisma, { Locations } from "@prisma/client"

export class Specialty implements Prisma.Specialty {
    profileUserId: number
    subcategoryId: number
    categoryId: number
    isVisible: boolean
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

export class SpecialtyQueryParams {
    /* Page */
    page: number = 1

    /* Items per page */
    perPage?: number = 20

    /* Field name to order by */
    orderBy?: OrderBy = OrderBy.id

    /* Sort direction */
    sort?: Sort = Sort.asc

    filter?: string

    s?: string
}

enum Sort {
    asc = 'asc',
    desc = 'desc'
}

enum OrderBy {
    id = 'id',
    title = 'title',
    price = 'price'
}