import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useParams } from "react-router-dom";
import { AnimationsUsecase } from "../../data/animations.usecase";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/shared/view/components/ui/button";
import { Configuration } from "@/services/configurationLoader.service";
import { useConfigs } from "@/app/providers/configuration-provider";

const AnimationPreview = () => {
  const { configuration, isOffline } = useConfigs();
  const { animationId } = useParams();
  const getAnimationById = async (
    config: Configuration,
    id: string,
    _isOffline: boolean,
  ) => {
    if (!config) return null;
    const service = new AnimationsUsecase(config);
    const result = await service.getAnimationById(id, _isOffline);
    return result;
  };
  const { data, isError, isLoading } = useQuery({
    queryKey: [`animation-preview-${animationId ?? ""}`],
    queryFn: () => getAnimationById(configuration, animationId!, isOffline()),
    enabled: Boolean(animationId),
  });

  const onDownload = (src: string) => {
    window.open(src);
  };

  if (isLoading) {
    return <div>Loading animation...</div>;
  }

  if (!data) {
    return <div>Animation not found</div>;
  }
  if (isError) {
    return <div>Sorry an error occured</div>;
  }

  return (
    <div className="flex flex-row flex-wrap items-center gap-4">
      <div className="w-2/3">
        <DotLottieReact src={data.src} autoplay loop className="mx-auto" />
      </div>
      <div className="w-fit flex flex-col items-start gap-4">
        <div>Name: {data.name}</div>
        <div className="flex flex-wrap items-center gap-2">
          Tags:
          {data.tags.map((x) => (
            <div key={x} className="p-0.5 border rounded bg-slate-400">
              {x}
            </div>
          ))}
        </div>
        <Button onClick={() => onDownload(data.src)}>Download asset</Button>
      </div>
    </div>
  );
};

export default AnimationPreview;
