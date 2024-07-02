import { UUID } from "short-uuid";

export type AnimationType = {
  id: UUID | string;
  name: string;
  tags: string;
  src: string;
  createdAt: number;
  updatedAt: number;
  createdOffline?: boolean;
};

export type AnimationListType = Array<AnimationType>;
