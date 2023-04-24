
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
		console.log('start: ', players, center);
		console.log('current player: ', currentPlayer);
		console.log('num rolls', numRolls);
		console.log(diceRolls.join(''));

		if ((numRolls < players[currentPlayer]) && (numRolls < 3)) { // rolls minor to chips
			console.log(2);
			stop = true;
			continue;
		}
		if (players[currentPlayer] === 0) { //no chips
			console.log(1);
			currentPlayer = nextLeft(currentPlayer, numPlayers);
			continue;
		}

		for (let i = 0; i < numRolls; i++) {
			const roll = diceRolls[diceRolls.length - remainingRolls + i];
			console.log(roll);

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
			console.log(players, center);
		}
		remainingRolls -= numRolls;

		winner = getWinner(players);
		if (winner !== false) { //winner
			stop = true;
			continue;
		}
		console.log('end: ', players, center);
		console.log();
		currentPlayer = nextLeft(currentPlayer, numPlayers);
	};
	return [players, center, winner, currentPlayer];
}

// Main function to read input and call the LCR game simulation function
function main() {
	//const input = ['3 LRC**LRC**CRL*LRCR'];
	//const input = ['3 LLLLLL.'];
	// const input = ['4 LRC..LRC..CRL.LRCRLRC..LRC..CRL.LRCR'];
	//const input = ['6 LRC..LRC..CRL.LRCRLRC..LRC..CRL.LRCRLRC..LRC..CRL.LRCRLRC..LRC..CRL.LRCR'];
    input = ['3 CCCCCC...']; //winner
	for (let i = 0; i < input.length; i++) {
		const val = input[i].trim().split(' ');
		const numPlayers = parseInt(val[0]);
		if (numPlayers === 0) { break; } //termino de la validacion 
		const diceRolls = val[1].split('');

		console.log(val);
        
  		const [players, center, winner, nextPlayer] = simulateLCRGame(numPlayers, diceRolls);
		console.log(`Game ${i + 1}:`);
        players.forEach((val,index) => {
            let finalText = '';
            if ((winner === false) && (index === nextPlayer)) finalText = '(*)';
            if (index === winner) finalText = '(W)';    
            console.log(`Player ${index+1}:${val}${finalText}`);
        });
        console.log(`Center:${center}`);

		console.log();
	}

	// const  nummax = 3;
	// for (let i =0;i<nummax;i++){
	//     console.log( i, 'left', nextLeft(i,nummax) );
	//     console.log( i, 'right', nextRight(i,nummax) );
	//     }

	// let caseNum = 1;
	// while (true) {
	//   // Read input
	//   const input = readline().trim().split(' ');
	//   const numPlayers = parseInt(input[0]);
	//   if (numPlayers === 0) break;
	//   const diceRolls = input[1].split('');

	//   // Print the game number
	//   console.log(`Game ${caseNum++}:`);

	//   // Simulate the LCR game
	//   simulateLCRGame(numPlayers, diceRolls);

	//   // Print a blank line to separate the test cases
	//   console.log();
	// }
}

// Call the main function
main();
