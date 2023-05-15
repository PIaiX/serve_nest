import Prisma from "@prisma/client"

export class Order implements Prisma.Order {
    id: number
    subcategoryId: number | null
    userId: number | null
    title: string
    description: string | null
    location: Locations
    cityId: number | null
    budget: number
    budgetType: string
    deadline: Date
    images: string[]
    phoneIsVisible: boolean
}

export enum Locations {
    HERE = 'HERE',
    THERE = 'THERE',
    REMOTE = 'REMOTE'
}