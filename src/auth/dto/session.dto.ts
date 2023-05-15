import { IntersectionType, PartialType, PickType } from "@nestjs/swagger"
import { Session } from "../entities/session.entity"
import { Role } from "@prisma/client"

export class SessionDto extends IntersectionType(
    PickType(Session, ['fingerprint', 'userId'] as const),
    PartialType(PickType(Session, ['hostname', 'updatedAt'] as const))
) { role: Role }