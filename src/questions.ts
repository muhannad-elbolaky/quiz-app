const questionElement = document.getElementById("question-answer") as HTMLDivElement;
if (questionElement == null) throw new Error("Question element not found");

import questions from "../questions.json";

type QA = {
    question: string;
    options: string[];
    correction?: string;
};

function getFzfMatchScore(text: string, query: string): { span: number; firstIndex: number } | null {
    let pos = -1;
    const positions: number[] = [];

    for (const ch of query) {
        pos = text.indexOf(ch, pos + 1);
        if (pos === -1) return null;
        positions.push(pos);
    }

    const firstIndex = positions[0];
    const lastIndex = positions[positions.length - 1];
    return {span: lastIndex - firstIndex, firstIndex};
}

questionElement.style.display = "flex";
questionElement.style.flexDirection = "column";

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
        for (
            let m: RegExpExecArray | null = regex.exec(rawQuestion.correction);
            m !== null;
            m = regex.exec(rawQuestion.correction)
        ) {
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
        const rawQuery = searchInput.value.trim().toLowerCase();
        const allContainers = document.querySelectorAll(
            ".question-container"
        ) as NodeListOf<HTMLDivElement>;

        if (rawQuery === "") {
            for (let i = 0; i < allContainers.length; i++) {
                const c = allContainers[i];
                c.style.display = "";
                c.style.order = "";
            }
        } else {
            const matches: { index: number; score: { span: number; firstIndex: number } }[] = [];

            for (let i = 0; i < questions.length; i++) {
                const questionText = questions[i].question.toLowerCase();
                const score = getFzfMatchScore(questionText, rawQuery);
                if (score !== null) {
                    matches.push({index: i, score});
                }
            }

            matches.sort((a, b) => {
                if (a.score.span !== b.score.span) {
                    return a.score.span - b.score.span;
                }
                return a.score.firstIndex - b.score.firstIndex;
            });

            for (let i = 0; i < allContainers.length; i++) {
                const c = allContainers[i];
                c.style.display = "none";
                c.style.order = "";
            }

            for (let rank = 0; rank < matches.length; rank++) {
                const refIndex = matches[rank].index;
                const container = allContainers[refIndex];
                container.style.display = "";
                container.style.order = rank.toString();
            }
        }
    });
}
