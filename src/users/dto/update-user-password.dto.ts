import { Password } from './create-user.dto'
import { IsStrongPassword } from 'class-validator'
import { ValidationError } from 'src/constants'

export class UpdateUserPasswordDto extends Password {

    /** Current password */
    @IsStrongPassword({
        minLength: 1,
    }, { message: 'Введите текущий пароль' })
    currentPassword: string
}
