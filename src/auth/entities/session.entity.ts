import { IntersectionType, PickType } from "@nestjs/swagger"
import Prisma from "@prisma/client"

export class Session implements Prisma.Session {

    /** User browser fingerprint */
    fingerprint: string

    /** OAuth 2.0 refresh token */
    refreshToken: string

    /** User ID */
    userId: number

    /** Request headers `user-agent` */
    hostname: string | null

    /** Datetime session has been created */
    createdAt: Date

    /** Datetime session has been updated */
    updatedAt: Date | null
}

export class AccessToken {

    /** OAuth 2.0 access token  */
    accessToken: string
}

export class RefreshToken extends PickType(Session, ['refreshToken'] as const) { }

export class Tokens extends IntersectionType(
    AccessToken,
    RefreshToken,
) { }