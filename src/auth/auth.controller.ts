import { Controller, Post, Body, Patch, UseGuards, Req, Res, Get, ForbiddenException, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { CreateUserDto, Password } from 'src/users/dto/create-user.dto'
import { AuthGuard } from 'src/_common/guards/auth.guard'
import { LoginDto } from './dto/login.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { AUTH, refreshTokenOptions } from 'src/constants'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { User, UserWithToken } from 'src/users/entities/user.entity'
import { AccessToken } from './entities/session.entity'
import { FingerprintGuard } from 'src/_common/guards/fingerprint.guard'
import { EmailData, EmailDataCode, EmailDataToken } from 'src/_common/mail/entities/mail.entity'
import { MailService } from 'src/_common/mail/mail.service'

@Controller('auth')
@ApiTags('Authorisation')
@UseGuards(FingerprintGuard)
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly mailService: MailService) { }

    /** Sign Up */
    @Post('signup')
    @ApiCreatedResponse({ schema: { type: 'object', properties: { message: { type: 'string', example: 'Письмо успешно отправлено' } } } })
    async signupSendCode(@Body() createUserDto: CreateUserDto, @Req() request: FastifyRequest) {
        const { token } = await this.mailService.verifyEmail(createUserDto)
        request.session.set('user-data', { ...createUserDto, token })
        request.session.options({ path: '/auth', maxAge: 60 * 10 })
        return { message: AUTH.MAIL_SUCCESS }
    }

    /** Verify email */
    @Post('signup/verify')
    @ApiCreatedResponse({ type: UserWithToken })
    async signupVerify(@Body() { code }: EmailDataCode, @Req() request: FastifyRequest, @Res({ passthrough: true }) reply: FastifyReply) {
        if (!request.session) throw new UnauthorizedException(AUTH.SESSION_EXPIRED)
        const fingerprint = request.headers.fingerprint as string
        const hostname = request.hostname
        const { token, ...createUserDto } = request.session.get('user-data') as CreateUserDto & EmailDataToken
        await this.mailService.verifyCode({ code, token })
        const { user, accessToken, refreshToken } = await this.authService.signup(createUserDto, fingerprint, hostname)
        reply.setCookie('refreshToken', refreshToken, { path: '/auth/refresh', httpOnly: true, maxAge: refreshTokenOptions.expiresIn })
        request.session.delete()
        return { user, accessToken }
    }

    /** Log in */
    @Post('login')
    @ApiCreatedResponse({ type: UserWithToken })
    async login(@Body() loginDto: LoginDto, @Req() request: FastifyRequest, @Res({ passthrough: true }) reply: FastifyReply) {
        const fingerprint = request.headers.fingerprint as string
        const hostname = request.hostname
        const { user, accessToken, refreshToken } = await this.authService.login(loginDto, fingerprint, hostname)
        reply.setCookie('refreshToken', refreshToken, { path: '/auth/refresh', httpOnly: true, maxAge: refreshTokenOptions.expiresIn })
        return { user, accessToken }
    }

    /** Log out */
    @Patch('logout')
    @UseGuards(AuthGuard)
    @ApiOkResponse({ type: AccessToken })
    async logout(@Req() request: FastifyRequest, @Res({ passthrough: true }) reply: FastifyReply) {
        const fingerprint = request.headers.fingerprint as string
        reply.clearCookie('refreshToken')
        return this.authService.logout(fingerprint)
    }

    /** Get new access token */
    @Get('refresh')
    @ApiOkResponse({ type: AccessToken })
    async refreshToken(@Req() request: FastifyRequest) {
        const fingerprint = request.headers.fingerprint as string
        const refreshToken = request.cookies.refreshToken
        return this.authService.refresh(fingerprint, refreshToken)
    }

    /** Send code */
    @Post('reset-password/send-code')
    @ApiCreatedResponse({ schema: { type: 'object', properties: { message: { type: 'string', example: 'Письмо успешно отправлено' } } } })
    async resetPasswordSendCode(@Body() { email }: ResetPasswordDto, @Req() request: FastifyRequest) {
        const { token } = await this.mailService.resetPassword(email)
        request.session.set('reset-password', { email, token })
        request.session.options({ path: '/auth', maxAge: 60 * 10 })
        return { message: AUTH.MAIL_SUCCESS }
    }

    /** Verify email */
    @Post('reset-password/verify')
    @ApiCreatedResponse({ type: AccessToken })
    async resetPasswordVerify(@Body() { code }: EmailDataCode, @Req() request: FastifyRequest) {
        if (!request.session) throw new UnauthorizedException(AUTH.SESSION_EXPIRED)
        const { token } = request.session.get('reset-password') as EmailDataToken
        await this.mailService.verifyCode({ code, token })
        return { message: AUTH.CODE_SUCCESS }
    }

    /** Reset password */
    @Post('reset-password')
    @ApiOkResponse({ type: User })
    async resetPassword(@Req() request: FastifyRequest, @Body() { password }: Password) {
        if (!request.session) throw new UnauthorizedException(AUTH.SESSION_EXPIRED)
        const { email } = request.session.get('reset-password') as Pick<User, 'email'>
        await this.authService.resetPassword(email, password)
        request.session.delete()
        return { message: AUTH.PASSWORD_CHANGED }
    }
}
