import { Password } from './create-user.dto'
import { IsStrongPassword } from 'class-validator'
import { ValidationError } from 'src/constants'

export class UpdateUserPasswordDto extends Password {

    /** Current password */
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }, { message: ValidationError.PASSWORD })
    currentPassword: string
}
