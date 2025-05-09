function startGame() {
  document.getElementById("game").style.display = "none";
  document.getElementById("result").style.display = "block";
  document.getElementById("score").innerText = "مبروك! لقد بدأت التحدي!";
}

function restartGame() {
  document.getElementById("game").style.display = "block";
  document.getElementById("result").style.display = "none";
}
