import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { AuthService } from '@auth0/auth0-angular';
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

  ngOnInit(): void {
    // this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
    //   if (isAuthenticated) {
    //     this.router.navigate(['/app']);
    //   }
    // });
    console.log("Landing Component");
    this.broadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => {
          console.log(msg);
          return msg.eventType === EventType.LOGIN_SUCCESS;
        } ),
      )
      .subscribe((result: EventMessage) => {
        debugger;
        console.log(result);
        this.router.navigate(['/app']);
      });
  }
}
