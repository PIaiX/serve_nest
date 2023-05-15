import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { LoginDto } from './dto/login.dto'
import { AccessToken, Tokens } from './entities/session.entity'
import { AUTH, Exeption, accessTokenOptions, refreshTokenOptions } from 'src/constants'
import { CryptoService } from 'src/_common/crypto/crypto.service'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/_common/prisma/prisma.service'
import { SessionDto } from './dto/session.dto'

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly cryptoService: CryptoService,
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService
    ) { }

    async signup(createUserDto: CreateUserDto, fingerprint: string, hostname: string) {
        const user = await this.usersService.create(createUserDto)
        const { accessToken, refreshToken } = await this.createSession({ userId: user.id, role: user.role, hostname, fingerprint })
        return { user, accessToken, refreshToken }
    }

    async login(loginDto: LoginDto, fingerprint: string, hostname: string) {
        const userWithPassword = await this.usersService.findOneByEmail(loginDto.email)
        if (!userWithPassword)
            throw new BadRequestException(AUTH.LOGIN_ERROR_IN.EMAIL)

        const { password, ...user } = userWithPassword

        const isPasswordValid = await this.cryptoService.compare(loginDto.password, password.hash)
        if (!isPasswordValid)
            throw new BadRequestException(AUTH.LOGIN_ERROR_IN.PASSWORD)

        const { accessToken, refreshToken } = await this.createSession({ userId: user.id, role: user.role, hostname, fingerprint })
        return { user, accessToken, refreshToken }
    }

    async logout(fingerprint: string) {
        const currentSession = await this.prismaService.session.delete({ where: { fingerprint } })
        if (!currentSession) throw new InternalServerErrorException(Exeption.UNKOWN_INTERNAL_ERROR)
        return AUTH.LOGOUT_SUCCESS
    }

    async refresh(fingerprint: string, refreshToken: string): Promise<AccessToken> {
        if (!refreshToken) throw new UnauthorizedException(Exeption.NO_REFRESH_TOKEN)
        const session = await this.prismaService.session.findUnique({ where: { fingerprint } })
        if (!session || session.refreshToken !== refreshToken) throw new UnauthorizedException(Exeption.BAD_REFRESH_TOKEN)

        try {
            const { userId, role } = await this.jwtService.verifyAsync(refreshToken, refreshTokenOptions)
            const accessToken = await this.jwtService.signAsync({ userId, role }, accessTokenOptions)
            return { accessToken }
        } catch {
            throw new UnauthorizedException(Exeption.REFRESH_TOKEN_EXPIRED)
        }
    }

    private async createSession({ fingerprint, userId, role, hostname }: SessionDto): Promise<Tokens> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({ userId, role }, accessTokenOptions),
            this.jwtService.signAsync({ userId, role }, refreshTokenOptions)
        ])
        await this.prismaService.session.upsert({
            where: { fingerprint },
            update: { userId, refreshToken, hostname, updatedAt: (new Date).toISOString() },
            create: { userId, refreshToken, hostname, fingerprint }
        })
        return { accessToken, refreshToken }
    }

    async resetPassword(email: string, password: string) {
        const passwordHash = await this.cryptoService.hash(password)
        return this.prismaService.user.update({
            where: { email },
            data: {
                password: { update: { hash: passwordHash } }
            }
        })
    }
}
