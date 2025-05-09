let currentStage = 1;
let player = 1;
let score1 = 0, score2 = 0;
let p1name = "", p2name = "";
let timer;
let timeLeft = 60;
let highScore = localStorage.getItem("bioquest_highscore") || 0;
let soundOn = true;

// المرحلة 1 – صائد الطفيليات
const parasiteQuestions = [
  {
    img: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Plasmodium.jpg",
    correct: "Plasmodium",
    options: ["Plasmodium", "Taenia", "Leishmania"]
  },
  {
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Leishmania_sp_promastigote.jpg/300px-Leishmania_sp_promastigote.jpg",
    correct: "Leishmania",
    options: ["Giardia", "Leishmania", "Entamoeba"]
  },
  {
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Taenia_saginata_scolex.jpg/300px-Taenia_saginata_scolex.jpg",
    correct: "Taenia saginata",
    options: ["Taenia saginata", "Fasciola", "Trichinella"]
  }
];

function startGame() {
  p1name = document.getElementById("player1").value.trim();
  p2name = document.getElementById("player2").value.trim();
  if (!p1name || !p2name) return alert("أدخل أسماء اللاعبين أولاً.");
  document.getElementById("high-score-label").textContent = `أعلى نتيجة: ${highScore}`;
  switchScreen("start-screen", "stage1");
  loadStage1();
  startTimer("timer", () => nextStage());
  playMusic(1);
}

function switchScreen(from, to) {
  document.getElementById(from).classList.remove("active");
  document.getElementById(to).classList.add("active");
}

function startTimer(labelId, callback) {
  timeLeft = 60;
  document.getElementById(labelId).textContent = `الوقت: ${timeLeft} ثانية`;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById(labelId).textContent = `الوقت: ${timeLeft} ثانية`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      callback();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}
function loadStage1() {
  const q = parasiteQuestions[0];
  document.getElementById("parasite-img").src = q.img;
  document.getElementById("turn-info").textContent = "دور اللاعب: " + (player === 1 ? p1name : p2name);
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  shuffle(q.options).forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => {
      if (opt === q.correct) {
        playSound("correct");
        player === 1 ? score1++ : score2++;
      } else {
        playSound("wrong");
      }
      updateScore();
      player = player === 1 ? 2 : 1;
      nextStage();
    };
    optionsDiv.appendChild(btn);
  });
}

function updateScore() {
  document.getElementById("score-info").textContent = `${p1name}: ${score1} | ${p2name}: ${score2}`;
}

function playMusic(num) {
  stopAllMusic();
  const music = document.getElementById(`bg-music-${num}`);
  if (soundOn && music) music.play();
}

function stopAllMusic() {
  for (let i = 1; i <= 4; i++) {
    const m = document.getElementById(`bg-music-${i}`);
    if (m) m.pause();
  }
}

function playSound(type) {
  if (!soundOn) return;
  const snd = document.getElementById(type === "correct" ? "correct-sound" : "wrong-sound");
  if (snd) {
    snd.currentTime = 0;
    snd.play();
  }
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// المرحلة 2 – أسئلة اختيار من متعدد
const mcqQuestions = [
  {
    question: "ما هو الطفيلي المسبب للملاريا؟",
    correct: "Plasmodium",
    options: ["Leishmania", "Taenia", "Plasmodium"]
  },
  {
    question: "ما هو شكل طفيل Leishmania في الإنسان؟",
    correct: "Amastigote",
    options: ["Trophozoite", "Cyst", "Amastigote"]
  }
];
function loadStage2() {
  const q = mcqQuestions[0];
  document.getElementById("mcq-question").textContent = q.question;
  const optionsDiv = document.getElementById("mcq-options");
  optionsDiv.innerHTML = "";
  shuffle(q.options).forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => {
      if (opt === q.correct) {
        playSound("correct");
        player === 1 ? score1++ : score2++;
      } else {
        playSound("wrong");
      }
      updateScore();
      player = player === 1 ? 2 : 1;
      nextStage();
    };
    optionsDiv.appendChild(btn);
  });
  startTimer("mcq-timer", () => nextStage());
}

// المرحلة 3 – ترتيب دورة الحياة
const lifecycleSteps = [
  "بيضة",
  "طور اليرقة",
  "طور الوسيط",
  "انتقال للمضيف النهائي",
  "البلوغ في الأمعاء",
  "طرح البيوض مع البراز"
];

