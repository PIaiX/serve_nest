import { PickType } from "@nestjs/swagger"
import { User } from "src/users/entities/user.entity"

export class ResetPasswordDto extends PickType(User, ['email'] as const) { }