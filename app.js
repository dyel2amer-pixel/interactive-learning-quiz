const quizContainer = document.getElementById('quiz-container');
const results = document.getElementById('results');
const nextBtn = document.getElementById('next-btn');
const progressFill = document.querySelector('.progress-fill');
const currentQuestion = document.getElementById('current-question');
const totalQuestions = document.getElementById('total-questions');
const scoreCircle = document.getElementById('score-circle');
const scoreDisplay = document.getElementById('score-display');
const resultMessage = document.getElementById('result-message');
const resultDetail = document.getElementById('result-detail');
const buttonsContainer = document.getElementById('buttons-container');

let current = 0;
let score = 0;
let answered = false;

totalQuestions.textContent = questions.length;

function renderQuestion() {
  const item = questions[current];
  answered = false;
  currentQuestion.textContent = current + 1;
  progressFill.style.width = `${(current / questions.length) * 100}%`;
  nextBtn.disabled = true;
  nextBtn.textContent = current === questions.length - 1 ? 'إنهاء الاختبار ✓' : 'السؤال التالي ➜';

  quizContainer.innerHTML = `
    <div class="quiz-card active">
      <div class="question-number">${current + 1}</div>
      <div class="question">${item.question}</div>
      <div class="options"></div>
      <div class="feedback"></div>
    </div>`;

  const card = quizContainer.querySelector('.quiz-card');
  const options = card.querySelector('.options');
  const feedback = card.querySelector('.feedback');

  item.options.forEach((text, index) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'option';
    option.textContent = text;
    option.addEventListener('click', () => chooseAnswer(index, option, options, feedback));
    options.appendChild(option);
  });
}

function chooseAnswer(index, selected, optionsBox, feedback) {
  if (answered) return;
  answered = true;
  const item = questions[current];
  const buttons = [...optionsBox.querySelectorAll('.option')];
  buttons.forEach((button, i) => {
    button.disabled = true;
    if (i === item.answer) button.classList.add('correct');
  });

  if (index === item.answer) {
    score++;
    selected.classList.add('correct');
    feedback.className = 'feedback show correct';
    feedback.innerHTML = '🎉 أحسنت! إجابة صحيحة ⭐';
  } else {
    selected.classList.add('wrong');
    feedback.className = 'feedback show wrong';
    feedback.innerHTML = `حاول مرة أخرى 💪<br>الإجابة الصحيحة: ${item.options[item.answer]}`;
  }
  nextBtn.disabled = false;
}

function showResults() {
  quizContainer.style.display = 'none';
  results.classList.add('show');
  buttonsContainer.innerHTML = '<button class="btn btn-restart" id="restart-btn">إعادة الاختبار ↻</button>';
  const percent = Math.round((score / questions.length) * 100);
  scoreCircle.textContent = `${percent}%`;
  scoreCircle.style.setProperty('--score-percentage', `${percent}%`);
  scoreDisplay.textContent = `${score}/${questions.length}`;
  resultMessage.textContent = percent >= 80 ? 'رائع! أداء ممتاز 🎉' : percent >= 60 ? 'جيد جدًا، واصل التقدم 👏' : 'راجع الدرس وحاول مرة أخرى 💪';
  resultDetail.textContent = 'تم إعداد الأسئلة من الدروس المرفقة.';
  document.getElementById('restart-btn').addEventListener('click', restart);
}

function restart() {
  current = 0;
  score = 0;
  quizContainer.style.display = 'block';
  results.classList.remove('show');
  buttonsContainer.innerHTML = '<button class="btn btn-next" id="next-btn" disabled>السؤال التالي ➜</button>';
  window.nextBtn = document.getElementById('next-btn');
  window.nextBtn.addEventListener('click', nextQuestion);
  renderQuestion();
}

function nextQuestion() {
  if (!answered) return;
  if (current < questions.length - 1) {
    current++;
    renderQuestion();
  } else {
    showResults();
  }
}

nextBtn.addEventListener('click', nextQuestion);
renderQuestion();
