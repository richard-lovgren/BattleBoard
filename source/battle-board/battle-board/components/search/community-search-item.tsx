import Community from "@/models/interfaces/community";
import GeneralButton from "../general-btn";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

//import { useRouter } from "next/router";


export default function CommunitySearchItem(community: Community) {



  return (
      <Link href={`/community/${community.id}`}>
   <div style={{cursor:'pointer'}} className="flex flex-none flex-col h-[340px] w-[329px] rounded-[1.2rem] bg-gradient-to-br from-[#4E35BE] to-[#241958] transform transition-transform duration-300 hover:scale-105">
     
     <div style={{ position: 'relative', overflow: 'hidden' }} className="flex flex-none items-center justify-center rounded-t-[1.2rem] bg-[#D9D9D9] h-[173px] ">
        <Image
          src={community.community_image ? community.community_image : '/community.jpg'}
          alt="image-placeholder"
          className='fit'
          layout='fill'
          objectFit='cover'
        />
      </div>
      <div className="item-container flex flex-col text-[16px] font-outfit p-4">
        <div className="flex flex-col ml-3 mb-3">
          <span className="flex items-center text-[24px] mb-4">
            {community.community_name}
          </span>
          <span className="flex items-center">
            <Image
              src="/customer.svg"
              alt="search"
              className="h-12 w-12 my-[-5px]"
              width={50}
              height={50}
            />
            {community.community_members} members
          </span>
          <span className="flex items-center">
            <Image
              src="/calendar.svg"
              alt="search"
              className="h-12 w-12 my-[-5px]"
              width={50}
              height={50}
            />
            Created {formatDate(community.created_at)}
          </span>
        </div>
      </div>
    </div>
    </Link>
  );
}