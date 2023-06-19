import { Injectable } from '@nestjs/common'
import { CreateMessageDto } from './dto/create-message.dto'
import { UpdateMessageDto } from './dto/update-message.dto'
import { PrismaService } from 'src/_common/prisma/prisma.service'

// --------------------------------------------------------------------------------

@Injectable()
export class MessagesService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(createMessageDto: CreateMessageDto) {
        const { senderId, recipientId, ...rest } = createMessageDto
        const userOneId = senderId < recipientId ? senderId : recipientId
        const userTwoId = senderId > recipientId ? senderId : recipientId
        return this.prismaService.chatMessages.create({
            data: {
                ...rest,
                sender: { connect: { id: senderId } },
                recipient: { connect: { id: recipientId } },
                chat: {
                    connectOrCreate: {
                        where: { userOneId_userTwoId: { userOneId, userTwoId } },
                        create: { userOneId, userTwoId }
                    }
                }
            }

        })
    }

    findAll(senderId: number) {
        return this.prismaService.chatMessages.findMany({
            where: { senderId }
        })
    }

    findOne(id: number) {
        return `This action returns a #${id} message`
    }

    update(id: number, updateMessageDto: UpdateMessageDto) {
        return `This action updates a #${id} message`
    }

    remove(id: number) {
        return `This action removes a #${id} message`
    }

    findAllChats(userId: number) {
        const getName = {
            select: {
                id: true,
                firstName: true,
                avatar: true
            }
        }
        return this.prismaService.chat.findMany({
            where: {
                OR: [
                    { userOneId: userId },
                    { userTwoId: userId },
                ]
            },
            include: {
                userOne: getName,
                userTwo: getName,
                messages: {
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                    include: { sender: getName }
                }
            }
        })
    }
}
