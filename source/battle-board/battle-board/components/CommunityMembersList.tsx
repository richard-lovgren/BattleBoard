'use client'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useState, useEffect } from "react";

interface CommunityData {
  community_id: string;
}

var baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
baseUrl = baseUrl?.includes("localhost") ? baseUrl : "https://" + baseUrl;

async function fetchUserCommunitiesData(
  communityId: string
): Promise<any> {
  console.log('I FETCH FUNCTION');
  
  const url = `http://localhost:3000/api/community?communityId=${communityId}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    console.error("Failed to fetch community data:", response.status);
    return { community_id: "" };
  }

  const data = await response.json();
  console.log('RESPONSE', data);
  return data;
}


const CommunityMembersList: React.FC<any> = ({
  community_id,
}) => {

  const [communityData, setCommunityData] = useState< any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchUserCommunitiesData(community_id);
      console.log("Community Data FETCHED: ", data);
      setCommunityData(data);
      setLoading(false);
    };

    if (community_id) {
      console.log("community_id: ", community_id);
      fetchData();
    }
  }, [community_id]);

  if (loading) {
    return <div>Loading community data...</div>;
  }

  if (!communityData) {
    return <div>Failed to load community data.</div>;
  }


  const testMembers = [
    {
      name: "John",
      role: "Admin",
    },
    {
      name: "Jane",
      role: "Member",
    },
  ];

  return (
    <div className="flex flex-col border-4 border-accent p-4 rounded-md">
      <h1 className="text-3xl flex font-bold font-odibee">
        Community Members:
      </h1>
      <div className="flex">
        <Table>
          <TableCaption>
            The current community members and their roles.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">
                {testMembers[0].name}
              </TableCell>
              <TableCell>{testMembers[0].role}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CommunityMembersList;







// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";


// import UserPageBanner from "@/components/UserPageBanner";
// import CommunitiesList from "@/components/CommunitiesList";

// import CompetitionList from "@/components/CompetitionList";
// import CompetitionData from "@/models/interfaces/CompetitionData";



// interface CommunityMembersProps {
//   community_id: string;
// }


// let baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
// baseUrl = baseUrl?.includes("localhost") ? baseUrl : "https://" + baseUrl;
// interface CommunityData {
//   community_id: string;
//   community_name: string;
// }

// // type UserPageProps = Promise<{ discord_id: number }>;

// interface UserData {
//   id: string;
//   discord_id: number;
//   user_name: string;
//   display_name: string;
//   league_puuid: string;
// }

// async function fetchUserData(discord_id: number): Promise<UserData> {
//   // Example API endpoint; replace with your actual API request
//   const response = await fetch(`${baseUrl}/api/users?userId=${discord_id}`);
//   if (!response.ok) {
//     return {
//       id: "",
//       discord_id: 0,
//       user_name: "",
//       display_name: "",
//       league_puuid: "",
//     };
//   }
//   return response.json();
// }

// async function fetchUserCommunitiesData(
//   user_name: string
// ): Promise<CommunityData> {
//   const response = await fetch(
//     `${baseUrl}/api/users/communities?user_name=${user_name}` // Correct URL
//   );
//   if (!response.ok) {
//     return { community_id: "", community_name: "" };
//   }
//   return response.json();
// }

// async function fetchUserCompetitionIds(
//   competition_id: string
// ): Promise<string[]> {
//   const response = await fetch(
//     `${baseUrl}/api/users/competitions?user_name=${competition_id}` // Correct URL
//   );
//   if (!response.ok) {
//     return [];
//   }
//   return response.json();
// }

// async function fetchCompetitionData(
//   competitionId: string
// ): Promise<CompetitionData> {
//   const response = await fetch(
//     `${baseUrl}/api/competitions?competitionId=${competitionId}`
//   );
//   return response.json();
// }

// async function fetchAllCompetitionsData(
//   competitionIds: string[]
// ): Promise<CompetitionData[]> {
//   const competitionsData: CompetitionData[] = [];
//   for (const competitionId of competitionIds) {
//     const competitionData = await fetchCompetitionData(competitionId);
//     competitionsData.push(competitionData);
//   }
//   return competitionsData;
// }

// type UserPageProps = Promise<{ discord_id: number }>;

// const CommunityMembersList = async (props: { params: UserPageProps, community_id: CommunityMembersProps }) => {

//   console.log("Community ID: ", props.community_id);

//   const testMembers = [
//     {
//       name: "John",
//       role: "Admin",
//     },
//     {
//       name: "Jane",
//       role: "Member",
//     },
//   ];

//   return (
//     <div className="flex flex-col border-4 border-accent p-4 rounded-md">
//       <h1 className="text-3xl flex font-bold font-odibee">
//         Community Members:
//       </h1>
//       <div className="flex">
//         <Table>
//           <TableCaption>
//             The current community members and their roles.
//           </TableCaption>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Member</TableHead>
//               <TableHead>Role</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             <TableRow>
//               <TableCell className="font-medium">
//                 {testMembers[0].name}
//               </TableCell>
//               <TableCell>{testMembers[0].role}</TableCell>
//             </TableRow>
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// };

// export default CommunityMembersList;








// // Server component
// const UserPage = async (props: { params: UserPageProps }) => {
  

//   return (
//     <div className="min-h-screen w-full flex flex-col">
//       <UserPageBanner
//         id={userDataHeader.id}
//         discord_id={userDataHeader.discord_id}
//         user_name={userDataHeader.user_name}
//         display_name={userDataHeader.display_name}
//         league_puuid={userDataHeader.league_puuid}
//       ></UserPageBanner>
//       {userCommunitiesMap.length > 0 && (
//         <div className=" flex  flex-col items-start px-48">
//           <h1 className="text-2xl font-semibold text-accent text-white">Communities:</h1>
//           <CommunitiesList communities={userCommunitiesMap}></CommunitiesList>
//         </div>
//       )}
//       {userCompetitionsData.length > 0 && (
//         <div className="flex flex-col items-start px-48">
//           <h1 className="text-2xl font-semibold text-accent text-white">Competitions:</h1>
//           <CompetitionList competitions={userCompetitionsData}></CompetitionList>
//         </div>
//       )}
//     </div>
//   );
// };

// // Export the server component
// // export default UserPage;

