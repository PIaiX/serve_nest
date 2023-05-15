import { Injectable, NestInterceptor, ExecutionContext, CallHandler, InternalServerErrorException } from '@nestjs/common'
import { Observable } from 'rxjs'
import { FastifyRequest } from 'fastify'

import { writeFile } from 'fs/promises'
import { join, resolve } from 'path'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class FormDataInterceptor implements NestInterceptor {

    private uploadPath = process.env.UPLOAD_PATH

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest() as FastifyRequest

        if (!request.isMultipart())
            return next.handle()

        const parts = request.parts()
        let body = {}

        for await (const part of parts) {

            // if file
            if (part.type === 'file') {
                const uuid = uuidv4()
                try {
                    await writeFile(join(this.uploadPath, `${uuid}-${part.filename.split('.').pop()}`), part.file)
                } catch (e) {
                    throw new InternalServerErrorException()
                }

                if (body[part.fieldname]) {
                    let arr = []

                    if (Array.isArray(body[part.fieldname])) {
                        arr.push(`/upload/${uuid}-${part.filename.split('.').pop()}`, ...body[part.fieldname])
                    } else {
                        arr.push(`/upload/${uuid}-${part.filename.split('.').pop()}`, body[part.fieldname])
                    }

                    body[part.fieldname] = arr
                } else {
                    body[part.fieldname] = `/upload/${uuid}-${part.filename.split('.').pop()}`
                }

            } else if (part.fieldname === 'serialized-json') {
                let json = JSON.parse(part.value as string)
                body = { ...body, ...json }

            } else {
                body[part.fieldname] = part.value
            }
        }

        request.body = body
        return next.handle()
    }
}