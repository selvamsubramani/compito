import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular'
import { InteractionStatus, EventMessage, EventType } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'compito-landing',
  templateUrl: './landing.component.html',
})
export class LandingComponent implements OnInit {
  private readonly _destroying$ = new Subject<void>();
  constructor(private broadcastService: MsalBroadcastService,
    private auth: MsalService,
    private router: Router) {}

  ngOnInit(): void {
    this.broadcastService.inProgress$
    .pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this._destroying$)
    )
    .subscribe((res) => {
      console.log(`Landing Component - ${res}`);
    });

    this.broadcastService.msalSubject$
      .pipe(filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS))
      .subscribe(() =>
      {
        if(this.auth.instance.getAllAccounts().length > 0) {
          this.auth.instance.setActiveAccount(this.auth.instance.getAllAccounts()[0]); 
        }
        console.log("Active Account", this.auth.instance.getActiveAccount());
        this.router.navigate(['/app']); 
      });
   }

   ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}