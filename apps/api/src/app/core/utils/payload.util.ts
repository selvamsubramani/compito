import { Role, UserPayload } from '@compito/api-interfaces';
import { InternalServerErrorException } from '@nestjs/common';

// export const getUserDetails = (
//   user: UserPayload | null,
// ): { role: Role; org: { id: string; name: string }; projects: string[]; userId: string; email } => {
//   if (user) {
//     const {
//       'https://compito.adi.so/role': role,
//       'https://compito.adi.so/projects': projects,
//       'https://compito.adi.so/org': org,
//       'https://compito.adi.so/email': email,
//       'https://compito.adi.so/userId': userId,
//     } = user;
//     return { role: role as Role, org, email, projects, userId };
//   }
//   throw new InternalServerErrorException('User data not found');
// };

export const getUserDetails = (
  user: UserPayload | null,
): { role: Role; org: { id: string; name: string }; projects: string[]; userId: string; email} => {
  if (user) {
    const {
      'extension_roles': role,
      'extension_projects': projects,
      'extension_orgs': org,
      'extension_email': email,
      'extension_userid': userId,
    } = user;
    // console.log(role);
    // console.log(org);
    // console.log(email);
    return { role: role as Role, org, projects, userId, email };
  }
  throw new InternalServerErrorException('User data not found');
};
