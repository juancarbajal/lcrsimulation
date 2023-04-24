function playLCR(n: number, rolls: string): void {
  // Initialize the game state
  let chips = Array(n).fill(3); // Each player starts with 3 chips
  let centerChips = 0; // Center pile starts with 0 chips
  let currentPlayer = 0; // Start with Player 1
  let rollIndex = 0; // Index of the current roll in the input string

  // Loop until only one player has chips left
  while (chips.filter(c => c > 0).length > 1) {
    // Determine how many dice the current player can roll
    const diceCount = Math.min(chips[currentPlayer], 3);

    // Collect the rolls for the current player
    const rollsForPlayer = rolls.slice(rollIndex, rollIndex + diceCount);

    // Increment the roll index by the number of rolls taken
    rollIndex += diceCount;

    // Loop through each roll and apply the appropriate action
    for (const roll of rollsForPlayer) {
      switch (roll) {
        case "L":
          chips[currentPlayer]--;
          chips[(currentPlayer + n - 1) % n]++;
          break;
        case "R":
          chips[currentPlayer]--;
          chips[(currentPlayer + 1) % n]++;
          break;
        case "C":
          chips[currentPlayer]--;
          centerChips++;
          break;
      }
    }

    // Move to the next player
    currentPlayer = (currentPlayer + 1) % n;
  }

  // Print the game state
  console.log(`Game ${playLCR.gameNumber}:`);
  for (let i = 0; i < n; i++) {
    const status = chips[i] > 0 ? (i === currentPlayer ? "(+)" : "") : "(W)";
    console.log(`Player ${i + 1}: ${chips[i]} ${status}`);
  }
  console.log(`Center: ${centerChips}`);
  console.log(); // Print an empty line to separate game outputs

  // Increment the game number for the next run
  playLCR.gameNumber++;
}

// Set an initial game number of 1
playLCR.gameNumber = 1;

// Example usage:
playLCR(3, "LCR*LR");
