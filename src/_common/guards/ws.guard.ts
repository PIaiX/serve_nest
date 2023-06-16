import { Injectable, CanActivate } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { WsException } from '@nestjs/websockets'
import { Exeption, accessTokenOptions } from 'src/constants'

@Injectable()
export class WsGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: any): Promise<boolean> {

        const headers = context.args[0].handshake.headers
        if (!headers.authorization)
            throw new WsException(Exeption.NOT_AUTHORIZED)

        const [tokenPrefix, accessToken] = headers.authorization.split(' ')
        if (tokenPrefix !== 'Bearer' || !accessToken)
            throw new WsException(Exeption.NOT_AUTHORIZED)

        try {
            const { userId } = await this.jwtService.verifyAsync(accessToken, accessTokenOptions)
            headers.userId = userId

            return true

        } catch {
            throw new WsException(Exeption.BAD_TOKEN)
        }
    }
}