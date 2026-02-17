let state = {
  points: 0,
  perClick: 1,
  upgradeLevel: 0,
  electrons: 0
};

function updateUI() {
  document.getElementById("points").textContent =
    `Points: ${Math.floor(state.points)} (per click: ${state.perClick})`;

  const cost = 10 * Math.pow(2, state.upgradeLevel);
  document.getElementById("upgradeInfo").textContent =
    `Upgrade level: ${state.upgradeLevel} | Next cost: ${cost}`;

  document.getElementById("buyUpgrade").textContent =
    `Buy upgrade (cost ${cost})`;

  // feed state to the canvas renderer
  window.renderUniverse?.(state);
}

document.getElementById("gain").onclick = () => {
  state.points += state.perClick;
  updateUI();
};

document.getElementById("buyUpgrade").onclick = () => {
  const cost = 10 * Math.pow(2, state.upgradeLevel);
  if (state.points < cost) return;

  state.points -= cost;
  state.upgradeLevel += 1;
  state.perClick += 1;

  // simple “unlock”: start showing electrons after level 3
  if (state.upgradeLevel >= 3) state.electrons = 2;

  updateUI();
};

updateUI();
