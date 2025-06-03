const questionElement = document.getElementById("question-answer") as HTMLDivElement;
if (questionElement == null) throw new Error("Question element not found");

import questions from "../questions.json";

type QA = {
    question: string;
    options: string[];
    correction?: string;
};

interface FuseResult {
    refIndex: number;
}

interface FuseInstance {
    search(query: string): FuseResult[];
}

interface FuseConstructor {
    new(list: QA[], options: { keys: string[]; threshold: number }): FuseInstance;
}

declare const Fuse: FuseConstructor;

const fuse: FuseInstance = new Fuse(questions as QA[], {
    keys: ["question"],
    threshold: 0.5,
});

questionElement.style.display = 'flex';
questionElement.style.flexDirection = 'column';

for (let index = 0; index < questions.length; index++) {
    const rawQuestion = questions[index] as QA;

    const container = document.createElement("div");
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

    const answer = document.createElement("p");
    answer.classList.add("answer");

    let displayAnswer = rawQuestion.options[0];

    if (rawQuestion.correction) {
        const parts: string[] = [];
        const regex = /{{\s*(.+?)\s*}}/g;
        for (let m: RegExpExecArray | null = regex.exec(rawQuestion.correction); m !== null; m = regex.exec(rawQuestion.correction)) {
            parts.push(m[1]);
        }

        if (parts.length) {
            displayAnswer += ` (${parts.join(", ")})`;
        }
    }

    answer.innerText = displayAnswer;
    container.appendChild(answer);
}

const searchInput = document.getElementById("search-input") as HTMLInputElement;
if (searchInput) {
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim();
        const allContainers = document.querySelectorAll(".question-container") as NodeListOf<HTMLDivElement>;

        if (query === "") {
            for (let i = 0; i < allContainers.length; i++) {
                allContainers[i].style.display = '';
            }
        } else {
            const results = fuse.search(query);

            for (let i = 0; i < allContainers.length; i++) {
                allContainers[i].style.display = 'none';
            }

            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                const container = allContainers[result.refIndex];
                container.style.display = '';
                container.style.order = i.toString();
            }
        }
    });
}