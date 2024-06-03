const question = document.querySelector("#question") as HTMLHeadingElement;
const progressText = document.querySelector(
	"#progressText",
) as HTMLParagraphElement;
const progressBarFull = document.querySelector(
	"#progressBarFull",
) as HTMLDivElement;
const scoreText = document.querySelector("#score") as HTMLHeadingElement;

type Question = {
	question: string;
	options: string[];
};

import { highlight } from "utils/highlight";
import questions from "../questions.json";

let currentQuestion: Question;
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions: Question[] = [];

const MAX_QUESTIONS = questions.length;

function startexam() {
	questionCounter = 0;
	score = 0;
	availableQuestions = [...questions];
	getNewQuestion();
}

function getNewQuestion() {
	if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
		progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
		localStorage.setItem("currentScore", score.toString());
		return window.location.assign("/");
	}

	questionCounter++;
	progressText.innerText = `سؤال ${questionCounter} من ${MAX_QUESTIONS}`;

	const questionIndex = Math.floor(Math.random() * availableQuestions.length);
	currentQuestion = availableQuestions[questionIndex];

	if (currentQuestion.question.length > 90) question.style.fontSize = "3rem";

	question.innerHTML = highlight(currentQuestion.question);

	const choicesContainer = document.querySelector(".choices") as HTMLDivElement;

	choicesContainer.innerHTML = "";

	shuffle(currentQuestion.options).forEach((choice, index) => {
		choicesContainer.innerHTML += createChoiceHTML(
			choice,
			index,
			choice === currentQuestion.options[0],
		);
	});

	availableQuestions.splice(questionIndex, 1);

	acceptingAnswers = true;

	let choices = document.querySelectorAll(
		".choice-container",
	) as NodeListOf<HTMLDivElement>;

	choices.forEach((choice) => {
		choice.addEventListener("click", async (event) => {
			if (!acceptingAnswers) return;

			acceptingAnswers = false;
			const target = event.target as HTMLElement;

			const choiceContainer = target.closest(
				".choice-container",
			) as HTMLDivElement;
			const selectedAnswer = choiceContainer.querySelector(
				".choice-text",
			) as HTMLParagraphElement;

			const classToApply =
				selectedAnswer.innerText === currentQuestion.options[0]
					? "correct"
					: "incorrect";

			if (classToApply === "correct") {
				score++;
				scoreText.innerText = String(score);
			} else {
				const rightAnswer = document.querySelector(
					".hidden-correct",
				) as HTMLDivElement;
				rightAnswer.classList.remove("hidden-correct");
				rightAnswer.style.pointerEvents = "none";
				rightAnswer.style.transition = "none";

				const rightAnswerText = rightAnswer.querySelector(
					".choice-text",
				) as HTMLParagraphElement;
				rightAnswerText.style.transition = "font-size 2s ease-in-out";
				rightAnswerText.style.textAlign = "center";
				rightAnswerText.style.fontSize = "4rem";
				rightAnswerText.scrollIntoView({ behavior: "smooth" });

				const interval = setInterval(() => {
					rightAnswer.classList.toggle("correct");
				}, 200);

				setTimeout(() => {
					clearInterval(interval);
					rightAnswer.classList.add("correct");
					rightAnswerText.scrollIntoView({ behavior: "smooth" });
				}, 2000);
			}

			progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

			selectedAnswer.parentElement!.classList.add(classToApply);

			setTimeout(() => getNewQuestion(), classToApply === "correct" ? 1000 : 5000);
		});
	});
}

function createChoiceHTML(
	choice: string,
	choiceIndex: number,
	correct: boolean = false,
): string {
	const choicePrefix = String.fromCharCode(65 + choiceIndex);
	return `
    <div class="choice-container ${
					correct ? "hidden-correct" : ""
				}" data-number="${choiceIndex + 1}">
      <p class="choice-prefix">${choicePrefix}</p>
      <p class="choice-text">${choice}</p>
    </div>
  `;
}

function shuffle<T extends string>(array: T[]): T[] {
	const shuffledArray = array.slice();

	// Shuffle the array
	for (let i = shuffledArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
	}

	// Ensure 'True' is on top
	const trueIndex = shuffledArray.indexOf("صح" as T);
	if (trueIndex !== 0 && trueIndex !== -1) {
		const temp = shuffledArray[0];
		shuffledArray[0] = shuffledArray[trueIndex];
		shuffledArray[trueIndex] = temp;
	}

	return shuffledArray;
}

startexam();
