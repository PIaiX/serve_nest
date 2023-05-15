import { IsNumber } from "class-validator"
import { PickType } from "@nestjs/swagger"
import Prisma from "@prisma/client"
import { ValidationError } from "src/constants"

export class EmailData implements Prisma.EmailData {

    /** Email verification token */
    token: string

    /** 
     * Email verification code 
     * @example number
     */
    @IsNumber({}, { message: ValidationError.CODE_IS_NUMBER })
    code: number
}

export class EmailDataCode extends PickType(EmailData, ['code'] as const) { }
export class EmailDataToken extends PickType(EmailData, ['token'] as const) { }