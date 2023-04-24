function playLCRGame(n, listaTirosDado) {
  const jugadores = new Array(n).fill(3); // monedas x jugador
  let pilaCentro = 0; // pila del pilaCentro 
  let jugadorActual = 0; // primer jugador es el 1 
  
  for (let i = 0; i < listaTirosDado.length; i++) { // recorremos el 
    const tiroDado = listaTirosDado[i];
    const jugador = jugadores[jugadorActual];
    
      if (jugador === 0) { // No tiene monedas, siguiente turno 
      continue;
    } else if (jugador === 1) { // 1 moneda
      if (tiroDado === 'L') { //Izquierda
        jugadores[(jugadorActual + n - 1) % n]++;
        jugadores[jugadorActual]--;
      } else if (tiroDado === 'R') { //Derecha
        jugadores[(jugadorActual + 1) % n]++;
        jugadores[jugadorActual]--;
      } else if (tiroDado === 'C') { //Centro
        pilaCentro++;
        jugadores[jugadorActual]--;
      }
    } else if (jugador === 2) { // 2 monedas
      if (tiroDado === 'L') {
        //Izquierda
        jugadores[(jugadorActual + n - 1) % n]++;
        jugadores[jugadorActual]--;
      } else if (tiroDado === 'R') {
        //Derecha
        jugadores[(jugadorActual + 1) % n]++;
        jugadores[jugadorActual]--;
      } else if (tiroDado === 'C') {
        //Centro 
        pilaCentro++;
        jugadores[jugadorActual]--;
      }
    } else {       // 3 monedas o mas monedas
      if (tiroDado === 'L') {
        //Izquierda
        jugadores[(jugadorActual + n - 1) % n]++;
        jugadores[jugadorActual]--;
      } else if (tiroDado === 'R') {
        //Derecha
        jugadores[(jugadorActual + 1) % n]++;
        jugadores[jugadorActual]--;
      } else if (tiroDado === 'C') {
        //Centro
        pilaCentro++;
        jugadores[jugadorActual]--;
      }
    }
    // Siguiente jugador
    jugadorActual = (jugadorActual + 1) % n;
    //Revision si el juego termino
    const jugadoresConMonedas = jugadores.filter(p => p > 0).length;
    if (jugadoresConMonedas === 1) {
      //El juego termina si un jugador tiene monedsa
      const winner = jugadores.findIndex(p => p > 0);
      jugadores[winner] += pilaCentro;
      pilaCentro = 0;
      return jugadores.map((p, i) => `Jugador ${i+1}:${p}${i === winner ? '(W)' : '(+)'}\n`).join('') + `PilaCentro:${pilaCentro}\n`;
    }
  }
 
  return jugadores.map((p, i) => `Jugador ${i+1}:${p}${jugadorActual === i ? '(+)' : ''}\n`).join('') + `PilaCentro:${pilaCentro}\n`;
}

// Example usage:
// const input = [
//     [3, 'LCR*LR']];
console.log(playLCRGame(3, 'LCR*LRLCR*LRLCR*LRLCR*LRLCR*LRLCR*LRLCR*LRLCR*LRLCR*LRLCR*LRLCR*LRLCR*LRLCR*LR'))
