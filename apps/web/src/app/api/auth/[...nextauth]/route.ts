import NextAuth, { type NextAuthOptions } from 'next-auth';
import Email from 'next-auth/providers/email';

const emailProvider = Email({
  server: { host: 'localhost', port: 1025 }, // we'll use Mailpit later
  from: 'no-reply@tovis.local'
});

export const authOptions: NextAuthOptions = {
  providers: [emailProvider],
  callbacks: {
    session({ session, token }) {
      session.user.id = token.sub!;
      session.user.role = token.role;
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    }
  }
};
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
