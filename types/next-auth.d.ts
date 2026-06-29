import { type DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'Buyer' | 'Vendor' | 'Admin';
    } & DefaultSession['user'];
  }

  interface User {
    role: 'Buyer' | 'Vendor' | 'Admin';
  }
}
