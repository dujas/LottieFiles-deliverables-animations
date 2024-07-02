export type MongoQuery<T> = {
  [P in keyof T]?:
    | T[P]
    | {
        $regex?: string;
        $options?: string;
        $gt?: T[P];
        // Add other MongoDB operators as needed
      };
} & {
  $or?: MongoQuery<T>[];
  // Add other logical operators as needed
};
