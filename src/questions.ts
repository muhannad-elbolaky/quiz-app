const questionElement = document.getElementById(
    "question-answer",
) as HTMLDivElement;
if (questionElement == null) throw new Error("Question element not found");

import questions from "../questions.json";

type QA = {
    question: string;
    options: string[];
    correction?: string;
};

for (let index = 0; index < questions.length; index++) {
    const rawQuestion = questions[index] as QA;

    const container = document.createElement("p");
    container.classList.add("question-container");
    questionElement.appendChild(container);

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
    question.id = `${index + 1}`;
    question.innerText = rawQuestion.question;
    container.appendChild(question);

    // add the answer (plus any corrections inside {{…}})
    const answer = document.createElement("p");
    answer.classList.add("answer");

    // assume options[0] is the correct answer
    let displayAnswer = rawQuestion.options[0];

    if (rawQuestion.correction) {
        const parts: string[] = [];
        const regex = /{{\s*(.+?)\s*}}/g;
        let m: RegExpExecArray | null;
        while (true) {
            m = regex.exec(rawQuestion.correction);
            if (m === null) break;
            parts.push(m[1]);
        }

        if (parts.length) {
            displayAnswer += ` (${parts.join(", ")})`;
        }
    }

    answer.innerText = displayAnswer;
    container.appendChild(answer);
}
