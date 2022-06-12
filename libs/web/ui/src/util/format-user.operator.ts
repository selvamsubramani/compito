import { UserDetails } from '@compito/api-interfaces';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export function formatUser() {
  return function (source: Observable<any>): Observable<UserDetails | null> {
    return source.pipe(
      map((data: any) => {
        if (data == null) {
          return null;
        } else {
          const { family_name, given_name, nickname, name, picture, updated_at, email, email_verified, sub } = data;
          return {
            role: data['extension_roles'],
            userId: data['extension_userid'],
            org: data['extension_orgs'],
            family_name,
            given_name,
            nickname,
            name,
            picture,
            updated_at,
            email,
            email_verified,
            sub,
          } as UserDetails;
        }
      }),
    );
  };
}

export function getUserDetails(data: any) {
    if (data == null) {
      return of(null);
    } else {
      const { family_name, given_name, name, picture, updated_at, email_verified, sub } = data;
          return of({
            role: data['extension_roles'],
            userId: data['extension_userid'],
            org: data['extension_orgs'],
            family_name,
            given_name,
            nickname: `${given_name}.${family_name}`,
            name,
            picture,
            updated_at,
            email: data['extension_email'],
            email_verified,
            sub
          } as UserDetails);
    }
}
