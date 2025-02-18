import Link from "next/link";
import LoginBtn from "./login-btn";
import Image from "next/image";

export default function Header() {
  return (
    <header className="h-28 flex flex-row items-center justify-between px-10 font-nunito ">
      <Link href="/">
        <Image
          src="/logo.svg"
          alt="logo"
          className="justify-self-start"
          width={150}
          height={200}
          priority={true}
          style={{
            width: 'auto',
            cursor: 'pointer',
          }}
        />
      </Link>
      <div className="flex flex-row gap-4 items-center">
        <Link href="/search">
          <Image
            src="/search.svg"
            alt="search"
            className="h-8 w-8"
            width={50}
            height={50}
          />
        </Link>

        <LoginBtn />
      </div>
    </header>
  );
}
