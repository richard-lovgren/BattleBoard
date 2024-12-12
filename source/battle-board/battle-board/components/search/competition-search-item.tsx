import Competition from "@/models/competition";
import GeneralButton from "../general-btn";
import Image from "next/image";

export default function CompetitionSearchItem(competition: Competition) {
  return (
    <div className="flex flex-none flex-col h-[450px] w-[329px] rounded-[2.5rem] bg-gradient-to-br from-[#4E35BE] to-[#241958]">
      <div className="flex flex-none items-center justify-center rounded-t-[2.5rem] bg-[#D9D9D9] h-[173px] ">
        <Image
          src="/image.svg"
          alt="image-placeholder"
          className="fit"
          width={50}
          height={100}
        />
      </div>
      <div className="item-container flex flex-col text-[16px] font-outfit p-4">
        <div className="flex flex-col ml-3 mb-3">
          <span className="flex items-center text-[24px] mb-4">
            {competition.title}
          </span>
          <span className="flex items-center">
            <Image
              src="/controller.svg"
              alt="search"
              className="h-12 w-12 my-[-5px]"
              width={50}
              height={50}
            />
            {competition.game}
          </span>
          <span className="flex items-center">
            <Image
              src="/customer.svg"
              alt="search"
              className="h-12 w-12 my-[-5px]"
              width={50}
              height={50}
            />
            {competition.participants} participants
          </span>
          <span className="flex items-center">
            <Image
              src="/calendar.svg"
              alt="search"
              className="h-12 w-12 my-[-5px]"
              width={50}
              height={50}
            />
            {competition.start_date}
          </span>
          <span className="flex items-center ml-12 my-2">
            {competition.competition_type}
          </span>
        </div>
        <div className="flex items-center justify-center">
          <GeneralButton />
        </div>
      </div>
    </div>
  );
}