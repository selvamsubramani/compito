import { LogLevel, Configuration, BrowserCacheLocation } from '@azure/msal-browser';
import { environment } from '../environments/environment';

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

export const msalConfig: Configuration = {
     auth: {
         clientId: environment.auth.clientId,
         authority: 'https://' + environment.auth.tenantName + '.b2clogin.com/' + environment.auth.tenantName + '.onmicrosoft.com/' + environment.auth.signinProfile,
         knownAuthorities: [environment.auth.tenantName + '.b2clogin.com'],
         redirectUri: '/',
     },
     cache: {
         cacheLocation: "sessionStorage",
         storeAuthStateInCookie: false, 
     }
    //  ,
    //  system: {
    //      loggerOptions: {
    //         loggerCallback: (logLevel, message, containsPii) => {
    //             console.log(message);
    //          },
    //          logLevel: LogLevel.Verbose,
    //          piiLoggingEnabled: false
    //      }
    //  }
 }

export const protectedResources = {
  todoListApi: {
    endpoint: "https://" + environment.auth.tenantName + ".onmicrosoft.com/api",
    scopes: ['read','write'],
    scopeurls: ["https://" + environment.auth.tenantName + ".onmicrosoft.com/api/read", "https://" + environment.auth.tenantName + ".onmicrosoft.com/api/write"],
  },
}
export const loginRequest = {
  scopes: []
};