import { Input } from "@/shared/view/components/ui/input";
import Icon from "@/shared/view/icon";

type SearchAnimationProps = {
  isLoading: boolean;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const SearchAnimation = ({
  isLoading,
  value,
  onChange,
}: SearchAnimationProps) => {
  return (
    <div className="flex flex-row items-center gap-4">
      <Icon name="search" />
      <Input type="text" value={value} onChange={onChange} className="" />
      {isLoading && <Icon name="loader" />}
    </div>
  );
};

export default SearchAnimation;
