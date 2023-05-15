import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { Exeption } from 'src/constants'

@Injectable()
export class FingerprintGuard implements CanActivate {
    constructor() { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<FastifyRequest>()

        if (!request.headers.fingerprint)
            throw new BadRequestException(Exeption.NO_FINGERPRINT)

        return true
    }
}