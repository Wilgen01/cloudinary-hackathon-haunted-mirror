import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { grayscale } from '@cloudinary/url-gen/actions/effect';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen/index';
import { face } from '@cloudinary/url-gen/qualifiers/focusOn';
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity';

const posiciones: Record<number, { x: number, y: number }> = {
  1: { x: 0 * 160, y: 0 * 160 },
  2: { x: 1 * 160, y: 0 * 160 },
  3: { x: 2 * 160, y: 0 * 160 },
  4: { x: 0 * 160, y: 1 * 160 },
  5: { x: 1 * 160, y: 1 * 160 },
  6: { x: 2 * 160, y: 1 * 160 },
  7: { x: 0 * 160, y: 2 * 160 },
  8: { x: 1 * 160, y: 2 * 160 },
  0: { x: 2 * 160, y: 2 * 160 }
}
@Component({
  selector: 'app-puzle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './puzle.component.html',
  styleUrl: './puzle.component.scss'
})
export class PuzleComponent implements OnInit {
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);


  board: number[][] = [];
  emptyPosition: { row: number, col: number } = { row: 0, col: 0 };
  imageId: string = '';
  img!: CloudinaryImage;
  cld!: Cloudinary;
  imageUrl: string;
  backgroundImage: string;

  ngOnInit() {
    this.initBoard();
    this.obtenerImageId();

  }

  obtenerImageId() {
    this.inicializarCloudinary();

    this.activatedRoute.params.subscribe((params) => {
      this.imageId = `${params['folder'] + '/' + params['file']}`;
      this.img = this.cld.image(this.imageId);
      this.img.resize(
        auto()
          .width(480)
          .height(480)
          .gravity(focusOn(face()))
      );
      this.imageUrl = this.img.toURL();
      this.obtenerBackgroundImage();
    });
  }

  obtenerBackgroundImage() {
    const tempImg = this.cld.image(this.imageId).resize(auto().width(480).height(480).gravity(focusOn(face())));
    tempImg.effect(grayscale());
    this.backgroundImage = tempImg.toURL();
  }

  inicializarCloudinary() {
    this.cld = new Cloudinary({
      cloud: {
        cloudName: 'cloudWilgen'
      }
    });
  }

  // Inicializa el tablero con una matriz 3x3 y coloca los números aleatorios
  initBoard() {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 0]; // El 0 representa el espacio vacío
    this.shuffleArray(numbers); // Barajar los números

    // Asignar los números al tablero 3x3
    this.board = [
      [numbers[0], numbers[1], numbers[2]],
      [numbers[3], numbers[4], numbers[5]],
      [numbers[6], numbers[7], numbers[8]]
    ];

    // Encontrar la posición del espacio vacío (0)
    this.board.forEach((row, rowIndex) => {
      row.forEach((num, colIndex) => {
        if (num === 0) {
          this.emptyPosition = { row: rowIndex, col: colIndex };
        }
      });
    });
  }

  // Barajar un arreglo de números
  shuffleArray(array: number[]) {
    if (!this.isSolvable()) {
      console.log('No se puede resolver el puzzle, se ha generado un nuevo tablero aleatorio');
      this.shuffleArray(array);
      return
    }
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
    if (this.isMoveValid(row, col)) {
      // Intercambiar la ficha con el espacio vacío
      this.board[this.emptyPosition.row][this.emptyPosition.col] = this.board[row][col];
      this.board[row][col] = 0;

      // Actualizar la nueva posición del espacio vacío
      this.emptyPosition = { row: row, col: col };
    }
  }

  // Verificar si el puzzle está resuelto
  isSolved(): boolean {
    const solution = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    let current = this.board.flat(); // Convertir la matriz en un solo arreglo
    return JSON.stringify(current) === JSON.stringify(solution);
  }

  getStyles(tile: number) {
    if (this.board[this.emptyPosition.row][this.emptyPosition.col] === tile) return {};

    return {
      width: 160 + 'px',
      height: 160 + 'px',
      backgroundImage: 'url(' + this.imageUrl + ')',
      backgroundPosition: (-posiciones[tile].x) + 'px ' + (-posiciones[tile].y) + 'px',
      backgroundSize: 480
    };
  }

  // Función para verificar si el puzzle es resoluble
  isSolvable(): boolean {
    const flatBoard = this.board.flat().filter(num => num !== 0); // Convertir el tablero en una lista, excluyendo el 0
    let inversions = 0;

    // Contar el número de inversiones
    for (let i = 0; i < flatBoard.length - 1; i++) {
      for (let j = i + 1; j < flatBoard.length; j++) {
        if (flatBoard[i] > flatBoard[j]) {
          inversions++;
        }
      }
    }

    // El puzzle es resoluble si el número de inversiones es par
    return inversions % 2 === 0;
  }

}