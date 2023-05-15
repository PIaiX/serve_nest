import { IntersectionType, PickType } from "@nestjs/swagger"
import { User } from "../entities/user.entity"
import { IsStrongPassword } from "class-validator"
import { ValidationError } from "src/constants"

export class Password {

    /** Strong password. Only password hash is stored */
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }, { message: ValidationError.PASSWORD })
    password: string
}

export class CreateUserDto extends IntersectionType(
    PickType(User, ['email', 'firstName', 'lastName', 'phone', 'userType'] as const),
    Password
) { }
