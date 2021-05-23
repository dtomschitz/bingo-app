export interface GameSchema {
  _id?: { $oid: string };
  title: string;
  author: string;
  fields: Field[];
  gameInstances?: GameInstance[];
  podium?: podium[];
}

export interface Field {
  _id: string;
  text: string;
  checked: boolean
}

export interface GameInstance {
  userId: string;
  fields: string[];
}

export interface podium {
  userId: string;
  placement: placement;
}

export interface CreateGame {
  title: string;
  fields: string[];
}

enum placement {
  first, second, third
}
