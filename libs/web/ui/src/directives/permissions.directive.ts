import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Directive,
  Input,
  NgModule,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { UserDetails } from '@compito/api-interfaces';
import { Observable, Subscription } from 'rxjs';
import { getUserDetails } from '../util';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[permission]',
})
export class PermissionsDirective implements OnInit, OnDestroy {
  private loggedInUser!: UserDetails;
  private requiredPermission!: string;

  subscription!: Subscription;

  @Input()
  set permission(permission: string) {
    this.requiredPermission = permission;
    this.updateView();
  }
  user$: Observable<UserDetails|null> = new Observable<UserDetails|null>();
  constructor(
    private tpl: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private authService: MsalService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.user$ = getUserDetails(this.authService.instance.getActiveAccount()?.idTokenClaims);
    this.subscription = this.user$.subscribe((u) => {
    if (u) {
          this.vcr.clear();
          this.loggedInUser = u;
          this.updateView();
        }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private updateView() {
    if (this.hasPermission()) {
      this.vcr.createEmbeddedView(this.tpl);
    } else {
      this.vcr.clear();
    }
    this.cdr.markForCheck();
  }

  private hasPermission() {
    if (!this.loggedInUser) return false;
    const userPermissions = this.loggedInUser.role.permissions;
    if (userPermissions) {
      return userPermissions.includes(this.requiredPermission);
    }
    return false;
  }
}

@NgModule({
  declarations: [PermissionsDirective],
  imports: [CommonModule],
  exports: [PermissionsDirective],
})
export class PermissionsDirectiveModule {}
