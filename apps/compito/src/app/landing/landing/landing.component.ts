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
  constructor() {}

  ngOnInit(): void { }
}