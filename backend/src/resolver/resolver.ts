import { mutations } from "./mutation.resolver.ts";
import { queries } from './query.resolver.ts';

export const resolvers = {
  Query: queries,
  Mutation: mutations,
};