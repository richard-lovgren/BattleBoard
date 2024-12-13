// app/community/[communityId]/page.tsx

import UserPageBanner from "@/components/UserPageBanner";

interface CommunityData {
	community_name: string;
	community_id: string;
	community_image: string;
}



interface UserPageParams {
	params: {
		user_id: string;
	};
}







interface UserData {
	id: string;
	discord_id: number;
	user_name: string;
	display_name: string;
	league_puuid: string;
}

const baseUrl = "http://localhost:3000";

async function fetchUserData(user_id: string): Promise<UserData> {
	// Example API endpoint; replace with your actual API request
	//console.log("Inside fetch community data: ", communityId);
	const response = await fetch(
		`${baseUrl}/api/users?userId=${user_id}`,
	);
	if (!response.ok) {
		return { id: "", discord_id: 0, user_name: "", display_name: "", league_puuid: "" };
	}
	return response.json();
}




async function fetchUserCommunitiesData(user_id: string): Promise<CommunityData> {
	console.log("Inside fetch user communities data RELEVANT: ", user_id);
	const response = await fetch(
		`${baseUrl}/api/users/communities?userId=${user_id}`, // Correct URL
	);
	if (!response.ok) {
		console.log("Response.ok: ", response.ok);
		return { community_name: "", community_id: "", community_image: "" };
	}
	return response.json();
}






// Server component
const UserPage: React.FC<UserPageParams> = async ({ params }: { params: { user_id: string } }) => {
	// Extract community ID from the URL
	const { user_id } = params;

	// Fetch user data from the API
	const userDataHeader = await fetchUserData(user_id);

	const userCommunitiesData = await fetchUserCommunitiesData(userDataHeader.id);

	console.log("User Communities Data: ", userCommunitiesData);






	return (
		<UserPageBanner id={userDataHeader.id} discord_id={userDataHeader.discord_id} user_name={userDataHeader.user_name} display_name={userDataHeader.display_name} league_puuid={userDataHeader.league_puuid}></UserPageBanner>
	);
};

// Export the server component
export default UserPage;
