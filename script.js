// ===== TREŚCI - edytuj tutaj =====
const REASONS = [
  "Bo Twój uśmiech to mój ulubiony widok na świecie 😄",
  "Bo leniuch z Ciebie jest uroczy i nie do podrobienia 😌",
  "Bo z Tobą nawet nudne chwile są cudowne 🥰",
  "Bo przepysznie gotujesz pomimo, że tego nie lubisz 😋",
  "Bo przy Tobie czuję się sobą w 100% 💞",
  "Bo Twoje przytulanki leczą wszystko 🤗",
  "Bo wytrzymujesz moje żarty i opowieści, a to wymaga supermocy 🦸",
  "Bo każda chwila jest z Tobą magiczna ✨😏",
  "Bo z Tobą plany na 'nic' są najlepszymi planami 💫",
  "Bo łączy nas tak wiele, szlaki, smaki i marzenia 🏔️",
  "Bo przy Tobie zwykłe miejsca wyglądają zupełnie inaczej 🏔️",
  "Bo po prostu... jesteś Ty, a to już wystarczający powód 💖",
];

const QUIZ = [
  {
    q: "Pytanie 1: Co absolutnie musi być na każdym naszym wypadzie?",
    correct: "Ty, ja i jakiś plan, który i tak nie wyjdzie",
    wrong: ["Idealna pogoda", "Pełen sygnał przez cały czas", "Mapa z zaznaczonymi kawiarniami"],
    answer: () => "Właśnie tak. Reszta jakoś się układa. 🏔️👌",
  },
  {
    q: "Pytanie 2: Co myślę, gdy patrzę na Ciebie i się uśmiechasz?",
    correct: "Że mam szczęście",
    wrong: ["Że może coś przeskrobałam", "Nic szczególnego", "Że zapomniałem coś ważnego"],
    answer: () => "No właśnie to. Nie ma tu żadnej pułapki. 😊",
  },
  {
    q: "Pytanie 3: Które szlaki chciałbym z Tobą zdobyć?",
    correct: "Wszystkie, po kolei",
    wrong: ["Ten najniższy, dla bezpieczeństwa", "Żaden, góry są straszne", "Tylko te z kolejką"],
    answer: () => "Wszystkie po kolei i nie tylko szlaki, a cały świat. 🏔️",
  },
];

const DODGE_MESSAGES = [
  "Nie ta opcja 😏",
  "Próbuj dalej",
  "Naprawdę? 😄",
  "Ten przycisk nie jest dziś dostępny",
  "Hint: kliknij ten drugi przycisk",
  "Ta odpowiedź dziś nie pracuje 🚫",
];

const CAT_PHOTOS = [
  "https://cataas.com/cat/cute?width=400&height=400",
  "https://cataas.com/cat/cute?width=401&height=400",
  "https://cataas.com/cat/cute?width=402&height=400",
  "https://cataas.com/cat/cute?width=403&height=400",
];

