

import { SetMetadata } from "@nestjs/common";
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRole } from "src/enum/user-role.enum";


export const Roles = (...roles: UserRole[]) => SetMetadata("roles", roles);
export const Public = (value: boolean = true) => SetMetadata("isPublic", value);

export const AbilityAndABilityContext = (...value: { ability: string, abilityContext: string }[]) => SetMetadata("abilityAndAbilityContext", value);








export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);


export const GetPageUrl = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const url = request.url;
    return url;
  },
);