import Prisma from '@prisma/client'

export class Product implements Prisma.Product {

    /** Product ID */
    id: number

    /** Product title */
    title: string

    /** Product price */
    price: number

    /** Product vendor code */
    code: string

    /** Product description */
    description: string | null

    /** Product main image */
    image: string | null

    /** Product additional images */
    images: string[]

    /** Product visibility */
    isVisible: boolean

    /** Date and time the product has been created */
    createdAt: Date

    /** The user who has created the product */
    createdBy: string

    /** Date and time the product has been updated */
    updatedAt: Date | null

    /** The user who has updated the product */
    updatedBy: string | null
}
