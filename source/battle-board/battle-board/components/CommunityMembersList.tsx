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

import styles from "./communityMembers.module.css";
import { useState, useEffect } from "react";

interface CommunityData {
  community_id: string;
}

var baseUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;

async function fetchUserCommunityMembers(
  communityId: string
): Promise<any> {
  const url = `${baseUrl}/api/community/users?communityId=${communityId}`;
  const response = await fetch(url);
  if (!response.ok) {
    return {};
  }
  const data = await response.json();
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
      const data = await fetchUserCommunityMembers(community_id);
      setCommunityData(data);
      setLoading(false);
    };

    if (community_id) {
      fetchData();
    }
  }, [community_id]);

  if (loading) {
    return <div>Loading community data...</div>;
  }

  if (!communityData) {
    return <div>Failed to load community data.</div>;
  }

 

  return (
    <div className={styles.wrapper}> 
      <h1 className="text-3xl flex font-bold font-odibee">
        Community Members
      </h1>
      <div className={styles.membersListWrapper}>
        {communityData.map((member: any) => (
          <div className={styles.member}>
            {member} 
          </div>
        ))}
       
      </div>
    </div>
  );
};

export default CommunityMembersList;






