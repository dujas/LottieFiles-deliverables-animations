import { useNavigate } from "react-router-dom";
import { Card } from "@/shared/view/components/ui/card";
import AddAnimation from "./add-animation";
import ModalActions from "@/shared/view/modal-actions-btns";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { ErrorBoundary } from "react-error-boundary";
import SearchAnimation from "./search-animation";
import { AnimationsUsecase } from "../../data/animations.usecase";
import { useDebounce } from "@/shared/view/hooks/useDebounce";
import { memo, useCallback, useState } from "react";
import { AnimationListType } from "@/app/animations/domain/animation-entity";
import { useQuery } from "@tanstack/react-query";
import { SearchAnimationsVariables } from "../../data/animations.repository";
import { useConfigs } from "@/app/providers/configuration-provider";
import { Configuration } from "@/services/configurationLoader.service";

const searchAnimations = async (
  config: Configuration,
  variables: SearchAnimationsVariables,
  isOffline: boolean,
) => {
  if (config) {
    const service = new AnimationsUsecase(config);
    const result = service.searchAnimations(variables, isOffline);
    return result;
  }
  return {
    hasNextPage: false,
    totalCount: 0,
    endCursor: "",
    items: [],
  };
};
const useOnSearch = () => {
  const { configuration, isOffline } = useConfigs();
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 500);

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: [`animations-search`, debouncedValue ?? ""],
    queryFn: () =>
      searchAnimations(
        configuration,
        {
          first: 10,
          name: debouncedValue,
          tags: debouncedValue,
        },
        isOffline(),
      ),
  });

  return {
    value,
    onChange,
    isLoading,
    isError,
    hasNextPage: data?.hasNextPage,
    totalCount: data?.totalCount,
    endCursor: data?.endCursor,
    animations: data?.items ?? [],
  };
};

const List = ({
  animations,
  isLoading,
}: {
  animations: AnimationListType;
  isLoading: boolean;
}) => {
  const navigate = useNavigate();
  if (isLoading) {
    return "... loading animations";
  }
  return (
    <div className="mt-4 flex flex-wrap gap-4 justify-start justify-items-center items-center">
      {animations.map((x) => (
        <Card
          key={x.id}
          className="w-[250px] h-[250px] p-8 flex flex-col-reverse justify-between items-center cursor-pointer text-sm"
        >
          <ModalActions
            handleOnEdit={() => navigate(x.id)}
            handleOnDownload={() => window.open(x.src, "_blank")}
          />
          <div className="text-ellipsis">{x.name}</div>
          <ErrorBoundary fallback={<div>{`Failed to load: ${x.name}`}</div>}>
            <DotLottieReact src={x.src} playOnHover className="scale(0.5)" />
          </ErrorBoundary>
        </Card>
      ))}
    </div>
  );
};
const MemoedList = memo(List);

const AnimationList = (): JSX.Element => {
  const { value, onChange, isLoading, animations } = useOnSearch();

  return (
    <div
      data-testid="animations_list"
      className="mt-4 flex flex-col flex-wrap gap-4 items-start"
    >
      <div className="flex items-center gap-4">
        <SearchAnimation
          value={value}
          onChange={onChange}
          isLoading={isLoading}
        />
        <AddAnimation />
      </div>
      <MemoedList animations={animations} isLoading={isLoading} />
    </div>
  );
};

export default AnimationList;
