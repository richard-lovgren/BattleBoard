import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Discord({
      profile(profile) {
        console.log("Profile from Discord:", profile);
        return {
          id: profile.id,
          name: profile.username, // Map Discord username to the `name` field
          email: profile.email,
          image: profile.avatar
            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
            : null,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.name = user.name; // Ensure the username is set in the JWT
        token.picture = user.image;
        token.email = user.email;
      }
      console.log("JWT Token:", token);
      return token;
    },
    session({ session, token }) {
      session.user = {
        ...session.user,
        name: token.name, // Map the name from the token to the session
        image: token.picture,
        email: token.email ?? '',
      };
      console.log("Session Object:", session);
      return session;
    },
  },
});

