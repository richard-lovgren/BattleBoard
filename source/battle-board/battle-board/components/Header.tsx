import Link from "next/link";
import LoginBtn from "./login-btn";

export default function Header() {
  //This is the login button #TODO Remove Link wrapper and place the discord function thingy in the onClick()={} call -->
  return (
    <header className="h-28 flex flex-row items-center justify-between px-10 font-nunito ">
      <Link href="/">
        <img src="/logo.svg" alt="logo" className=" justify-self-start" />
      </Link>
      <div className="flex flex-row gap-4 items-center">
        <Link href="/search">
          <img src="/search.svg" alt="search" className="h-8 w-8" />
        </Link>

        <LoginBtn />

        <button className="bg-foreground text-white py-2 px-4 rounded-xl dark:text-background">
          Sign Up
        </button>
      </div>
    </header>
  );
}
