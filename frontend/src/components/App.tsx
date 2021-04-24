import { BingoField } from "../models";
import "../styling/App.scss";
import BingoCard from "./bingo/BingoCard";
import { v4 as uuidv4 } from "uuid";

const generateRow = (): BingoField[] => {
  return Array.from({ length: 5 }, (_, i) => ({
    id: uuidv4(),
    text: "Test",
    isSelected: false,
  }));
};

const fields: BingoField[] = [
  ...generateRow(),
  ...generateRow(),
  ...generateRow(),
  ...generateRow(),
  ...generateRow(),
];

const App = () => {
  return (
    <div id="app">
      <BingoCard fields={fields} />
    </div>
  );
};

export default App;
