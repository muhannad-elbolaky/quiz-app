const container = document.querySelector("#all-questions") as HTMLDivElement;
if (container === null) throw new Error("Container not found");

import questions from "../questions.json";

questions.forEach((question) => {
	const questionContainer = document.createElement("div");
	questionContainer.classList.add("question-container");
	questionContainer.innerHTML = `
    <h2 class="">${question.question}</h2>
  `;
	container.appendChild(questionContainer);
	question.options.forEach((option) => {
		const optionElement = document.createElement("div");
		optionElement.classList.add("option");
		optionElement.innerText = option;
		// @ts-ignore
		questionContainer.querySelector(".choices").appendChild(optionElement);
	});
});
