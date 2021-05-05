import React, { useEffect, useState } from 'react';
//import { Query, useQuery } from "react-apollo";
//import { GameTypes } from "../../../backend/src/schema/gql/game.types";
//import gql from "graphql-tag";

function GetGame() {
  //const { error, loading, data } = useQuery(GameTypes);
  const [games, setGames] = useState([]);

  /*useEffect(() => {
    console.log(data);
    setGames(data.getGame[0]);
  }, [data]);*/

  return <div></div>;
  //needs to return data
}

export default GetGame;
