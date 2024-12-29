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

async function fetchUserCommunityMembers(
  communityId: string
): Promise<any> {
  const url = `/api/community/users?communityId=${communityId}`;
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

  const [communityData, setCommunityData] = useState<any>(null);
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
        {communityData.map((member: any, index: any) => (
          <div className={styles.member} key={index}>
            {member}
          </div>
        ))}

      </div>
    </div>
  );
};

export default CommunityMembersList;






