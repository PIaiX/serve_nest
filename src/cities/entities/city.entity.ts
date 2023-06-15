import Prisma from "@prisma/client"

// --------------------------------------------------------------------------------

export class City implements Prisma.City {
    id: number
    en: string
    ru: string
}
