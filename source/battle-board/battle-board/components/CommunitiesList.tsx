import { Button } from "./ui/button";

interface CommunitiesListProps {
  communities: { id: string; name: string }[];
}

const CommunitiesList: React.FC<CommunitiesListProps> = ({ communities }) => {
  return (
    <div className="flex bg-red-500 flex-row flex-wrap gap-4 w-full px-10 py-10">
      {communities.map((community) => (
        <Button
          variant="default"
          key={community.id}
          size="lg"
          className="h-56 w-96"
        >
          {community.name}
        </Button>
      ))}
    </div>
  );
};

export default CommunitiesList;
