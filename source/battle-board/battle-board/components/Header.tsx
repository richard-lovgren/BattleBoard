import Link from "next/link";
import LoginBtn from "./login-btn";
import Image from "next/image";

export default function Header() {
  //This is the login button #TODO Remove Link wrapper and place the discord function thingy in the onClick()={} call -->
  return (
    <header className="h-28 flex flex-row items-center justify-between px-10 font-nunito ">
      <Link href="/">
        <Image src="/logo.svg" alt="logo" className="justify-self-start" width={150}
      height={200}/>
      </Link>
      <div className="flex flex-row gap-4 items-center">
        <Link href="/search">
          <Image src="/search.svg" alt="search" className="h-8 w-8" width={50}
      height={50}/>
        </Link>

        <LoginBtn />

        <button className="bg-foreground text-white py-2 px-4 rounded-xl dark:text-background">
          Sign Up
        </button>
      </div>
    </header>
  );
}
