window.addEventListener('load', function () {
  const numImages = 30;
  const imgSrcs = ['img/PopUpBadsmall.png', 'img/PopUpGoodsmall.png'];
  const bgContainer = document.querySelector('.background-container');

  const minDistance = 150;   // distance to avoid clustering
  const placed = [];         // track positions

  function isTooClose(x, y) {
    return placed.some(p => {
      const dx = p.x - x;
      const dy = p.y - y;
      return Math.sqrt(dx*dx + dy*dy) < minDistance;
    });
  }

  for (let i = 0; i < numImages; i++) {
    const img = document.createElement('img');
    img.src = imgSrcs[Math.floor(Math.random() * imgSrcs.length)];
    img.className = 'scatter-img';

    img.onload = () => {
      let x, y;
      let attempts = 0;

      do {
        x = Math.random() * (window.innerWidth + 200) - 100;
        y = Math.random() * (window.innerHeight + 200) - 100;
        attempts++;
      } while (isTooClose(x, y) && attempts < 10);

      placed.push({ x, y });

      img.style.left = x + 'px';
      img.style.top = y + 'px';
    };

    bgContainer.appendChild(img);
  }
});
