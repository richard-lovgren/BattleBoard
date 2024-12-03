import Link from "next/link";

export default function Header() {
  //This is the login button #TODO Remove Link wrapper and place the discord function thingy in the onClick()={} call -->
  return (
    <header className="h-28 flex flex-row items-center justify-between px-10">
      <Link href="/">
        <img src="/logo.svg" alt="logo" className=" justify-self-start" />
      </Link>
      <div className="flex flex-row gap-4">
        <Link href="/user/testid#id">
          <button className="text-white py-2 px-4 rounded-xl border-[#4E35BE] border-2">
            Log in
          </button>
        </Link>
        <button className="bg-[#4E35BE] text-white py-2 px-4 rounded-xl">
          Sign up
        </button>
      </div>
    </header>
  );
}
