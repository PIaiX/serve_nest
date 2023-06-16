import Prisma from "@prisma/client"

// --------------------------------------------------------------------------------

export class Message implements Prisma.ChatMessages {
    id: string
    senderId: number
    recipientId: number
    text: string
    files: string[]
    createdAt: Date
}