import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { getPositions } from '../../../shared/helpers/tile-position';

@Component({
  selector: 'app-puzle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './puzle.component.html',
  styleUrl: './puzle.component.scss'
})
export class PuzleComponent implements OnInit {
  @Input({ required: true }) baseImageUrl: string = '';
  @Input({ required: true }) imageUrl: string = '';
  @Input({ required: true }) imageBgUrl: string = '';
  @Output() readonly puzzleCompleted: EventEmitter<void> = new EventEmitter();


  board: number[][] = [];
  emptyPosition: { row: number, col: number } = { row: 0, col: 0 };
  isSolved: boolean = false;
  width: number = 480;
  posiciones: Record<number, { x: number, y: number }> = getPositions(this.width);

  ngOnInit() {
    this.initBoard();
    this.obtenerWidth();
  }

  obtenerWidth() {
    const width = window.innerWidth;
    if (width >= 480) return;
    const residuo = width % 3;
    this.width = width - (residuo + 9);
    this.posiciones = getPositions(this.width);
  }

  // Inicializa el tablero con una matriz 3x3 y coloca los números aleatorios
  initBoard() {
    // El 0 representa el espacio vacío
    let numbers = [1, 2, 3, 4, 5, 6, 7, 0, 8];

    // Barajar los números y asegurarse de que el tablero sea resoluble
    do {
      console.log('mezclado');

      // this.shuffleArray(numbers);
      this.board = [
        [numbers[0], numbers[1], numbers[2]],
        [numbers[3], numbers[4], numbers[5]],
        [numbers[6], numbers[7], numbers[8]]
      ];
    } while (!this.isSolvable()); // Repetir hasta que sea resoluble

    // Encontrar la posición del espacio vacío (0)
    this.board.forEach((row, rowIndex) => {
      row.forEach((num, colIndex) => {
        if (num === 0) {
          this.emptyPosition = { row: rowIndex, col: colIndex };
        }
      });
    });
  }

  shuffleArray(array: number[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Verificar si el movimiento es válido (la ficha está adyacente al espacio vacío)
  isMoveValid(row: number, col: number): boolean {
    const diffRow = Math.abs(this.emptyPosition.row - row);
    const diffCol = Math.abs(this.emptyPosition.col - col);
    return (diffRow === 1 && diffCol === 0) || (diffRow === 0 && diffCol === 1);
  }

  // Mover una ficha si es un movimiento válido
  moveTile(row: number, col: number) {
    if (this.isSolved) return;
    if (this.isMoveValid(row, col)) {
      // Intercambiar la ficha con el espacio vacío
      this.board[this.emptyPosition.row][this.emptyPosition.col] = this.board[row][col];
      this.board[row][col] = 0;

      // Actualizar la nueva posición del espacio vacío
      this.emptyPosition = { row: row, col: col };
      this.checkSolved();
    }
  }

  // Verificar si el puzzle está resuelto
  checkSolved(): boolean {
    const solution = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    let current = this.board.flat(); // Convertir la matriz en un solo arreglo
    this.isSolved = JSON.stringify(current) === JSON.stringify(solution);
    if (this.isSolved) this.puzzleCompleted.emit();
    return this.isSolved;
  }

  getStyles(tile: number) {
    if (this.board[this.emptyPosition.row][this.emptyPosition.col] === tile) return {};

    return {
      width: this.width / 3 + 'px',
      height: this.width / 3 + 'px',
      backgroundImage: 'url(' + this.imageUrl + ')',
      backgroundPosition: (-this.posiciones[tile].x) + 'px ' + (-this.posiciones[tile].y) + 'px',
      backgroundSize: `${this.width}px ${this.width}px`,
    };
  }

  // Función para verificar si el puzzle es resoluble
  isSolvable(): boolean {
    const flatBoard = this.board.flat(); // Convertimos el tablero a una lista
    let inversions = 0;

    // Contar el número de inversiones (excluyendo el espacio vacío)
    for (let i = 0; i < flatBoard.length - 1; i++) {
      for (let j = i + 1; j < flatBoard.length; j++) {
        if (flatBoard[i] !== 0 && flatBoard[j] !== 0 && flatBoard[i] > flatBoard[j]) {
          inversions++;
        }
      }
    }

    // El puzzle es resoluble si el número de inversiones es par
    return inversions % 2 === 0;
  }

}