interface SolvedQuestion {
    question: string;
    options: string[];
    selectedAnswer: string;
    wasCorrect: boolean;
    correction?: string;
}

const solvedQuestions: SolvedQuestion[] = JSON.parse(localStorage.getItem('last-solved-questions') || '[]');

const score: number = solvedQuestions.filter(q => q.wasCorrect).length;
const scoreElement = document.getElementById('score') as HTMLHeadingElement;
scoreElement.textContent = `درجتك هي ${score} من ${solvedQuestions.length}`;

const solvedQuestionsContainer = document.getElementById('solved-questions') as HTMLDivElement;
for (const q of solvedQuestions) {
    const questionDiv = document.createElement('div');
    questionDiv.className = q.wasCorrect ? 'correct' : 'incorrect';

    const highlightedQuestion = q.question.replace(/{{\s*(.+?)\s*}}/g, (_, inner) => `<span class="highlight">${inner}</span>`);

    let correctionHTML = '';
    if (q.correction) {
        const highlightedCorrection = q.correction.replace(/{{\s*(.+?)\s*}}/g, (_, inner) => `<span class="highlight">${inner}</span>`);
        correctionHTML = `<p class="correction">📕Correction: ${highlightedCorrection}</p>`;
    }

    questionDiv.innerHTML = `
        <p>${highlightedQuestion}</p>
        <ul>
            ${q.options.map(option => `
                <li class="${option === q.selectedAnswer ? 'selected' : ''} ${option === q.options[0] ? 'correct' : ''}"
                    aria-label="${option === q.options[0] ? 'Correct answer' : ''} ${option === q.selectedAnswer ? 'Your choice' : ''}">
                    ${option === q.options[0] ? '<span class="correct-icon" title="Correct answer">✓</span>' : ''}
                    ${option === q.selectedAnswer ? '<span class="selected-icon" title="Your choice">👤</span>' : ''}
                    ${option}
                </li>
            `).join('')}
        </ul>
        ${correctionHTML}
    `;
    solvedQuestionsContainer.appendChild(questionDiv);
}

const backButton = document.getElementById('back-button') as HTMLButtonElement;
backButton.onclick = () => {
    window.location.assign('/');
};