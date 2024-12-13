import { Button } from "./ui/button";

interface CommunitiesListProps {
  ids: string[];
}

const CommunitiesList: React.FC<CommunitiesListProps> = ({ ids }) => {
  return (
    <div className="flex bg-red-500 flex-row flex-wrap gap-4 w-full px-10 py-10">
      {ids.map((id) => (
        <Button variant="default" key={id} size="lg" className="h-56 w-96">
          Community {id}
        </Button>
      ))}
    </div>
  );
}

export default CommunitiesList;
