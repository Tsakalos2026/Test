let state = {
  points: 0,
  perClick: 1,
  upgradeLevel: 0
};

function updateUI() {
  document.getElementById("points").textContent =
    `Points: ${Math.floor(state.points)} (per click: ${state.perClick})`;

  const cost = 10 * Math.pow(2, state.upgradeLevel);
  document.getElementById("upgradeInfo").textContent =
    `Upgrade level: ${state.upgradeLevel} | Next cost: ${cost}`;
  document.getElementById("buyUpgrade").textContent =
    `Buy upgrade (cost ${cost})`;
}

document.getElementById("gain").onclick = () => {
  state.points += state.perClick;
  updateUI();
};

document.getElementById("buyUpgrade").onclick = () => {
  const cost = 10 * Math.pow(2, state.upgradeLevel);
  if (state.points >= cost) {
    state.points -= cost;
    state.upgradeLevel += 1;
    state.perClick += 1;
    updateUI();
  }
};

updateUI();
