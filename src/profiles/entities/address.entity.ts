import Prisma from "@prisma/client"

export class Address implements Prisma.Address {
    id: number
    title: string | null
    postcode: string | null
    country: string | null
    region: string | null
    city: string | null
    streetName: string | null
    buildingNumber: string | null
    entrance: string | null
    storey: string | null
    apartment: string | null
    profileUserId: number
}