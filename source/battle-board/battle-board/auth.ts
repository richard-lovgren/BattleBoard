import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Discord({
    profile(profile) {
      console.log("Profile: " + JSON.stringify(profile));
      return profile;
    }
  })],
  callbacks: {
    jwt({ token, user }) {
      console.log("User: " + JSON.stringify(user))
      console.log("Token: " + JSON.stringify(token))
      return token
    },
    session({ session, token }) {
      console.log("Session: " + JSON.stringify(session))
      return session
    }
  }
}
);
