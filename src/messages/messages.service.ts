import { Injectable } from '@nestjs/common'
import { CreateMessageDto } from './dto/create-message.dto'
import { UpdateMessageDto } from './dto/update-message.dto'
import { PrismaService } from 'src/_common/prisma/prisma.service'

// --------------------------------------------------------------------------------

@Injectable()
export class MessagesService {
    constructor(private readonly prismaService: PrismaService) { }

    create(createMessageDto: CreateMessageDto) {
        return this.prismaService.chatMessages.create({
            data: createMessageDto
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
}
