import { BingoField } from "../../../lib/models";
import "../styling/App.scss";
import BingoCard from "./bingo/BingoCard";
import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import { produce } from "immer";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
//import GetGame from "./GetGame";

const generateRow = (): BingoField[] => {
  return Array.from({ length: 5 }, (_, i) => ({
    id: uuidv4(),
    text: "Test",
    isSelected: false,
  }));
};

/*const client = new ApolloClient({
  uri: "localhost:8000/graphql",
});*/

const fields: BingoField[] = [
  ...generateRow(),
  ...generateRow(),
  ...generateRow(),
  ...generateRow(),
  ...generateRow(),
];

interface UserBingoInput {
  id: string;
  fieldName: string;
}

function getRandom(digits: number) {
  digits = digits || 8;
  return Math.round(Math.random() * Math.pow(10, digits)).toString();
}

/*function Game() {
  return (
    <ApolloProvider client={client}>
      {""}
      <GetGame />
    </ApolloProvider>
  );
}*/

const App = () => {
  const [userBingoInputs, setUserBingoInputs] = useState<UserBingoInput[]>([
    { id: "5", fieldName: "Ferrari" },
  ]);

  const onWin = () => {
    console.log("WIN!");
  };

  return (
    <>
      <div id="app">
        <button
          onClick={() => {
            setUserBingoInputs((currentBingoField) => [
              ...currentBingoField,
              {
                id: getRandom(6),
                fieldName: "",
              },
            ]);
          }}
        >
          Neues Bingo Feld hinzufügen
        </button>
        Welcome
        {userBingoInputs.map((items, index) => {
          return (
            <div key={items.id}>
              <input
                onChange={(e) => {
                  const fieldName = e.target.value;
                  setUserBingoInputs((currentBingoField) =>
                    produce(currentBingoField, (fieldValue) => {
                      fieldValue[index].fieldName = fieldName;
                    })
                  );
                }}
                value={items.fieldName}
                placeholder="Bingo Feld"
              />
              <button
                onClick={() => {
                  setUserBingoInputs((currentBingoField) =>
                    currentBingoField.filter((x) => x.id !== items.id)
                  );
                }}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
      <pre>{JSON.stringify(userBingoInputs, null, 1)}</pre>
      <BingoCard fields={fields} onWin={onWin} />{" "}
    </>
  );
};

export default App;
