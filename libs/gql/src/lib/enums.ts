import { GraphQLEnumType } from 'graphql';

export const MutationType = new GraphQLEnumType({
  name: 'MutationType',
  values: {
    CREATE: {
      value: 0,
    },
    UPDATE: {
      value: 1,
    },
    DELETE: {
      value: 2,
    },
  },
});
