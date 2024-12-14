// app/community/[communityId]/page.tsx
import Image from "next/image";


interface CommunityData {
  community_name: string;
  community_id: string;
  community_image: string;
}
interface CommunityPageProps {
  params: {
    community: string;
  };
}

const baseUrl = "http://localhost:3000";

// Fetch community data directly inside the server component
async function fetchCommunityData(communityId: string): Promise<CommunityData> {
  // Example API endpoint; replace with your actual API request
  //console.log("Inside fetch community data: ", communityId);
  console.log("Inside fetch community data: ", communityId);
  const response = await fetch(
    `${baseUrl}/api/community?communityId=${communityId}`,
  );
  if (!response.ok) {
    return { community_name: "", community_id: "", community_image: "" };
  }
  return response.json();
}

// Server component
const CommunityPage = async ({ params }: CommunityPageProps) => {
  // Extract community ID from the URL
  const { community } = params;

  // Fetch community data from the API
  const communityDataHeader = await fetchCommunityData(community);

  return (
    <div className="w-full h-full  flex flex-col gap-4 items-center">
      <div className="w-full  flex text-slate-50 text-3xl flex-row items-center gap-4 px-10 py-0">
        <div className="relative inline-block  flex-shrink-0 w-96 h-96">
          <Image
            src={communityDataHeader.community_image}
            alt="example"
            className="rounded-full"
            layout="fill"
            objectFit="cover"
          ></Image>
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-full shadow-inner shadow-black"></div>
        </div>

        <div className="flex flex-col gap-4  h-full pl-12 pr-36 flex-grow   self-center py-0 bg-transparent">
          <h1 className="flex text-8xl font-odibee text-white">
            {communityDataHeader.community_name}
          </h1>

        </div>


      </div>
    </div>
  );
};

// Export the server component
export default CommunityPage;