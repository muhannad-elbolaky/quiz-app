const questionElement = document.getElementById(
	"question-answer",
) as HTMLDivElement;
if (questionElement == null) throw new Error("Question element not found");

import questions from "../questions.json";

questions;

for (let index = 0; index < questions.length; index++) {
	const rawQuestion = questions[index];

	const container = document.createElement("p");
	container.classList.add("question-container");
	questionElement.appendChild(container);

	// add the number of the question
	const questionNumber = document.createElement("p");
	questionNumber.classList.add("question-number");
	questionNumber.innerText = String(index + 1);
	container.appendChild(questionNumber);

	const url = new URL(window.location.href);

	url.searchParams.delete("id");
	const newUrl = url.origin + url.pathname + url.search;

	questionNumber.addEventListener("click", () => {
		navigator.clipboard.writeText(`${newUrl}#${index + 1}`);
		window.location.assign(`${newUrl}#${index + 1}`);
	});

	const question = document.createElement("p");
	question.classList.add("question-page");
	question.id = `question${index + 1}`;
	question.innerText = rawQuestion.question;
	container.appendChild(question);

	// add the answer
	const answer = document.createElement("p");
	answer.classList.add("answer");
	answer.innerText = rawQuestion.options[0];
	container.appendChild(answer);
}
