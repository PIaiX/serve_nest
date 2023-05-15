import Prisma from "@prisma/client"

export class Category implements Prisma.Category {
    id: number
    name: string
}
