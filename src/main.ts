import { BadRequestException, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import fastifyCookie from '@fastify/cookie'
import fastifySecureSession from '@fastify/secure-session'
import fastifyMultipart from '@fastify/multipart'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { FormDataInterceptor } from './_common/interceptors/form.interceptor'
import { MESSAGE_400 } from './constants'
import { join } from 'path'

function formikErrors() {
    return (validationErrors = []) => {

        let errorObj = {}
        validationErrors.map(error => {
            errorObj = { ...errorObj, [error.property]: Object.values(error.constraints).join(', ') }
        })
        return new BadRequestException({ ...MESSAGE_400, errors: errorObj })
    }
}

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({ trustProxy: true })
    )

    // CORS
    app.enableCors({
        origin: true,
        credentials: true
    })

    // Cookie
    await app.register(fastifyCookie, {
        secret: process.env.COOKIES_SECRET
    })

    // Session
    await app.register(fastifySecureSession, {
        secret: process.env.SESSION_SECRET,
        salt: process.env.SESSION_SALT,
        cookie: { path: '/', httpOnly: true }
    })

    // multipart/form-data
    await app.register(fastifyMultipart, {
        limits: { fileSize: 5000000 }
    })
    app.useGlobalInterceptors(new FormDataInterceptor())

    // Validation
    app.useGlobalPipes(new ValidationPipe({ exceptionFactory: formikErrors() }))

    // Serve images
    app.useStaticAssets({ root: join(__dirname, '..', 'public') })

    // Swagger
    const config = new DocumentBuilder()
        .setTitle('Servicio API')
        .setDescription('API description')
        .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, document)

    await app.listen(process.env.PORT)
}
bootstrap()
