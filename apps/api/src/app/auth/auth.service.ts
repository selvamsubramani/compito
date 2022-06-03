import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppMetadata, AuthenticationClient, ManagementClient, ManagementClientOptions, UserMetadata } from 'auth0';
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials"
import { ClientSecretCredential } from "@azure/identity"
import "isomorphic-fetch";

@Injectable()
export class AuthService {
  management: ManagementClient<AppMetadata, UserMetadata>;
  auth: AuthenticationClient;
  msauth: Client;
  constructor(private config: ConfigService) {
    let managementOptions: ManagementClientOptions = {
      domain: this.config.get('AUTH0_DOMAIN'),
      clientId: this.config.get('AUTH0_CLIENT_ID'),
    };
    if (this.config.get('NODE_ENV') === 'production') {
      managementOptions = {
        ...managementOptions,
        clientSecret: this.config.get('AUTH0_CLIENT_SECRET'),
      };
    } else {
      managementOptions = {
        ...managementOptions,
        token: this.config.get('AUTH0_MANAGEMENT_TOKEN'),
      };
    }
    this.management = new ManagementClient(managementOptions);
    this.auth = new AuthenticationClient({
      domain: this.config.get('AUTH0_DOMAIN'),
      clientId: this.config.get('AUTH0_CLIENT_ID'),
      clientSecret: this.config.get('AUTH0_CLIENT_SECRET'),
    });

    //region Sign up in Azure B2C using Microsoft Graph API
    let scopes: string[] = ["https://graph.microsoft.com/.default"];
    const credential = new ClientSecretCredential(this.config.get('AZB2C_TENANT_NAME'),
      this.config.get('AZB2C_USER_SIGNUP_CLIENT_ID'),
      this.config.get('AZB2C_USER_SIGNUP_SECRET'));
      
    const provider = new TokenCredentialAuthenticationProvider(credential, { scopes });
    this.msauth = Client.initWithMiddleware ({
      debugLogging: true,
      authProvider: provider});
    //endregion
  }
}
