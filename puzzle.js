const getValidMoves = ([row, col]) => {
  return [[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]];
};

class Puzzle {
  constructor(grid) {
    this.grid = grid;
  }

  isValidMove(srcPosition, desPosition) {
    const [srcRow, srcCol] = srcPosition;
    const validMoves = getValidMoves(desPosition);

    return validMoves.some(([row, col]) =>
      row === srcRow && col === srcCol);
  }

  #getCell(givenId) {
    return this.grid.filter(({ id }) => id == givenId);
  };

  moveTile(givenId) {
    const [src] = this.#getCell(givenId);
    const [destination] = this.#getCell(this.grid.length);

    if (this.isValidMove(src.currentPosition, destination.currentPosition)) {
      const desPosition = destination.currentPosition;
      destination.currentPosition = src.currentPosition;
      src.currentPosition = desPosition;
    }
  }

  getCurrentPositions() {
    return this.grid.map(({ currentPosition }) => currentPosition);
  }
};

const isUnique = (list, number) => !list.includes(number);

const generateRandomPosition = (positionCount) => {
  const positions = [];

  while (positions.length < positionCount) {
    const randomNumber = Math.floor(Math.random() * positionCount);
    if (isUnique(positions, randomNumber)) {
      positions.push(randomNumber);
    }
  }
  return positions;
}

const arrangeTiles = (images, currentPositions) => {
  const length = Math.sqrt(currentPositions.length);
  const tiles = Array(length).fill(0).map(element => []);

  currentPositions.forEach((currentPosition, index) => {
    const [row, col] = currentPosition;
    tiles[row][col] = { image: images[index], id: index + 1 };
  });
  return tiles;
};

const shufflePositions = (grid) => {
  const positions = generateRandomPosition(grid.length);
  return positions.map(position => grid[position]);
};

const generatePosition = (rows, columns) => {
  return Array(rows).fill(0).map((element, rowNumber) => {
    return Array(columns).fill(0).map((number, columnNumber) =>
      [rowNumber, columnNumber])
  });
};

const createGridLookup = (cellContent) => {
  const size = Math.sqrt(cellContent.length);
  const positions = generatePosition(size, size).flat();
  const shuffledPositions = shufflePositions(positions);

  return shuffledPositions.map((element, index) => {
    return { id: index + 1, currentPosition: element, actualPosition: positions[index] };
  });
};

const generateImageHtml = (grid) => {

  return grid.map(row => {
    return row.map(({ image, id }) => {
      const currentImage = document.createElement('img');
      currentImage.src = 'images/' + image;
      currentImage.id = id;
      return currentImage;
    });
  });
};

const generateRows = (count) => {
  return Array(count).fill(0).map((element, index) => {
    const row = document.createElement('div');
    row.className = 'row';
    row.id = 'row-' + (index + 1);
    return row;
  });
};

const generatePuzzleHtml = (images) => {
  const imageElements = generateImageHtml(images);
  const rows = generateRows(images.length);
  return rows.map((row, index) => row.append(...imageElements[index]));
};

const displaySuccessMessage = () => {
  const message = document.getElementById('message');
  message.innerText = 'Congratulation, you solved it..!';
};

const draw = (tiles, currentPositions) => {
  const grid = arrangeTiles(tiles, currentPositions)
  const frame = document.getElementById('puzzle-frame');
  frame.innerHTML = null;
  const frameElements = generatePuzzleHtml(grid);
  frame.append(...frameElements);
};

const startPuzzle = (event, puzzle, tiles) => {
  puzzle.moveTile(event.target.id);
  const currentPositions = puzzle.getCurrentPositions();
  draw(tiles, currentPositions);
};

generateTilesName = () =>
  Array(8).fill(0).map((element, index) => `${index + 1}.jpg`);

const main = () => {
  const tiles = [...generateTilesName(), 'white.jpg'];
  const gridLookup = createGridLookup(tiles);
  const puzzle = new Puzzle(gridLookup);

  const currentPositions = puzzle.getCurrentPositions();
  draw(tiles, currentPositions);
  document.addEventListener('click', (event) => startPuzzle(event, puzzle, tiles));
}

window.onload = main;