// ===== NAWIGACJA =====
const screens = document.querySelectorAll(".screen");
function showScreen(id) {
  screens.forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

document.getElementById("btn-start").addEventListener("click", () => showScreen("screen-intro"));
document.getElementById("btn-accept").addEventListener("click", () => showScreen("screen-reasons"));
document.getElementById("btn-to-quiz").addEventListener("click", () => {
  showScreen("screen-quiz");
  startQuiz();
});
document.getElementById("btn-to-date").addEventListener("click", () => showScreen("screen-date"));

// ===== Generator powodów =====
const reasonBox = document.getElementById("reason-box");
let usedReasons = [];
document.getElementById("btn-reason").addEventListener("click", () => {
  if (usedReasons.length === REASONS.length) usedReasons = [];
  let idx;
  do { idx = Math.floor(Math.random() * REASONS.length); }
  while (usedReasons.includes(idx));
  usedReasons.push(idx);
  reasonBox.textContent = REASONS[idx];
});

// ===== Ekran "hm… / nic …się tu nie dzieje" - autostart przed wszystkim =====
function startHmCo() {
  const wrap = document.getElementById("hmco-wrap");
  wrap.innerHTML = "";

  const steps = [
    { text: "hm…",                  pause: 1500 },
    { text: "nic… się tu nie dzieje", pause: 2500 },
  ];

  let step = 0;

  function showStep() {
    const p = document.createElement("p");
    p.className = "hmco-line";
    p.textContent = steps[step].text;
    wrap.appendChild(p);
    requestAnimationFrame(() => requestAnimationFrame(() => p.classList.add("visible")));

    if (step < steps.length - 1) {
      step++;
      setTimeout(showStep, steps[step - 1].pause);
    } else {
      setTimeout(() => showScreen("screen-start"), steps[step].pause);
    }
  }

  setTimeout(showStep, 600);
}

// Uruchamia się od razu przy załadowaniu strony
startHmCo();

// ===== Quiz =====
let quizIndex = 0;
function startQuiz() {
  quizIndex = 0;
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const questionEl = document.getElementById("quiz-question");
  const optionsEl = document.getElementById("quiz-options");
  const answerEl = document.getElementById("quiz-answer");
  answerEl.textContent = "";
  optionsEl.innerHTML = "";
  destroyDodgeGroup("quiz");

  if (quizIndex >= QUIZ.length) {
    questionEl.textContent = "Wynik: 3/3. Nieźle. 🏆";
    const nextBtn = document.createElement("button");
    nextBtn.className = "btn-main";
    nextBtn.textContent = "Dalej →";
    nextBtn.addEventListener("click", () => showScreen("screen-memes"));
    optionsEl.appendChild(nextBtn);
    return;
  }

  const current = QUIZ[quizIndex];
  questionEl.textContent = current.q;

  const allOptions = [
    ...current.wrong.map((text) => ({ text, ok: false })),
    { text: current.correct, ok: true },
  ];
  allOptions.sort(() => Math.random() - 0.5);

  allOptions.forEach(({ text, ok }) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    if (ok) {
      btn.addEventListener("click", () => {
        answerEl.textContent = current.answer();
        Array.from(optionsEl.children).forEach((b) => (b.disabled = true));
        setTimeout(() => { quizIndex++; renderQuizQuestion(); }, 1400);
      });
      optionsEl.appendChild(btn);
    } else {
      btn.className = "btn-dodge";
      optionsEl.appendChild(btn);
      makeDodgeable(btn, null, "quiz");
    }
  });
}

// ===== Memy i kotki =====
const memeGrid = document.getElementById("meme-grid");
CAT_PHOTOS.forEach((src) => {
  const card = document.createElement("div");
  card.className = "meme-card";
  const img = document.createElement("img");
  img.src = src;
  img.alt = "kotek";
  img.loading = "lazy";
  card.appendChild(img);
  memeGrid.appendChild(card);
});

// ===== Formularz terminu wypadu (Netlify Forms przez fetch) =====
document.getElementById("btn-send-date").addEventListener("click", () => {
  const dateVal = document.getElementById("trip-date").value;
  const timeVal = document.getElementById("trip-time").value;
  const noteVal = document.getElementById("trip-note").value.trim();
  const errorEl = document.getElementById("form-error");

  if (!dateVal) {
    errorEl.textContent = "Podaj datę — samo 'kiedyś' nie wystarczy 😄";
    return;
  }
  errorEl.textContent = "";

  const btn = document.getElementById("btn-send-date");
  btn.textContent = "Wysyłam…";
  btn.disabled = true;

  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      "form-name": "wypad-termin",
      data: dateVal,
      godzina: timeVal || "nie podała",
      notatka: noteVal || "—",
    }).toString(),
  })
    .catch(() => {})
    .finally(() => {
      document.getElementById("form-sent").hidden = false;
      btn.hidden = true;
      setTimeout(() => {
        showScreen("screen-question");
        if (noBtnState) { noBtnState.enabled = true; noBtn.style.display = ""; }
      }, 1600);
    });
});

