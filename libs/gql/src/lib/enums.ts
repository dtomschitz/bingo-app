import {
  GraphQLEnumType,
} from 'graphql';

export const MutationOperation = new GraphQLEnumType({
  name: 'MutationOperation',
  values: {
      ADD: {
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
