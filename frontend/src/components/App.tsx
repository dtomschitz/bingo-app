import "../styling/App.scss";
import React, { useState } from "react";
import { produce } from "immer";

interface UserBingoInput {
	id: string;
	fieldName: string;
}

function getRandom(digits: number) {
	digits = digits || 8;
	return Math.round(Math.random() * Math.pow(10, digits)).toString();
}


const App = () => {

	const [userBingoInputs, setUserBingoInputs] = useState<UserBingoInput[]>([
		{ id: "5", fieldName: "Ferrari" }
	]);

	return (
		<>
			<div id="app">
				<button onClick={() => {
					setUserBingoInputs(currentBingoField => [...currentBingoField, {
						id: getRandom(6),
						fieldName: ""
					}
					]);
				}} >
					Neues Bingo Feld hinzufügen
    </button>
      Welcome
      {userBingoInputs.map((items, index) => {
				return (
					<div key={items.id}>
						<input onChange={(e) => {
							const fieldName = e.target.value;
							setUserBingoInputs(currentBingoField =>
								produce(currentBingoField, fieldValue => {
									fieldValue[index].fieldName = fieldName;
								})
							);
						}}
							value={items.fieldName} placeholder="Bingo Feld" />
						<button onClick={() => {
							setUserBingoInputs(currentBingoField =>
								currentBingoField.filter(x => x.id !== items.id))
						}
						}>
						Delete
						</button>
					</div>
				);
				})}
			</div>
			<pre>
				{JSON.stringify(userBingoInputs, null, 1)}
			</pre>
		</>
	);
}

export default App
