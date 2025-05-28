const questionEl = document.querySelector("#question") as HTMLHeadingElement;
const progressText = document.querySelector("#progressText") as HTMLParagraphElement;
const progressBarFull = document.querySelector("#progressBarFull") as HTMLDivElement;
const scoreText = document.querySelector("#score") as HTMLHeadingElement;

type Question = {
    question: string;
    options: string[];
    correction?: string;
};

import defaultQuestions from "../questions.json";

let currentQuestion: Question;
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions: Question[] = [];

let questions: Question[];
const params = new URLSearchParams(window.location.search);
const source = params.get('source');

if (source === 'generator') {
    const savedQuestions = localStorage.getItem('test-questions');
    if (savedQuestions) {
        try {
            questions = JSON.parse(savedQuestions);
        } catch (e) {
            console.error('Error parsing saved questions:', e);
            questions = defaultQuestions;
        }
    } else {
        questions = defaultQuestions;
    }
} else {
    questions = defaultQuestions;
}

const isTestQuiz = source === 'generator';

const MAX_QUESTIONS = questions.length > 25 ? 25 : questions.length;

function startexam() {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
}

function getNewQuestion() {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
        if (!isTestQuiz) {
            localStorage.setItem("currentScore", score.toString());
            return window.location.assign("/");
        } else {
            return window.location.assign("generator.html");
        }
    }

    questionCounter++;
    progressText.innerText = `سؤال ${questionCounter} من ${MAX_QUESTIONS}`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];

    const rawQ = currentQuestion.question;
    questionEl.innerHTML = rawQ.replace(/{{\s*(.+?)\s*}}/g, (_, inner) =>
        `<span class="highlight">${inner}</span>`
    );

    const choicesContainer = document.querySelector(".choices") as HTMLDivElement;
    choicesContainer.innerHTML = "";

    shuffle(currentQuestion.options).forEach((choice, index) => {
        const isCorrect = choice === currentQuestion.options[0];
        choicesContainer.innerHTML += createChoiceHTML(choice, index, isCorrect);
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;

    document.querySelectorAll(".choice-container").forEach((choiceDiv) => {
        choiceDiv.addEventListener("click", (e) => {
            if (!acceptingAnswers) return;
            acceptingAnswers = false;

            const selectedDiv = e.currentTarget as HTMLDivElement;
            const correct = selectedDiv.dataset.correct === "true";
            const classToApply = correct ? "correct" : "incorrect";

            if (correct) {
                score++;
                scoreText.innerText = String(score);
            }

            if (currentQuestion.correction) {
                const rawCorr = currentQuestion.correction;
                const highlightedCorr = rawCorr.replace(/{{\s*(.+?)\s*}}/g, (_, inner) =>
                    `<span class="highlight">${inner}</span>`
                );
                questionEl.innerHTML =
                    `<span class="correction-label">تصحيح: </span>` +
                    highlightedCorr;
            }

            // Highlight the correct answer for incorrect selections
            if (!correct) {
                const right = document.querySelector(".hidden-correct") as HTMLDivElement;
                right.classList.remove("hidden-correct");
                right.style.pointerEvents = "none";
                right.style.transition = "none";

                const rightText = right.querySelector(".choice-text") as HTMLParagraphElement;
                rightText.style.transition = "font-size 2s ease-in-out";
                rightText.style.textAlign = "center";
                rightText.scrollIntoView({behavior: "smooth"});

                const blink = setInterval(() => right.classList.toggle("correct"), 200);
                setTimeout(() => {
                    clearInterval(blink);
                    right.classList.add("correct");
                    rightText.scrollIntoView({behavior: "smooth"});
                }, 2000);
            }

            progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
            selectedDiv.classList.add(classToApply);

            // Delay for correct answers is 1s, for incorrect answers is 5s
            setTimeout(() => getNewQuestion(), correct ? 1000 : 5000);
        });
    });
}

function createChoiceHTML(choice: string, idx: number, correct: boolean) {
    const prefix = String.fromCharCode(65 + idx);
    return `
    <div
      class="choice-container ${correct ? "hidden-correct" : ""}"
      data-number="${idx + 1}"
      data-correct="${correct}"
    >
      <p class="choice-prefix">${prefix}</p>
      <p class="choice-text">${choice}</p>
    </div>
  `;
}

function shuffle<T>(arr: T[]): T[] {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }

    const ti = a.findIndex(
        (item) => item === ("صح" as any) || item === ("true" as any)
    );
    if (ti > 0) {
        [a[0], a[ti]] = [a[ti], a[0]];
    }

    return a;
}

startexam();