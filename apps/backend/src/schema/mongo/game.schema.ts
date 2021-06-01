export interface GameSchema {
  _id: string;
  title: string;
  authorId: string;
  fields: GameField[];
  instances: { [key: string]: GameInstanceSchema };
  podium?: Podium[];
}

export interface GameField {
  _id: string;
  text: string;
  checked: boolean;
}

export interface GameInstanceSchema {
  userId: string;
  fields: string[];
}

export interface Podium {
  userId: string;
  placement: Placement;
}

enum Placement {
  first, second, third
}
