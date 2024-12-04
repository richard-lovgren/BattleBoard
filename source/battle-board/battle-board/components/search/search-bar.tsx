import Link from "next/link";

export default function SearchBar() {
  return (
    <div className="search-bar flex items-center rounded-full border-solid border-[6px] h-[100px] w-[50vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50">
      <Link href="/search" className="mr-2">
        <img src="/search.svg" alt="search" className="h-16 w-16" />
      </Link>
      <input className=" text-5xl text-left w-full"></input>
    </div>
  );
}
