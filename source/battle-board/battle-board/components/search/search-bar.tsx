import Link from "next/link";

import Image from "next/image";

export default function SearchBar() {
  return (
    <div className="search-bar flex items-center rounded-full border-solid border-white border-[6px] h-[100px] w-[50vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50">
      <Link href="/search" className="mr-2">
        <Image
          src="/search.svg"
          alt="search"
          className="h-16 w-16"
          height={100}
          width={100}
        />
      </Link>
      <input className=" text-3xl text-left w-full bg-background text-white"></input>
    </div>
  );
}
