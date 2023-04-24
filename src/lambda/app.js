function getWinner(players) {
	const possibleWinners = players.filter(c => c > 0);
	return (possibleWinners.length === 1) ? players.indexOf(possibleWinners[0]) : false;
}
function nextLeft(currentPlayer, numPlayers) {
	return (currentPlayer === numPlayers - 1) ? 0 : currentPlayer + 1;
}
function nextRight(currentPlayer, numPlayers) {
	return (currentPlayer === 0) ? numPlayers - 1 : currentPlayer - 1;
}
function simulateLCRGame(numPlayers, diceRolls) {
	const players = new Array(numPlayers).fill(3);
	let center = 0;

	let currentPlayer = 0;
	let remainingRolls = diceRolls.length;

	let stop = false;
	let winner = false;
	while (!stop) {
		const numRolls = Math.min(players[currentPlayer], remainingRolls, 3);
		if ((numRolls < players[currentPlayer]) && (numRolls < 3)) { // rolls minor to chips
			stop = true;
			continue;
		}
		if (players[currentPlayer] === 0) { //no chips
			currentPlayer = nextLeft(currentPlayer, numPlayers);
			continue;
		}

		for (let i = 0; i < numRolls; i++) {
			const roll = diceRolls[diceRolls.length - remainingRolls + i];
			if (roll === 'L') {
				players[currentPlayer]--;
				players[nextLeft(currentPlayer, numPlayers)]++;

			} else if (roll === 'C') {
				players[currentPlayer]--;
				center++;
			} else if (roll === 'R') {
				players[currentPlayer]--;
				players[nextRight(currentPlayer, numPlayers)]++;
			}
		}
		remainingRolls -= numRolls;

		winner = getWinner(players);
		if (winner !== false) { //winner
			stop = true;
			continue;
		}
		currentPlayer = nextLeft(currentPlayer, numPlayers);
	};
	return [players, center, winner, currentPlayer];
}

exports.handler = async (event) => {

	const input = event.data;
	let strReturn = '';
	for (let i = 0; i < input.length; i++) {
		const val = input[i].trim().split(' ');
		const numPlayers = parseInt(val[0]);
		if (numPlayers === 0) { break; } 
		const diceRolls = val[1].split('');
		const [players, center, winner, nextPlayer] = simulateLCRGame(numPlayers, diceRolls);
		strReturn +=`Game ${i + 1}:\n`;
		players.forEach((val, index) => {
			let finalText = '';
			if ((winner === false) && (index === nextPlayer)) finalText = '(*)';
			if (index === winner) finalText = '(W)';
			strReturn += `Player ${index + 1}:${val}${finalText}\n`;
		});
		strReturn += `Center:${center}\n\n`;
	}
	const response = {
		statusCode: 200,
		data: JSON.stringify(strReturn),
	};
	return response;
};
