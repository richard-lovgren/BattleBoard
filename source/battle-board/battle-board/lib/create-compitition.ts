import RadioButtonProps from "@/models/component-props/radio-button-props";
import CompetitionDto from "@/models/dtos/competition-dto";
import JoinCompetitionDto from "@/models/dtos/join-competition-dto";
import Game from "@/models/interfaces/game";
import User from "@/models/interfaces/user";

export async function getGames(): Promise<Game[]> {
    const gameResponse = await fetch(`/api/games`);
    if (!gameResponse.ok) {
      throw new Error(`Error fetching games: ${gameResponse.statusText}`);
    }
    return await gameResponse.json();
}

export async function getUsers(): Promise<User[]> {
    const userResponse = await fetch(`/api/users`);
    if (!userResponse.ok) {
      throw new Error(`Error fetching users: ${userResponse.statusText}`);
    }
    return await userResponse.json();
}

export async function getCommunities(
  user_name: string
): Promise<Record<string, string>> {
  const communitiesResponse = await fetch(`/api/users/communities?user_name=${user_name}`);
  if (!communitiesResponse.ok) {
    throw new Error(`Error fetching users communities: ${communitiesResponse.statusText}`);
  }
  return await communitiesResponse.json();
}

export function getSettingsRadioButtonProps(): RadioButtonProps {
    return {
        main_label: "Settings",
        name: "isPublic",
        radioButtons: [
            {
                value: "1",
                label: "Public",
                defaultChecked: true,
            },
            {
                value: "0",
                label: "Private",
            },
        ],
    };
}

export function getModeRadioButtonProps(): RadioButtonProps {
    return {
        main_label: "Choose mode",
        name: "competitionType",
        radioButtons: [
            {
                value: "0",
                label: "Tournament",
                defaultChecked: true,
            },
            {
                value: "1",
                label: "Classic",
            },
            {
                value: "2",
                label: "Rival",
            },
        ],
    };
}

export async function postCompetitionData(
    body: CompetitionDto
  ): Promise<string | null> {
    try {
      console.log("Creating competition with body:", body);
      const url = `/api/competitions`;

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error creating competition: ${response.statusText}`);
      }

      const result = await response.json();
      const id = result.id;
      return id;
    } catch (error) {
      console.error("Error in postCompetitionData:", error);
    }
    return null;
  }

  export async function postJoinCompetitionData(
      body: JoinCompetitionDto
    ): Promise<string | null> {
      try {
        console.log("Creating UserCompetition with body:", body);
        const url = `/api/competitions/join`;
  
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error creating UserCompetition: ${response.statusText}`);
        }
  
        const result = await response.json();
        const id = result.id;
        return id;
      } catch (error) {
        console.error("Error in postJoinCompetitionData:", error);
      }
      return null;
    }

    export function getMUIMenuProps() {
        const ITEM_HEIGHT = 48;
        const ITEM_PADDING_TOP = 8;
        const MenuProps = {
          PaperProps: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
              width: 250,
            },
          },
        };

        return MenuProps
    }
