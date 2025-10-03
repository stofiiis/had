(() => {
  const canvas = document.getElementById('board');
  const ctx = canvas.getContext('2d');
  const size = 24; // grid size (pixels per cell)
  const cells = canvas.width / size; // 480 / 24 = 20

  const scoreEl = document.getElementById('score');
  const bestEl = document.getElementById('best');
  const bestKey = 'snake-best-score';
  let best = Number(localStorage.getItem(bestKey) || 0);
  bestEl.textContent = best;

  let snake, dir, apple, score, speed, loop, playing, pendingDir;

  function init() {
    snake = [{x: 9, y: 10}];
    dir = {x: 1, y: 0};
    pendingDir = dir;
    apple = randFreeCell();
    score = 0;
    speed = 120; // ms per step, decreases as you score
    playing = true;
    updateScore();
    clearInterval(loop);
    loop = setInterval(tick, speed);
    draw();
  }

  function updateScore() {
    scoreEl.textContent = score;
    if (score > best) {
      best = score;
      bestEl.textContent = best;
      localStorage.setItem(bestKey, best);
    }
  }

  function randFreeCell() {
    let pos;
    do {
      pos = { x: Math.floor(Math.random()*cells), y: Math.floor(Math.random()*cells) };
    } while (snake.some(s => s.x===pos.x && s.y===pos.y));
    return pos;
  }

  function drawGrid() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = 'rgba(255,255,255,.06)';
    for (let i=0; i<=cells; i++) {
      ctx.beginPath();
      ctx.moveTo(i*size, 0);
      ctx.lineTo(i*size, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i*size);
      ctx.lineTo(canvas.width, i*size);
      ctx.stroke();
    }
  }

  function draw() {
    drawGrid();
    // apple
    ctx.fillStyle = '#ef4444';
    roundRect(ctx, apple.x*size+3, apple.y*size+3, size-6, size-6, 6, true);
    // snake
    ctx.fillStyle = '#10b981';
    snake.forEach((s, i) => {
      const r = i === snake.length-1 ? 8 : 6;
      roundRect(ctx, s.x*size+2, s.y*size+2, size-4, size-4, r, true);
    });
  }

  function tick() {
    if (!playing) return;
    dir = pendingDir;
    const head = { ...snake[snake.length-1] };
    head.x += dir.x;
    head.y += dir.y;

    // collisions
    if (head.x < 0 || head.y < 0 || head.x >= cells || head.y >= cells ||
        snake.some(s => s.x === head.x && s.y === head.y)) {
      gameOver();
      return;
    }

    snake.push(head);

    if (head.x === apple.x && head.y === apple.y) {
      score++;
      updateScore();
      apple = randFreeCell();
      speed = Math.max(60, speed - 4);
      clearInterval(loop);
      loop = setInterval(tick, speed);
    } else {
      snake.shift(); // move forward
    }

    draw();
  }

  function setDir(nx, ny) {
    // prevent reversing directly
    if (snake.length > 1) {
      const cur = dir;
      if (cur.x === -nx && cur.y === -ny) return;
    }
    pendingDir = {x: nx, y: ny};
  }

  function gameOver() {
    playing = false;
    clearInterval(loop);
    draw();
    ctx.fillStyle = 'rgba(0,0,0,.5)';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = '#e2e8f0';
    ctx.textAlign = 'center';
    ctx.font = 'bold 32px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif';
    ctx.fillText('Konec hry', canvas.width/2, canvas.height/2 - 10);
    ctx.font = '16px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif';
    ctx.fillText(`Skóre: ${score}  •  Nejlepší: ${best}`, canvas.width/2, canvas.height/2 + 20);
    ctx.fillText('Stiskni R pro restart', canvas.width/2, canvas.height/2 + 45);
  }

  // helpers
  function roundRect(ctx, x, y, w, h, r, fill) {
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.arcTo(x+w, y, x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x, y+h, r);
    ctx.arcTo(x, y+h, x, y, r);
    ctx.arcTo(x, y, x+w, y, r);
    ctx.closePath();
    if (fill) ctx.fill();
  }

  // input
  window.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowUp': setDir(0,-1); break;
      case 'ArrowDown': setDir(0,1); break;
      case 'ArrowLeft': setDir(-1,0); break;
      case 'ArrowRight': setDir(1,0); break;
      case 'p': case 'P':
        playing = !playing;
        if (playing) { clearInterval(loop); loop = setInterval(tick, speed); }
        break;
      case 'r': case 'R':
        init();
        break;
    }
  });

  init();
})();