// ===== Kotki dekoracyjne rozrzucone po całej stronie =====
const DECOR_CAT_SPOTS = [
  { top: "5%",  left: "4%",   size: 120, delay: "0s" },
  { top: "10%", right: "8%",  size: 130, delay: "0.4s" },
  { top: "28%", left: "12%",  size: 140, delay: "0.8s",  hideMobile: true },
  { top: "24%", right: "3%",  size: 110, delay: "1.2s" },
  { top: "48%", left: "2%",   size: 124, delay: "1.6s",  hideMobile: true },
  { top: "52%", right: "14%", size: 136, delay: "2.0s",  hideMobile: true },
  { top: "68%", left: "9%",   size: 144, delay: "2.4s" },
  { top: "72%", right: "5%",  size: 118, delay: "2.8s",  hideMobile: true },
  { top: "88%", left: "20%",  size: 152, delay: "3.2s" },
  { top: "90%", right: "20%", size: 128, delay: "3.6s",  hideMobile: true },
];

const decorCatsContainer = document.getElementById("decor-cats");
DECOR_CAT_SPOTS.forEach((spot, i) => {
  const img = document.createElement("img");
  img.className = "decor-cat" + (spot.hideMobile ? " hide-mobile" : "");
  img.src = `https://cataas.com/cat/cute?width=160&height=160&_=${500 + i}`;
  img.alt = "kotek";
  img.loading = "lazy";
  if (spot.top)    img.style.top    = spot.top;
  if (spot.bottom) img.style.bottom = spot.bottom;
  if (spot.left)   img.style.left   = spot.left;
  if (spot.right)  img.style.right  = spot.right;
  img.style.width  = `${spot.size}px`;
  img.style.height = `${spot.size}px`;
  img.style.animationDuration = `${4 + Math.random() * 2}s`;
  img.style.animationDelay = spot.delay;
  decorCatsContainer.appendChild(img);
});

// ===== Uciekające przyciski =====
const dodgeRegistry = [];
const DODGE_TRIGGER_RADIUS = 70;
const DODGE_DISTANCE = 110;

function destroyDodgeGroup(group) {
  for (let i = dodgeRegistry.length - 1; i >= 0; i--) {
    if (dodgeRegistry[i].group === group) {
      dodgeRegistry[i].btn.remove();
      dodgeRegistry.splice(i, 1);
    }
  }
}

function makeDodgeable(btn, hint, group = "misc") {
  btn.classList.add("btn-dodge");
  const state = { btn, dodgeCount: 0, hint, activated: false, group, enabled: true };
  dodgeRegistry.push(state);

  function activate() {
    if (state.activated) return;
    const rect = btn.getBoundingClientRect();
    const placeholder = document.createElement("span");
    placeholder.style.display = "inline-block";
    placeholder.style.width  = `${rect.width}px`;
    placeholder.style.height = `${rect.height}px`;
    btn.parentNode.insertBefore(placeholder, btn);
    document.body.appendChild(btn);
    btn.style.position = "fixed";
    btn.style.left     = `${rect.left}px`;
    btn.style.top      = `${rect.top}px`;
    btn.style.margin   = "0";
    state.activated = true;
  }

  function moveAwayFrom(cursorX, cursorY) {
    activate();
    const btnRect = btn.getBoundingClientRect();
    const margin = 12;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cx = btnRect.left + btnRect.width  / 2;
    const cy = btnRect.top  + btnRect.height / 2;

    let dx = cursorX == null ? Math.random() * 2 - 1 : cx - cursorX;
    let dy = cursorY == null ? Math.random() * 2 - 1 : cy - cursorY;
    const len = Math.hypot(dx, dy) || 1;
    dx = dx / len + (Math.random() * 0.6 - 0.3);
    dy = dy / len + (Math.random() * 0.6 - 0.3);

    const newLeft = Math.min(Math.max(btnRect.left + dx * DODGE_DISTANCE, margin), vw - btnRect.width  - margin);
    const newTop  = Math.min(Math.max(btnRect.top  + dy * DODGE_DISTANCE, margin), vh - btnRect.height - margin);

    btn.style.left = `${newLeft}px`;
    btn.style.top  = `${newTop}px`;

    state.dodgeCount++;
    if (hint) hint.textContent = DODGE_MESSAGES[Math.min(state.dodgeCount - 1, DODGE_MESSAGES.length - 1)];
  }

  state.moveAwayFrom = moveAwayFrom;

  btn.addEventListener("pointerdown", (e) => { e.preventDefault(); moveAwayFrom(e.clientX, e.clientY); });
  btn.addEventListener("click",       (e) => { e.preventDefault(); moveAwayFrom(null, null); });

  return state;
}

