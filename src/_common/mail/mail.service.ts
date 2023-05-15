import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/_common/prisma/prisma.service'
import { createTransport } from "nodemailer"
import { EmailData, EmailDataToken } from './entities/mail.entity'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { Mail, htmlMail, textMail } from './mail-body'
import { randomInt } from 'crypto'
import { AUTH, Exeption, mailTokenOptions } from 'src/constants'

@Injectable()
export class MailService {
    constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService) { }

    private async sendMail(mail: Mail) {
        return createTransport({
            host: process.env.MAIL_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        }).sendMail(mail)
    }

    private async sendCode(email: string): Promise<EmailDataToken> {
        const token = await this.jwtService.signAsync({}, mailTokenOptions)
        const code = randomInt(100000, 1000000)

        await this.prismaService.emailData.create({ data: { code, token } })

        let html = htmlMail(code, process.env.BASE_API_URL + 'verify-code?t=' + token)
        let text = textMail(code)
        let message = {
            from: process.env.MAIL_FROM,
            to: email,
            subject: AUTH.MAIL_TITLE,
            text,
            html
        }

        try {
            const info = await this.sendMail(message)
            if (info.accepted[0] === email)
                return { token }

            throw new InternalServerErrorException(Exeption.EMAIL_REJECTED)
        } catch (e) {
            throw new InternalServerErrorException(e.response)
        }
    }

    async verifyEmail(createUserDto: CreateUserDto) {
        const userWithEmail = await this.prismaService.user.findUnique({
            where: { email: createUserDto.email }
        })
        if (userWithEmail) throw new BadRequestException(AUTH.SIGNUP_ERROR_IN.EMAIL)

        return this.sendCode(createUserDto.email)
    }

    async resetPassword(email: string) {
        const userWithEmail = await this.prismaService.user.findUnique({
            where: { email }
        })
        if (!userWithEmail)
            throw new BadRequestException(AUTH.EMAIL_DOES_NOT_EXIST)

        return this.sendCode(email)
    }

    async verifyCode(emailData: EmailData) {
        try {
            const { token } = await this.prismaService.emailData.delete({ where: { code_token: emailData } })
            return await this.jwtService.verifyAsync(token, mailTokenOptions)
        } catch (error) {
            await this.prismaService.emailData.deleteMany({ where: { token: emailData.token } })
            throw new BadRequestException('code' in error ? AUTH.SIGNUP_ERROR_IN.CODE : AUTH.SIGNUP_ERROR_IN.TOKEN)
        }
    }
}

