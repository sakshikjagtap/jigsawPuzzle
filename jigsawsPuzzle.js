(() => {
  const images = [
    "image_part_001.jpg", "image_part_002.jpg", "image_part_003.jpg", "image_part_004.jpg", "image_part_005.jpg", "image_part_006.jpg", "image_part_007.jpg", "image_part_008.jpg", "white.jpg"
  ];

  const generateRandomPosition = () => {
    const positions = [];

    while (positions.length < 9) {
      const randomNumber = Math.floor(Math.random() * 9);

      if (!positions.includes(randomNumber)) {
        positions.push(randomNumber);
      }
    }
    return positions;
  }

  const shuffleImages = (images) => {
    const positions = generateRandomPosition();
    return positions.map((position) => images[position]);
  };

  const generateImageHtml = (images) => {
    return images.map((image, position) => {
      const currentImage = document.createElement('img');
      currentImage.src = 'images/' + image;
      currentImage.id = position + 1;
      return currentImage;
    });
  };

  const generatePuzzleHtml = (images) => {
    const imageHtml = generateImageHtml(images);
    const rows = document.getElementsByClassName('row');
    let count = 0;

    for (const row of rows) {
      const imgElements = imageHtml.slice(count, count + 3);
      row.append(...imgElements);
      count += 3;
    }
  };

  const swap = (shuffledImages, srcImgId, desImgId) => {
    const srcImg = shuffledImages[srcImgId - 1];
    const desImg = shuffledImages[desImgId - 1];
    document.getElementById(desImgId).src = `images/${srcImg}`;
    document.getElementById(srcImgId).src = `images/${desImg}`;
    shuffledImages[srcImgId - 1] = desImg;
    shuffledImages[desImgId - 1] = srcImg;
  };

  const isValidMove = (srcImgId, desImgId) => {
    const diff = desImgId - srcImgId;
    const possibilities = [1, -1, 3, -3];
    return possibilities.includes(diff);
  };

  const startPuzzle = (event, shuffledImages) => {
    let srcImgId = event.target.id;
    let desImgId = shuffledImages.indexOf('white.jpg') + 1;

    if (!isValidMove(srcImgId, desImgId)) {
      return;
    }
    swap(shuffledImages, srcImgId, desImgId);
    desImgId = srcImgId;
  };

  window.onload = () => {
    const shuffledImages = shuffleImages(images);
    generatePuzzleHtml(shuffledImages);
    document.addEventListener('click', (event) => startPuzzle(event, shuffledImages));
  };
})();
