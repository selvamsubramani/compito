import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular'
import { InteractionStatus, EventMessage, EventType } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'compito-landing',
  templateUrl: './landing.component.html',
})
export class LandingComponent implements OnInit {
  constructor(private auth: MsalService, private broadcastService: MsalBroadcastService, private router: Router) {}

  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();
  
  ngOnInit(): void {
    this.broadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
      )
      .subscribe((result: EventMessage) => {
        console.log(result);
      });

    this.broadcastService.inProgress$
    .pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this._destroying$)
    )
    .subscribe(() => {
      this.setLoginDisplay();
    });
    // this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
    //   if (isAuthenticated) {
    //     this.router.navigate(['/app']);
    //   }
    // });
  }

  setLoginDisplay() {
    this.loginDisplay = this.auth.instance.getAllAccounts().length > 0;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
