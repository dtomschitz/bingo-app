export interface GameSchema {
  _id: string;
  title: string;
  authorId: string;
  fields: GameField[];
  instances: { [key: string]: GameInstanceSchema };
  podium?: Podium[];
  phase: Phase;
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

export type Phase = "editing" | "open" | "playing" | "finished";

enum Placement {
  first, second, third
}
