const questionEl = document.querySelector("#question") as HTMLHeadingElement;
const progressText = document.querySelector("#progressText") as HTMLParagraphElement;
const progressBarFull = document.querySelector("#progressBarFull") as HTMLDivElement;
const scoreText = document.querySelector("#score") as HTMLHeadingElement;

type Question = {
    question: string;
    options: string[];
    correction?: string;
};

type SolvedQuestion = {
    question: string;
    options: string[];
    correction?: string;
    selectedAnswer: string;
    wasCorrect: boolean;
};

import defaultQuestions from "../questions.json";

let currentQuestion: Question;
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions: Question[] = [];
let lastSolvedQuestions: SolvedQuestion[] = [];

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
const MAX_QUESTIONS = Math.min(questions.length, 25);

function startexam(): void {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    lastSolvedQuestions = [];
    getNewQuestion();
}

function getNewQuestion(): void {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
        localStorage.setItem('last-solved-questions', JSON.stringify(lastSolvedQuestions));
        if (!isTestQuiz) {
            localStorage.setItem("currentScore", score.toString());
            window.location.assign("/end");
        } else {
            window.location.assign("generator.html");
        }
        return;
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

    const shuffledOptions = shuffle(currentQuestion.options);
    shuffledOptions.forEach((choice, index) => {
        const isCorrect = choice === currentQuestion.options[0];
        choicesContainer.innerHTML += createChoiceHTML(choice, index, isCorrect);
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;

    const choiceDivs = document.querySelectorAll<HTMLDivElement>(".choice-container");
    for (const choiceDiv of choiceDivs) {
        choiceDiv.addEventListener("click", (e: Event) => {
            if (!acceptingAnswers) return;
            acceptingAnswers = false;

            const selectedDiv = e.currentTarget as HTMLDivElement;
            const choiceTextEl = selectedDiv.querySelector(".choice-text");
            if (!choiceTextEl || choiceTextEl.textContent === null) {
                return;
            }
            const selectedText = choiceTextEl.textContent;
            const correct = selectedDiv.dataset.correct === "true";
            const classToApply = correct ? "correct" : "incorrect";

            lastSolvedQuestions.push({
                question: currentQuestion.question,
                options: [...currentQuestion.options],
                correction: currentQuestion.correction,
                selectedAnswer: selectedText,
                wasCorrect: correct
            });
            localStorage.setItem(
                "last-solved-questions",
                JSON.stringify(lastSolvedQuestions)
            );

            if (correct) {
                score++;
                scoreText.innerText = score.toString();
            }

            if (currentQuestion.correction) {
                const rawCorr = currentQuestion.correction;
                const highlightedCorr = rawCorr.replace(/{{\s*(.+?)\s*}}/g, (_, inner) =>
                    `<span class="highlight">${inner}</span>`
                );
                questionEl.innerHTML =
                    `<span class="correction-label">Correction: </span>${highlightedCorr}`;
            }

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

            setTimeout(() => getNewQuestion(), correct ? 1000 : 5000);
        });
    }
}

function createChoiceHTML(choice: string, idx: number, correct: boolean): string {
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

function shuffle<T extends string>(arr: T[]): T[] {
    const a = arr.slice();

    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }

    const ti = a.findIndex((item) => item === "صح" || item.toLowerCase() === "true");
    if (ti > 0) {
        [a[0], a[ti]] = [a[ti], a[0]];
    }

    return a;
}


startexam();