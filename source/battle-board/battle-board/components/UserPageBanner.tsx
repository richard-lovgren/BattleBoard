"use client";

import CountryFlag from "@/components/CountryFlag";
import { useSession } from "next-auth/react";
import Image from "next/image";
import LolUsernameBox from "./lol/lolUserBox";

interface UserProps {
  id: string;
  discord_id: number;
  user_name: string;
  display_name: string;
  league_puuid: string;
  langcode: string;
}

const UserPageBanner: React.FC<UserProps> = ({
  id,
  discord_id,
  user_name,
  display_name,
  league_puuid,
  langcode,
}) => {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <main className="  text-white flex flex-col items-center py-2 font-nunito ">
        <div className="bg-slate-500 flex flex-row w-full py-10 gap-4 bg-transparent  ">
          <div className="relative inline-block" style={{ borderRadius:'100%', overflow:'hidden'}}>
            <Image
              src={`${session.user.image}`}
              alt="example"
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
              <CountryFlag langcode={langcode}></CountryFlag>
            </div>
            <h2 className="font-bold">{display_name}</h2>
            <h2 className="font-bold">Link league of legends API:</h2>
            <LolUsernameBox/>
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
