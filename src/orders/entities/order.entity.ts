import Prisma from "@prisma/client"

export class Order implements Prisma.Order {
    id: number
    subcategoryId: number | null
    userId: number | null
    title: string
    description: string | null
    location: Locations
    cityId: number | null
    currencyId: number | null
    budget: number
    budgetType: string
    deadline: Date
    files: string[]
    phoneIsVisible: boolean
    isActive: boolean
    createdAt: Date
}

export enum Locations {
    HERE = 'HERE',
    THERE = 'THERE',
    REMOTE = 'REMOTE'
}

export class OrderResponse implements Prisma.Response {
    userId: number
    orderId: number
    description: string | null
    price: number | null
    priceUnit: string | null
    files: string[]
}

export class OrderQueryParams {
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

    subcatId?: string
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