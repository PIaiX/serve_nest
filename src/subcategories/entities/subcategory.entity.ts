import Prisma from "@prisma/client"

export class Subcategory implements Prisma.Subcategory {
    id: number
    categoryId: number | null
    name: string
}
