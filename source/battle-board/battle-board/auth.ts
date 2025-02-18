import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

declare module "next-auth" {
  interface User {
    display_name?: string; // Add display_name to User type
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      display_name?: string | null; // Add display_name to Session type

      // Adding locale to the session
      locale?: string | null;
    };
  }

  interface JWT {
    display_name?: string; // Add display_name to JWT type
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Discord({
      profile(profile) {
        //console.log("Profile from Discord:", profile);
        return {
          id: profile.id,
          name: profile.username, // Map Discord username to the `name` field
          display_name: profile.global_name ?? profile.username,
          email: profile.email,
          image: profile.avatar
            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
            : null,

          // Adding locale to the user object
          locale: profile.locale,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("User Signed In:", profile);

      let db_conn_str = process.env.DB_CONN_STR;
      console.log("DB Connection String:", db_conn_str + "/users");

      if (profile) {
        let userDto = {
          discord_id: profile.id,
          user_name: profile.username,
          display_name: profile.global_name,

          // Adding locale to the user object
          locale: profile.locale,
        };

        console.log("User DTO:", userDto);

        try {
          // Check if the user already exists in the database
          const existingUserResponse = await fetch(
            `${db_conn_str}/users/${profile.id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          if (existingUserResponse.ok) {
            const existingUser = await existingUserResponse.json();
            console.log("Existing user found:", existingUser);
            // Use the existing user data as needed
          } else if (existingUserResponse.status === 404) {
            console.log("User does not exist, creating new user...");

            // Send the new user data to the database
            const createUserResponse = await fetch(`${db_conn_str}/users`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userDto),
            });
            if (!createUserResponse.ok) {
              console.error(
                "Failed to create new user:",
                createUserResponse.statusText,
              );
              return false; // Stop the sign-in process on error
            } else {
              console.log("New user successfully created.");
            }
          } else {
            console.error(
              "Unexpected response from the database:",
              existingUserResponse.statusText,
            );
            return false; // Stop the sign-in process on error
          }
        } catch (error) {
          console.error("Error interacting with the database:", error);
          return false; // Stop the sign-in process on error
        }
      }

      return true; // Return `true` to continue the sign-in process
    },
    jwt({ token, user, profile }) {
      if (user) {
        token.id = profile?.id as string;
        token.name = user.name;
        token.picture = user.image;
        token.email = user.email;
        token.display_name = profile?.global_name ?? user.name; // Include display_name

        // Adding locale to the JWT
        token.locale = profile?.locale;
      }
      return token;
    },
    session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string, // Include the user ID in the session
        name: token.name, // Map the name from the token to the session
        display_name: token.display_name as string | undefined, // Include display_name in the session
        image: token.picture,
        email: token.email ?? "",

        // Adding locale to the session
        locale: token.locale as string | undefined,
      };
      return session;
    },
  },
});
