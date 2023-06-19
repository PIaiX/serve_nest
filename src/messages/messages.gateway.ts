import { WebSocketGateway, SubscribeMessage, MessageBody, WsException, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets'
import { MessagesService } from './messages.service'
import { CreateMessageDto } from './dto/create-message.dto'
import { UpdateMessageDto } from './dto/update-message.dto'
import { Server, Socket } from 'socket.io'
import { Exeption, accessTokenOptions } from 'src/constants'
import { WsGuard } from 'src/_common/guards/ws.guard'
import { UseGuards } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

// --------------------------------------------------------------------------------

@WebSocketGateway(5050, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
})
@UseGuards(WsGuard)
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly messagesService: MessagesService, private readonly jwtService: JwtService) { }

    @WebSocketServer()
    server: Server;

    async handleConnection(client: Socket) {
        const userId = await this.getUserIdFromToken(client)
        if (!userId) {
            client.emit('connection', Exeption.NOT_AUTHORIZED)
            return client.disconnect()
        }
        client.join(`${userId}`)
        console.log('\x1b[32m%s\x1b[0m', `[WS server]  -`, `User ${userId} connected`)
        client.emit('connection', 'Successfully connected to server')
    }

    async handleDisconnect(client: Socket) {
        const userId = await this.getUserIdFromToken(client)
        console.log('\x1b[32m%s\x1b[0m', `[WS server]  -`, `User ${userId ?? 'unauthorised and'} disconnected`)
    }

    @SubscribeMessage('chats')
    findAllChats(client: Socket, createChatDto: CreateMessageDto) {
        const userId = this.getUser(client)
        return this.messagesService.findAllChats(userId)
    }

    @SubscribeMessage('message:create')
    async create(client: Socket, createChatDto: CreateMessageDto) {
        const { recipientId } = createChatDto
        const senderId = this.getUser(client)

        const recipientChats = await this.messagesService.findAllChats(recipientId)
        client.to(`${recipientId}`).emit('chats', recipientChats)

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
        // if (!client.handshake.headers.userId) throw new WsException(Exeption.NOT_AUTHORIZED)
        return +client.handshake.headers.userId
    }

    private async getUserIdFromToken(client: Socket) {
        try {
            const headers = client.handshake.headers
            if (!headers.authorization) return undefined

            const [tokenPrefix, accessToken] = headers.authorization.split(' ')
            const { userId } = await this.jwtService.verifyAsync(accessToken, accessTokenOptions) as { userId: number }
            return userId
        } catch (e) {
            // console.log(e)
        }
    }
}
