import Prisma from "@prisma/client"

// --------------------------------------------------------------------------------

export class Currency implements Prisma.Currency {
    id: number
    name: string | null
    symbol: string | null
}
