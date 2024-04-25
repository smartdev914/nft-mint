import { Role } from "@enums/role";
import { SetMetadata, UseGuards, applyDecorators } from "@nestjs/common";
import { ROLES_KEY } from "./roles.decorator";
import { RolesGuard } from "@guards/roles.guard";
import { AccessTokenGuard } from "@guards/access-token.guard";

export function Auth(...roles: Role[]) {
    return applyDecorators(
        SetMetadata(ROLES_KEY, roles),
        UseGuards(AccessTokenGuard, RolesGuard)
    )
}