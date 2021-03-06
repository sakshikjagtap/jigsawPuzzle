const retrieveImage = (id) => {
  const srcImgPath = document.getElementById(id).src;
  return srcImgPath.split('/').slice(-1);
};

const getValidMoves = ([row, col]) => {
  return [[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]];
};

class Puzzle {
  #grid;
  constructor(imageTiles, blankTile) {
    this.imageTiles = imageTiles;
    this.blankTile = blankTile;
    this.#grid = [];
  }

  initialize() {
    this.#grid = shufflePositions([...this.imageTiles, this.blankTile]);
  }

  #getTilePosition(tile) {
    const positions = [];

    this.#grid.forEach((cell, index) => {
      if (cell.includes(tile)) {
        positions.push(index, cell.indexOf(tile));
      }
    });
    return positions;
  }

  isValidMove([srcImgRow, srcImgCol]) {
    const desImgPosition = this.#getTilePosition(this.blankTile);
    const validMoves = getValidMoves(desImgPosition);

    return validMoves.some(([row, col]) =>
      row === srcImgRow && col === srcImgCol);
  }

  moveTile(id) {
    const [srcImg] = retrieveImage(id);
    const [srcImgRow, srcImgCol] = this.#getTilePosition(srcImg);
    const [desImgRow, desImgCol] = this.#getTilePosition(this.blankTile);

    if (this.isValidMove([srcImgRow, srcImgCol])) {
      const desImg = this.#grid[desImgRow][desImgCol];
      this.#grid[desImgRow][desImgCol] = srcImg;
      this.#grid[srcImgRow][srcImgCol] = desImg;
    }
  }

  isSolved() {
    const tiles = [...this.imageTiles, this.blankTile];
    const shuffledTiles = this.#grid.flat();
    return tiles.every((image, index) => image === shuffledTiles[index]);
  }

  getGrid() {
    return this.#grid;
  }
}

const isUnique = (list, number) => !list.includes(number);

const generateRandomPosition = () => {
  const positions = [];

  while (positions.length < 9) {
    const randomNumber = Math.floor(Math.random() * 9);
    if (isUnique(positions, randomNumber)) {
      positions.push(randomNumber);
    }
  }
  return positions;
}

const groupTiles = (shuffledTiles) => {
  const grid = [];
  let count = 0;

  while (shuffledTiles.length > count) {
    grid.push(shuffledTiles.slice(count, count + 3));
    count += 3;
  }
  return grid;
};

const shuffleImages = (images) => {
  const positions = generateRandomPosition();
  const shuffledTiles = positions.map(position => images[position]);
  return groupTiles(shuffledTiles);
};

const generateImageHtml = (grid) => {
  let position = 1;

  return grid.map(row => {
    return row.map(imagePath => {
      const currentImage = document.createElement('img');
      currentImage.src = 'images/' + imagePath;
      currentImage.id = position;
      position++;
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
  const imageHtml = generateImageHtml(images);
  const rows = generateRows(images.length);
  let count = 0;

  for (const row of rows) {
    const imgElements = imageHtml[count];
    row.append(...imgElements);
    count += 1;
  }
  return rows;
};

const displaySuccessMessage = () => {
  const message = document.getElementById('message');
  message.innerText = 'Congratulation, you solved it..!';
};

const draw = (grid) => {
  const frame = document.getElementById('puzzle-frame');
  frame.innerHTML = null;
  const frameElements = generatePuzzleHtml(grid);
  frame.append(...frameElements);
};

const startPuzzle = (event, puzzle) => {
  puzzle.moveTile(event.target.id);
  draw(puzzle.getGrid());

  if (puzzle.isSolved()) {
    displaySuccessMessage();
  };
};

generateTilesName = () =>
  Array(8).fill(0).map((element, index) => `${index + 1}.jpg`);

const main = () => {
  const tiles = generateTilesName();
  const puzzle = new Puzzle(tiles, 'white.jpg');

  puzzle.initialize();
  draw(puzzle.getGrid());
  document.addEventListener('click', (event) => startPuzzle(event, puzzle));
}

window.onload = main;
