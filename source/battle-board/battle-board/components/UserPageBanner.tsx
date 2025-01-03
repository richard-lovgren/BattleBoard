"use client";

import useCountryLocaleFlag from "@/hooks/useCountryLocaleFlag";
import { useSession } from "next-auth/react";
import Image from "next/image";
import LolUsernameBox from "./add-lol-box";

interface UserProps {
  id: string;
  discord_id: number;
  user_name: string;
  display_name: string;
  league_puuid: string;
}

const UserPageBanner: React.FC<UserProps> = ({
  id,
  discord_id,
  user_name,
  display_name,
  league_puuid,
}) => {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <main className="  text-white flex flex-col items-center px-2 py-2 font-nunito ">
        <div className="bg-slate-500 flex flex-row w-full px-10 py-10 gap-4 bg-transparent  ">
          <div className="relative inline-block">
            <Image
              src={`${session.user.image}`}
              alt="example"
              className="h-auto rounded-[70px]"
              height={200}
              width={200}
            ></Image>
            <div className="absolute inset-0 bg-black bg-opacity-20 rounded-[70px] shadow-inner shadow-black"></div>
          </div>
          <div className="flex flex-col gap py-5">
            <div className="flex flex-row gap-2 items-center">
              <h1 className="text-4xl font-bold font-odibee my-2">
                {user_name}
              </h1>
              {/* <h3 className="">{data}</h3> */}
            </div>
            <h2 className="font-bold">{display_name}</h2>
            <LolUsernameBox></LolUsernameBox>
          </div>
        </div>
      </main>
    );
  } else {
    return (
      <div>
        <p className="text-center text-9xl font-odibee">Not logged in</p>
      </div>
    );
  }
};

//Export the component
export default UserPageBanner;