function handlePointerProximity(clientX, clientY) {
  dodgeRegistry.forEach((state) => {
    if (!state.enabled) return;
    const rect = state.btn.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    if (Math.hypot(clientX - cx, clientY - cy) < DODGE_TRIGGER_RADIUS) {
      state.moveAwayFrom(clientX, clientY);
    }
  });
}

window.addEventListener("pointermove", (e) => handlePointerProximity(e.clientX, e.clientY));
window.addEventListener("touchmove",   (e) => {
  if (e.touches[0]) handlePointerProximity(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });

// ===== Przycisk "Nie" =====
const noBtn = document.getElementById("btn-no");
const yesBtn = document.getElementById("btn-yes");
const noHint = document.getElementById("no-hint");
const noBtnState = makeDodgeable(noBtn, noHint, "final");

yesBtn.addEventListener("click", () => {
  noBtnState.enabled = false;
  noBtn.style.display = "none";
  showScreen("screen-final");
  launchConfetti();
});

document.getElementById("btn-restart").addEventListener("click", () => {
  noHint.textContent = "";
  usedReasons = [];
  reasonBox.textContent = "Kliknij, żeby losować →";
  document.getElementById("trip-date").value = "";
  document.getElementById("trip-time").value = "";
  document.getElementById("trip-note").value = "";
  document.getElementById("form-sent").hidden = true;
  const sendBtn = document.getElementById("btn-send-date");
  sendBtn.hidden = false;
  sendBtn.disabled = false;
  sendBtn.textContent = "Wyślij i jedź dalej 🏔️";
  showScreen("screen-start");
});

// ===== Latające emoji w tle =====
const heartsContainer = document.getElementById("floating-hearts");
const HEART_EMOJIS = ["💙", "💙", "💙", "✨", "🏔️", "🥾", "🧭", "🐾", "🐱", "⭐"];
function spawnHeart() {
  const el = document.createElement("div");
  el.className = "floating-heart";
  el.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
  el.style.left = `${Math.random() * 100}vw`;
  el.style.fontSize = `${1 + Math.random() * 1.4}rem`;
  const dur = 6 + Math.random() * 6;
  el.style.animationDuration = `${dur}s`;
  heartsContainer.appendChild(el);
  setTimeout(() => el.remove(), dur * 1000);
}
setInterval(spawnHeart, 700);

const sparklesContainer = document.getElementById("floating-sparkles");
const SPARKLE_EMOJIS = ["⭐", "🌟", "✨", "💫"];
function spawnSparkle() {
  const el = document.createElement("div");
  el.className = "floating-sparkle";
  el.textContent = SPARKLE_EMOJIS[Math.floor(Math.random() * SPARKLE_EMOJIS.length)];
  el.style.left = `${Math.random() * 100}vw`;
  el.style.fontSize = `${0.8 + Math.random() * 1.2}rem`;
  const dur = 5 + Math.random() * 5;
  el.style.animationDuration = `${dur}s`;
  sparklesContainer.appendChild(el);
  setTimeout(() => el.remove(), dur * 1000);
}
setInterval(spawnSparkle, 500);

// ===== Konfetti na finale =====
const canvas = document.getElementById("confetti-canvas");
const ctx    = canvas.getContext("2d");
let confettiPieces = [];
let confettiAnimationId = null;

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function launchConfetti() {
  confettiPieces = [];
  const colors = ["#4a90d9", "#c04ee0", "#ffe066", "#ff6fb1", "#6ee7ff"];
  for (let i = 0; i < 160; i++) {
    confettiPieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      size: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 2 + Math.random() * 3,
      drift: Math.random() * 2 - 1,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 6 - 3,
    });
  }
  if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let falling = false;
  confettiPieces.forEach((p) => {
    p.y += p.speed; p.x += p.drift; p.rotation += p.rotationSpeed;
    if (p.y < canvas.height + 20) falling = true;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    ctx.restore();
  });
  confettiAnimationId = requestAnimationFrame(animateConfetti);
  if (!falling) launchConfetti();
}
