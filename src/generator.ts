interface Question {
    question: string;
    options: string[];
    correction?: string;
}

const questionInput = document.getElementById('submit-question') as HTMLInputElement;
const correctionInput = document.getElementById('correction') as HTMLInputElement;
const optionsContainer = document.getElementById('optionsContainer') as HTMLDivElement;
const addOptionBtn = document.getElementById('addOption') as HTMLButtonElement;
const addQuestionBtn = document.getElementById('addQuestion') as HTMLButtonElement;
const generateBtn = document.getElementById('generateJson') as HTMLButtonElement;
const messageDiv = document.getElementById('message') as HTMLDivElement;
const customMenu = document.getElementById('customMenu') as HTMLDivElement;
const menuWrap = document.getElementById('menuWrap') as HTMLLIElement;
const menuRemoveAll = document.getElementById('menuRemoveAll') as HTMLLIElement;
const codeBlock = document.getElementById('jsonCode') as HTMLElement;
const questionsListDiv = document.getElementById('questionsList') as HTMLDivElement;
const questionCount = document.getElementById('questionCount') as HTMLSpanElement;
const viewQuestionsBtn = document.getElementById('viewQuestions') as HTMLButtonElement;
const modalOverlay = document.getElementById('modalOverlay') as HTMLDivElement;
const closeModalBtn = document.getElementById('closeModal') as HTMLButtonElement;

let optionTexts: string[] = [''];
const questions: Question[] = [];
let isCorrectionEdited = false;

// Mirror question to correction until user modifies correction
questionInput.addEventListener('input', () => {
    if (!isCorrectionEdited) correctionInput.value = questionInput.value;
});
correctionInput.addEventListener('input', () => {
    isCorrectionEdited = true;
});

function renderOptions() {
    optionsContainer.innerHTML = '';
    optionTexts.forEach((opt, idx) => {
        const div = document.createElement('div');
        div.className = 'option';

        const input = document.createElement('input');
        input.type = 'text';
        input.spellcheck = true;
        input.value = opt;
        input.placeholder = idx === 0 ? 'إجابة صحيحة' : 'نص الخيار';
        input.oninput = e => (optionTexts[idx] = (e.target as HTMLInputElement).value);
        div.append(input);

        if (idx > 0) {
            const btn = document.createElement('button');
            btn.textContent = 'حذف';
            btn.className = 'btn delete-button';
            btn.onclick = () => {
                optionTexts.splice(idx, 1);
                renderOptions();
                generateJSON();
            };
            div.append(btn);
        }

        optionsContainer.append(div);
    });
}

function showMessage(text: string) {
    messageDiv.textContent = text;
    setTimeout(() => (messageDiv.textContent = ''), 3000);
}

function toggleBracesAroundSelection() {
    const el = correctionInput;
    const val = el.value;
    let start = el.selectionStart || 0;
    let end = el.selectionEnd || 0;

    if (start === end) {
        const left = val.lastIndexOf(' ', start - 1) + 1;
        const rightSpace = val.indexOf(' ', start);
        end = rightSpace === -1 ? val.length : rightSpace;
        start = left;
    }

    const before = val.slice(0, start);
    const sel = val.slice(start, end);
    const after = val.slice(end);
    const beforeTwo = before.slice(-2);
    const afterTwo = after.slice(0, 2);

    if (beforeTwo === '{{' && afterTwo === '}}') {
        el.value = before.slice(0, -2) + sel + after.slice(2);
        el.setSelectionRange(start - 2, start - 2 + sel.length);
    } else if (sel.includes('{{') || sel.includes('}}')) {
        const clean = sel.replace(/{{|}}/g, '');
        el.value = before + clean + after;
        el.setSelectionRange(before.length, before.length + clean.length);
    } else {
        el.value = before + '{{' + sel + '}}' + after;
        el.setSelectionRange(before.length + 2, before.length + 2 + sel.length);
    }
}

function removeAllBracesFromCorrection() {
    correctionInput.value = correctionInput.value.replace(/{{|}}/g, '');
    correctionInput.setSelectionRange(0, correctionInput.value.length);
}

