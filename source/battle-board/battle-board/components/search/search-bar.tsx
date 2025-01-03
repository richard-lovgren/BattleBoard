import Link from "next/link";
import Image from "next/image";
import SearchBarData from "@/models/component-props/search-bar-data";

export default function SearchBar(data: SearchBarData) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    data.handleChange(e);
  }

  return (
    <div className="search-bar flex items-center rounded-full border-solid border-white border-[6px] h-[5vh] w-[50vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50">
        <Image
          src="/search.svg"
          alt="search"
          className="h-11 w-11"
          height={100}
          width={100}
        />
      <input value={data.searchString}  onChange={handleChange} className=" text-3xl text-left w-full bg-background text-white"></input>
    </div>
  );
}
