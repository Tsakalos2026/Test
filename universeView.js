(() => {
  const canvas = document.getElementById("universe");
  if (!canvas) return; // safety
  const ctx = canvas.getContext("2d");

  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;

  const lerp = (a, b, t) => a + (b - a) * t;

  function circle(x, y, r, fill, alpha = 1) {
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function draw(state, timeMs) {
    // background
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#080a14";
    ctx.fillRect(0, 0, W, H);

    const eCount = Math.max(0, state?.electrons ?? 0);

    // If you want “something” before electrons exist, draw quarks here instead of returning.
    if (eCount <= 0) return;

    const orbitA = 150;
    const orbitB = 70;

    // orbit rings
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(120,160,255,0.35)";
    ctx.beginPath();
    ctx.ellipse(cx, cy, orbitA, orbitB, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(120,160,255,0.22)";
    ctx.beginPath();
    ctx.ellipse(cx, cy, orbitB, orbitA, 0, 0, Math.PI * 2);
    ctx.stroke();

    // nucleus
    circle(cx, cy, 26, "rgba(255,140,90,0.95)");
    circle(cx + 6, cy + 6, 14, "rgba(255,200,150,0.55)");

    // electrons (cap for visuals)
    const n = Math.min(8, Math.floor(eCount));
    const electrons = [];
    const baseT = timeMs * 0.0016;

    for (let i = 0; i < n; i++) {
      const phase = (i / n) * Math.PI * 2;
      const t = baseT + phase;

      const useOrbit1 = (i % 2 === 0);
      const a = useOrbit1 ? orbitA : orbitB;
      const b = useOrbit1 ? orbitB : orbitA;

      const x = cx + a * Math.cos(t);
      const y = cy + b * Math.sin(t);

      // fake depth (front/back)
      const z = (Math.sin(t) + 1) / 2; // 0..1
      electrons.push({ x, y, z });
    }

    // draw far -> near
    electrons.sort((p, q) => p.z - q.z);

    for (const e of electrons) {
      const r = lerp(5, 10, e.z);
      const alpha = lerp(0.35, 0.95, e.z);

      circle(e.x, e.y, 18, "rgba(120,200,255,0.25)", alpha); // glow
      circle(e.x, e.y, r, "rgba(160,220,255,1)", alpha);     // core
    }
  }

  // game.js will call this with the latest state
  let latestState = { electrons: 0 };
  window.renderUniverse = (state) => { latestState = state; };

  function loop(t) {
    draw(latestState, t);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