function renderQuestionsList() {
    if (questions.length === 0) {
        questionsListDiv.innerHTML = '<p>لم تتم إضافة أي أسئلة بعد</p>';
    } else {
        questionsListDiv.innerHTML = '';
        questions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question-item';
            questionDiv.innerHTML = `
                <p>${q.question}</p>
                <button class="btn delete-button" data-index="${index}">حذف</button>
            `;
            questionsListDiv.appendChild(questionDiv);
        });
    }
    questionCount.textContent = `(${questions.length})`;
}

questionsListDiv.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('delete-button')) {
        const index = parseInt(target.getAttribute('data-index') || '0', 10);
        questions.splice(index, 1);
        renderQuestionsList();
        generateJSON();
    }
});

function addHandlers() {
    correctionInput.addEventListener('contextmenu', e => {
        e.preventDefault();
        customMenu.style.top = `${e.clientY}px`;
        customMenu.style.left = `${e.clientX}px`;
        customMenu.style.display = 'block';
    });

    document.addEventListener('click', e => {
        if (!(e.target as HTMLElement).closest('#customMenu')) {
            customMenu.style.display = 'none';
        }
    });

    correctionInput.addEventListener('keydown', e => {
        if (e.ctrlKey && e.code === 'KeyB') {
            e.preventDefault();
            toggleBracesAroundSelection();
            generateJSON();
        }
    });

    menuWrap.onclick = () => {
        toggleBracesAroundSelection();
        customMenu.style.display = 'none';
        generateJSON();
    };
    menuRemoveAll.onclick = () => {
        removeAllBracesFromCorrection();
        customMenu.style.display = 'none';
        generateJSON();
    };

    optionsContainer.addEventListener('keydown', (e) => {
        if (e.target instanceof HTMLInputElement) {
            if (e.key === 'Tab' && !e.shiftKey) {
                const inputs = optionsContainer.querySelectorAll('.option input');
                if (e.target === inputs[inputs.length - 1]) {
                    e.preventDefault();
                    addNewOption();
                }
            } else if (e.ctrlKey && e.key === 'Delete') {
                e.preventDefault();
                const inputs = optionsContainer.querySelectorAll('.option input');
                const index = Array.from(inputs).indexOf(e.target);
                if (index > 0) {
                    optionTexts.splice(index, 1);
                    renderOptions();
                    generateJSON();
                } else {
                    showMessage('لا يمكن حذف الإجابة الصحيحة');
                }
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            addQuestion();
        }
    });

    viewQuestionsBtn.onclick = () => {
        renderQuestionsList();
        modalOverlay.style.display = 'flex';
    };

    closeModalBtn.onclick = () => {
        modalOverlay.style.display = 'none';
    };

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.style.display = 'none';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.style.display === 'flex') {
            modalOverlay.style.display = 'none';
        }
    });
}

function addNewOption() {
    optionTexts.push('');
    renderOptions();
    setTimeout(() => {
        const newInput = optionsContainer.querySelector('.option:last-child input') as HTMLInputElement;
        if (newInput) newInput.focus();
    }, 0);
}

function addQuestion() {
    const q = questionInput.value.trim();
    if (!q) {
        showMessage('يرجى إدخال سؤال');
        return;
    }
    const opts = optionTexts.map(o => o.trim()).filter(o => o);
    if (opts.length < 1 || !optionTexts[0].trim()) {
        showMessage('يجب تحديد إجابة صحيحة على الأقل');
        return;
    }

    const questionObj: Question = { question: q, options: opts };
    const corr = correctionInput.value.trim();
    if (isCorrectionEdited && corr && corr !== q) {
        questionObj.correction = corr;
    }

    questions.push(questionObj);
    questionInput.value = '';
    correctionInput.value = '';
    isCorrectionEdited = false;
    optionTexts = [''];
    renderOptions();
    renderQuestionsList();
    generateJSON();
    showMessage('تم إضافة السؤال');
}

function generateJSON() {
    codeBlock.textContent = JSON.stringify(questions, null, 2);
}

// Initialize
renderOptions();
addHandlers();
renderQuestionsList();
addOptionBtn.onclick = () => {
    addNewOption();
};
addQuestionBtn.onclick = addQuestion;
generateBtn.onclick = () => {
    const jsonData = JSON.stringify(questions, null, 2);
    navigator.clipboard.writeText(jsonData).then(() => {
        showMessage('تم نسخ JSON إلى الحافظة');
    }).catch(err => {
        console.error('Error copying to clipboard:', err);
        showMessage('حدث خطأ أثناء نسخ JSON');
    });
};