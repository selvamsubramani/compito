import { CommonModule } from '@angular/common';
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { UserDetails } from '@compito/api-interfaces';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { formatUser, getUserDetails } from '../../util';

@Pipe({
  name: 'permission',
})
export class PermissionPipe implements PipeTransform {
  user$: Observable<UserDetails|null> = new Observable<UserDetails|null>();// = this.auth.user$.pipe(formatUser());

  constructor(private auth: MsalService) {
  this.user$ = getUserDetails(this.auth.instance.getActiveAccount()?.idTokenClaims);
  }

  transform(requiredPermission: string): Observable<boolean> {
    return this.user$.pipe(
      map((user) => {
        return this.hasPermission(user, requiredPermission);
      }),
    );
  }

  private hasPermission(user: UserDetails | null, requiredPermission: string) {
    if (!user) return false;
    const userPermissions = user.role.permissions;
    if (userPermissions) {
      return userPermissions.includes(requiredPermission);
    }
    return false;
  }
}

@NgModule({
  declarations: [PermissionPipe],
  imports: [CommonModule],
  exports: [PermissionPipe],
})
export class PermissionsPipeModule {}