function loadStage3() {
  const dropzone = document.getElementById("dropzone");
  const container = document.getElementById("cards-container");
  dropzone.innerHTML = "";
  container.innerHTML = "";
  const steps = shuffle([...lifecycleSteps]);
  steps.forEach(step => {
    const card = document.createElement("div");
    card.textContent = step;
    card.className = "card";
    card.draggable = true;
    card.ondragstart = e => {
      e.dataTransfer.setData("text", step);
    };
    container.appendChild(card);
  });
  dropzone.ondragover = e => e.preventDefault();
  dropzone.ondrop = e => {
    e.preventDefault();
    const text = e.dataTransfer.getData("text");
    const div = document.createElement("div");
    div.textContent = text;
    div.className = "card";
    dropzone.appendChild(div);
  };
  document.getElementById("stage3-turn").textContent = "دور اللاعب: " + (player === 1 ? p1name : p2name);
  startTimer("stage3-timer", () => submitStage3());
}

function submitStage3() {
  stopTimer();
  const children = Array.from(document.getElementById("dropzone").children);
  const answer = children.map(e => e.textContent);
  const correct = JSON.stringify(answer) === JSON.stringify(lifecycleSteps);
  if (correct) {
    playSound("correct");
    player === 1 ? score1++ : score2++;
  } else {
    playSound("wrong");
  }
  updateScore();
  player = player === 1 ? 2 : 1;
  nextStage();
}
// المرحلة 4 – مطابقة المصطلحات بالتعريفات
const terms = {
  "Trophozoite": "الطور النشيط من الطفيلي",
  "Cyst": "طور الراحة والمقاومة",
  "Vector": "ناقل الطفيلي",
  "Host": "الكائن الذي يعيش فيه الطفيلي"
};

function loadStage4() {
  const termsContainer = document.getElementById("terms-container");
  const defsContainer = document.getElementById("definitions-container");
  termsContainer.innerHTML = "";
  defsContainer.innerHTML = "";

  const keys = shuffle(Object.keys(terms));
  const values = shuffle(Object.values(terms));

  keys.forEach(term => {
    const div = document.createElement("div");
    div.textContent = term;
    div.className = "term";
    div.draggable = true;
    div.ondragstart = e => e.dataTransfer.setData("text", term);
    termsContainer.appendChild(div);
  });

  values.forEach(def => {
    const div = document.createElement("div");
    div.textContent = def;
    div.className = "definition";
    div.ondragover = e => e.preventDefault();
    div.ondrop = e => {
      const draggedTerm = e.dataTransfer.getData("text");
      if (terms[draggedTerm] === def) {
        playSound("correct");
        player === 1 ? score1++ : score2++;
      } else {
        playSound("wrong");
      }
      updateScore();
      div.textContent = `${draggedTerm} ✅`;
      div.style.backgroundColor = "#4caf50";
      div.style.color = "white";
    };
    defsContainer.appendChild(div);
  });

  startTimer("stage4-timer", () => nextStage());
}

function nextStage() {
  stopTimer();
  currentStage++;
  switch (currentStage) {
    case 2:
      switchScreen("stage1", "stage2");
      loadStage2();
      break;
    case 3:
      switchScreen("stage2", "stage3");
      loadStage3();
      playMusic(3);
      break;
    case 4:
      switchScreen("stage3", "stage4");
      loadStage4();
      playMusic(4);
      break;
    case 5:
      showResult();
      break;
  }
}

function showResult() {
  switchScreen("stage4", "end-screen");
  let winner = "تعادل!";
  if (score1 > score2) winner = `${p1name} هو الفائز!`;
  else if (score2 > score1) winner = `${p2name} هو الفائز!`;

  const final = `${winner}\n${p1name}: ${score1} | ${p2name}: ${score2}`;
  document.getElementById("final-result").textContent = final;

  const maxScore = Math.max(score1, score2);
  if (maxScore > highScore) {
    localStorage.setItem("bioquest_highscore", maxScore);
    document.getElementById("high-score-label").textContent = `أعلى نتيجة: ${maxScore}`;
  }
}

function restartGame() {
  location.reload();
}

function toggleSound() {
  soundOn = !soundOn;
  if (!soundOn) stopAllMusic();
  else playMusic(currentStage);
}