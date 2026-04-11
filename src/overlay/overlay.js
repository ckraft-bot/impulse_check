(() => {
  if (document.getElementById("impulse-check-overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "impulse-check-overlay";

  overlay.innerHTML = `
    <div class="box">
      <h1>Impulse Check</h1>
      <p>This purchase is on a 24-hour hold.</p>

      <div class="questions">
        <p>Do you already own something similar?</p>
        <p>Are you bored right now?</p>
        <p>Will this matter tomorrow?</p>
      </div>

      <button id="close">Close</button>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById("close").onclick = () => {
    overlay.remove();
  };
})();