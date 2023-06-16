import { WebSocketGateway, SubscribeMessage, MessageBody, WsException } from '@nestjs/websockets'
import { MessagesService } from './messages.service'
import { CreateMessageDto } from './dto/create-message.dto'
import { UpdateMessageDto } from './dto/update-message.dto'
import { Socket } from 'socket.io'
import { Exeption } from 'src/constants'
import { WsGuard } from 'src/_common/guards/ws.guard'
import { UseGuards } from '@nestjs/common'

// --------------------------------------------------------------------------------

@WebSocketGateway(5050, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
})
@UseGuards(WsGuard)
export class MessagesGateway {
    constructor(private readonly messagesService: MessagesService) { }

    @SubscribeMessage('message:create')
    create(client: Socket, createChatDto: CreateMessageDto) {
        const senderId = this.getUser(client)
        return this.messagesService.create({ ...createChatDto, senderId })
    }

    @SubscribeMessage('message:get')
    findAll(client: Socket) {
        const senderId = this.getUser(client)
        return this.messagesService.findAll(senderId)
    }

    @SubscribeMessage('message:find')
    findOne(client: Socket, id: number) {
        const senderId = this.getUser(client)
        return this.messagesService.findOne(id)
    }

    @SubscribeMessage('message:update')
    update(client: Socket, updateMessageDto: UpdateMessageDto) {
        const senderId = this.getUser(client)
        return this.messagesService.update(updateMessageDto.id, updateMessageDto)
    }

    @SubscribeMessage('message:remove')
    remove(client: Socket, id: number) {
        const senderId = this.getUser(client)
        return this.messagesService.remove(id)
    }

    private getUser(client: Socket) {
        if (!client.handshake.headers.userId) throw new WsException(Exeption.NOT_AUTHORIZED)
        return +client.handshake.headers.userId
    }
}
