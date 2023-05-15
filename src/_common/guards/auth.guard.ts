import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { FastifyRequest } from 'fastify'
import { Exeption, accessTokenOptions } from 'src/constants'

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler())

        const request = context.switchToHttp().getRequest<FastifyRequest>()
        if (!request.headers.authorization)
            throw new UnauthorizedException(Exeption.NOT_AUTHORIZED)

        const [tokenPrefix, accessToken] = request.headers.authorization.split(' ')
        if (tokenPrefix !== 'Bearer' || !accessToken)
            throw new UnauthorizedException(Exeption.NOT_AUTHORIZED)

        try {
            const { userId, role } = await this.jwtService.verifyAsync(accessToken, accessTokenOptions)
            request.headers.userId = userId.toString()

            if (!requiredRoles) return true

            for (let i = 0; i < requiredRoles.length; i++) {
                if (role === requiredRoles[i]) return true
            }

        } catch {
            throw new UnauthorizedException(Exeption.BAD_TOKEN)
        }
        throw new ForbiddenException(Exeption.ACCESS_IS_DENIED)
    }
}