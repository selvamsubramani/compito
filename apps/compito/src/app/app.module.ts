import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { DelayInterceptor, IconModule, ModalModule, TokenValidatorInterceptor } from '@compito/web/ui';
import { API_TOKEN, ENV_TOKEN } from '@compito/web/ui/tokens';
import { UsersState } from '@compito/web/users/state/users.state';
import { DialogModule } from '@ngneat/dialog';
import { popperVariation, TippyModule, tooltipVariation } from '@ngneat/helipopper';
import { HotToastModule } from '@ngneat/hot-toast';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsModule } from '@ngxs/store';
import { enableMapSet } from 'immer';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Import MSAL and MSAL browser libraries. 
import { MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';

// Import the Azure AD B2C configuration 
import { msalConfig, protectedResources } from './auth-config';

enableMapSet();
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    // Initiate the MSAL library with the MSAL configuration object
    MsalModule.forRoot(new PublicClientApplication(msalConfig),
      {
        // The routing guard configuration. 
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: protectedResources.todoListApi.scopes
        }
      },
      {
        // MSAL interceptor configuration.
        // The protected resource mapping maps your web API with the corresponding app scopes. If your code needs to call another web API, add the URI mapping here.
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map([
          [protectedResources.todoListApi.endpoint, protectedResources.todoListApi.scopes]
        ])
      }),
    // AuthModule.forRoot({
    //   domain: environment.auth.domain,
    //   audience: environment.auth.audience,
    //   clientId: environment.auth.clientId,
    //   redirectUri: `${window.location.origin}/app`,
    //   errorPath: '/auth/login',
    //   cacheLocation: 'localstorage',
    //   useRefreshTokens: false,
    //   httpInterceptor: {
    //     allowedList: [
    //       {
    //         uriMatcher: (uri: string) => {
    //           if (uri.includes(environment.api)) {
    //             if (uri.includes('/ping') || uri.includes('/pre-auth')) {
    //               return false;
    //             }
    //             return true;
    //           }
    //           return false;
    //         },
    //       },
    //     ],
    //   },
    // }),
    DialogModule.forRoot(),
    HotToastModule.forRoot(),
    TippyModule.forRoot({
      defaultVariation: 'tooltip',
      variations: {
        tooltip: tooltipVariation,
        popper: popperVariation,
        menu: {
          ...popperVariation,
          role: 'dropdown',
          arrow: false,
          hideOnClick: true,
          zIndex: 99,
        },
      },
    }),
    IconModule,
    NgxsModule.forRoot([UsersState], {
      developmentMode: !environment.production,
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    ModalModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenValidatorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DelayInterceptor,
      multi: true,
    },
    {
      provide: API_TOKEN,
      useValue: environment.api,
    },
    {
      provide: ENV_TOKEN,
      useValue: environment,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    MsalGuard
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
