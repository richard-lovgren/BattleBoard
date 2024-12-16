
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface CommunityMembersProps {
  community_id: string;
}

const CommunityMembersList: React.FC<CommunityMembersProps> = ({ community_id }) => {

  console.log("Community ID: ", community_id);

  const testMembers = [
    {
      name: "John",
      role: "Admin"
    },
    {
      name: "Jane",
      role: "Member"
    }
  ]

  return (
    <div className="flex flex-col border-4 border-accent p-4 rounded-md">
      <h1 className="text-3xl flex font-bold font-odibee">Community Members:</h1>
      <div className="flex">
        <Table>
          <TableCaption>The current community members and their roles.</TableCaption>
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
              <TableCell>
                {testMembers[0].role}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default CommunityMembersList;


