import { useCallback, useState } from "react";
import { Button } from "@/shared/view/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/shared/view/components/ui/dialog";
import { Input } from "@/shared/view/components/ui/input";
import { Label } from "@/shared/view/components/ui/label";
import Icon from "@/shared/view/icon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimationAddVariables } from "@/app/animations/data/animations.repository";
import {
  AnimationsUsecase,
  UploadAnimationType,
} from "@/app/animations/data/animations.usecase";
import { Configuration } from "@/services/configurationLoader.service";
import { useConfigs } from "@/app/providers/configuration-provider";
import { uuid } from "short-uuid";

const isValid = (name?: string, tags?: string, lottieFileUrl?: string) => {
  return name && tags && tags.split(",").length > 0 && lottieFileUrl;
};

const uploadAnimation = async ({
  Key,
  type,
  file,
  config,
}: UploadAnimationType & { config: Configuration }): Promise<boolean> => {
  const service = new AnimationsUsecase(config);
  const result = await service.uploadAnimation({
    Key,
    type,
    file,
  });
  return result;
};

const useAddAnimationQuery = (configuration: Configuration) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (variables: AnimationAddVariables) => {
      const service = new AnimationsUsecase(configuration);
      const result = await service.addAnimation(variables);
      return result;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["animations-search"] });
    },
  });
  return mutation;
};
const AddAnimation = () => {
  const [name, setName] = useState<string>();
  const [tags, setTags] = useState<string>();
  const [lottieFileUrl, setLottieFileUrl] = useState<string>();
  const { configuration } = useConfigs();
  const mutation = useAddAnimationQuery(configuration);

  const handleAnimationFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      const files = event.target.files ?? [];
      const file = files[0];
      if (file) {
        const Key = `${uuid()}.json`;
        const isUploaded = await uploadAnimation({
          Key,
          type: file.type,
          file,
          config: configuration,
        });
        if (isUploaded) {
          setLottieFileUrl(Key);
        }
      }
    },
    [configuration],
  );

  const onSubmit = () => {
    if (isValid(name, tags, lottieFileUrl)) {
      mutation.mutate({
        name: name!,
        tags: tags!,
        src: lottieFileUrl!,
      });
    }
  };

  if (mutation.isError) {
    <div>An error occurred: {mutation.error.message}</div>;
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={!navigator.onLine}>
          <Icon name="plus" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload a Lottie file</DialogTitle>
          <DialogDescription>
            Give it a name and add some tags (separated by a comma). Upload your
            lottie file and click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue=""
              className="col-span-3"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setName(event.target.value);
              }}
              maxLength={50}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Tags
            </Label>
            <Input
              id="tags"
              defaultValue=""
              className="col-span-3"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTags(event.target.value);
              }}
              maxLength={50}
            />
          </div>
          <div className="cursor-pointer grid grid-cols-4 items-center gap-4">
            <Label htmlFor="animationFile" className="text-right">
              Upload
            </Label>
            <Input
              id="tags"
              type="file"
              className="cursor-pointer col-span-3 dark:text-white"
              onChange={handleAnimationFileUpload}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={onSubmit}
              disabled={!isValid(name, tags, lottieFileUrl)}
            >
              Save changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddAnimation;
