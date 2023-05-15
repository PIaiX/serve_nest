import { User } from '../entities/user.entity'
import { PartialType, PickType } from '@nestjs/swagger'

export class UpdateUserDto extends PartialType(User) { }

// export class UpdateUserDto extends PickType(
//     PartialType(User), [
//         'firstName',
//         'lastName',
//         'phone',
//         'city',
//         'dateOfBirth',
//         'avatar'
//     ] as const
// ) { }