import { RequestParams, RequestWithUser, UserRequest, UserSignupRequest } from '@compito/api-interfaces';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  Res
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PERMISSIONS } from '../core/config/permissions.config';
import { Permissions } from '../core/decorators/permissions.decorator';
import { Public } from '../core/decorators/public.decorator';
import { Role } from '../core/decorators/roles.decorator';
import { PermissionsGuard } from '../core/guards/permissions.guard';
import { RolesGuard } from '../core/guards/roles.guard';
import { JoiValidationPipe } from '../core/pipes/validation/validation.pipe';
import { UserService } from './user.service';
import { roleUpdateValidationSchema, userSignupValidationSchema, userUpdateValidationSchema } from './user.validation';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.user.read)
  @Get('')
  findAll(@Query() query: RequestParams & { projectId?: string }, @Req() req: RequestWithUser) {
    console.log("get users");
    return this.userService.findAll(query, req.user);
  }

  // For UI to get onboarding details post login flow
  @Public()
  @Get('pre-auth/onboard')
  getOnboardingDetails(@Req() req: Request) {
    const sessionToken = req.headers['x-session-token'] as string;
    if (!sessionToken) {
      throw new ForbiddenException('Not enough permissions');
    }
    return this.userService.getOnboardingDetails(sessionToken);
  }

  // For Auth0 to access during login flow
  @Public()
  @Get('auth')
  getUserDetails(@Req() req: Request) {
    const sessionToken = req.headers['x-session-token'] as string;
    if (!sessionToken) {
      throw new ForbiddenException('Not enough permissions');
    }
    return this.userService.getUserDetails(sessionToken);
  }

 // For Auth0 to access during login flow
 @Public()
 @Post('msauth')
 async getUserDetail(@Req() req: Request, @Res() res: Response) {
    const body = req.body;
    const extension = `extension_249ecd7b64e64272a6a6b736f908feae`
    const payload = {
      email: body.email,
      userId: body[`${extension}_userid`],
      org: body[`${extension}_orgs`]
    }
    var data = await this.userService.fetchUserDetails(payload);
    const { partOfMultipleOrgs, pendingInvites, org, role, projects } = data;
    res.send({
      version: "1.0.0",
      action: "Continue",
      [`${extension}_orgs`]: JSON.stringify(org),
      [`${extension}_roles`]: JSON.stringify(role),
      [`${extension}_projects`]: JSON.stringify(projects),
      [`${extension}_email`]: body.email
    },);
 }

  @Get('invites')
  getInvitesForUser(@Req() req: RequestWithUser) {
    return this.userService.getUsersInvites(req.user);
  }

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.user.read)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    console.log(id);
    return this.userService.find(id, req.user);
  }

  @Public()
  @Post('signup')
  @UsePipes(new JoiValidationPipe(userSignupValidationSchema))
  signup(@Body() user: UserSignupRequest) {
    return this.userService.signup(user);
  }

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.user.update)
  @Patch(':id/role')
  @UsePipes(new JoiValidationPipe(roleUpdateValidationSchema))
  updateRole(@Param('id') id: string, @Body() { roleId }: UserRequest, @Req() req: RequestWithUser) {
    return this.userService.updateUserRole(id, roleId, req.user);
  }
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.user.update)
  @Patch(':id')
  @UsePipes(new JoiValidationPipe(userUpdateValidationSchema))
  update(@Param('id') id: string, @Body() user: UserRequest, @Req() req: RequestWithUser) {
    return this.userService.updateUser(id, user, req.user);
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.user.delete)
  @Role('org-admin')
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.userService.deleteUser(id, req.user);
  }
}
