interface Question {
    question: string;
    correction?: string;
    options: string[];
    contributor: string;
}

const questionInput = document.getElementById('submit-question') as HTMLInputElement;
const correctionInput = document.getElementById('correction') as HTMLInputElement;
const optionsContainer = document.getElementById('optionsContainer') as HTMLDivElement;
const addOptionBtn = document.getElementById('addOption') as HTMLButtonElement;
const addQuestionBtn = document.getElementById('addQuestion') as HTMLButtonElement;
const generateBtn = document.getElementById('generateJson') as HTMLButtonElement;
const messageDiv = document.getElementById('message') as HTMLDivElement;
const codeBlock = document.getElementById('jsonCode') as HTMLElement;
const questionsListDiv = document.getElementById('questionsList') as HTMLDivElement;
const questionCount = document.getElementById('questionCount') as HTMLSpanElement;
const viewQuestionsBtn = document.getElementById('viewQuestions') as HTMLButtonElement;
const modalOverlay = document.getElementById('modalOverlay') as HTMLDivElement;
const closeModalBtn = document.getElementById('closeModal') as HTMLButtonElement;
const clearBtn = document.getElementById('clearQuestions') as HTMLButtonElement;
const usernameContainer = document.getElementById('usernameContainer') as HTMLDivElement;
const usernameInputWrapper = document.getElementById('usernameInputWrapper') as HTMLDivElement;
const usernameDisplay = document.getElementById('usernameDisplay') as HTMLDivElement;
const usernameInput = document.getElementById('username') as HTMLInputElement;
const saveUsernameBtn = document.getElementById('saveUsername') as HTMLButtonElement;
const usernameText = document.getElementById('usernameText') as HTMLSpanElement;
const editUsernameBtn = document.getElementById('editUsername') as HTMLButtonElement;
const takeQuizBtn = document.getElementById('takeQuiz') as HTMLButtonElement;

let optionTexts: string[] = [''];
const questions: Question[] = [];
let currentUsername: string | null = localStorage.getItem('username');
let isCorrectionEdited = false;

// **1. Changed localStorage key to 'test-questions'**
const savedQuestions = localStorage.getItem('test-questions');
if (savedQuestions) {
    try {
        const parsed = JSON.parse(savedQuestions);
        if (Array.isArray(parsed)) questions.push(...parsed);
    } catch (e) {
        console.error('Error parsing saved questions:', e);
    }
}

// **5. Check question limit on page load**
if (questions.length >= 25) {
    addQuestionBtn.disabled = true;
}

// Initialize username display
if (currentUsername) {
    usernameText.textContent = currentUsername;
    usernameInputWrapper.style.display = 'none';
    usernameDisplay.style.display = 'block';
} else {
    usernameInputWrapper.style.display = 'block';
    usernameDisplay.style.display = 'none';
}

// Auto-fill correction field
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
            btn.className = 'btn delete-button'; // **4. Delete buttons use red styling**
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

function normalizeWord(word: string): string {
    return word.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
}

function highlightDifferences(question: string, correction: string): string {
    const qWords = new Set((question.match(/\S+/g) || []).map(normalizeWord));
    const cParts = correction.match(/(\s+|\S+)/g) || [];
    return cParts.map(part => {
        if (/\s+/.test(part)) return part;
        const normalized = normalizeWord(part);
        return qWords.has(normalized) ? part : `{{${part}}}`;
    }).join('');
}

function renderQuestionsList() {
    questionsListDiv.innerHTML = questions.length === 0
        ? '<p>لم تتم إضافة أي أسئلة بعد</p>'
        : '';
    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        questionDiv.innerHTML = `
            <p>${q.question}</p>
            <button class="btn delete-button" data-index="${index}">حذف</button>
        `;
        questionsListDiv.appendChild(questionDiv);
    });
    questionCount.textContent = `(${questions.length})`;
}

questionsListDiv.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('delete-button')) {
        const index = parseInt(target.getAttribute('data-index') || '0', 10);
        questions.splice(index, 1);
        updateLocalStorage();
        renderQuestionsList();
        generateJSON();
    }
});

// **1 & 5. Updated localStorage to use 'test-questions' and enforce 25-question limit**
function updateLocalStorage() {
    try {
        localStorage.setItem('test-questions', JSON.stringify(questions));
        if (questions.length >= 25) {
            addQuestionBtn.disabled = true;
            showMessage('لقد وصلت إلى الحد الأقصى من 25 سؤالاً. يرجى إرسال الأسئلة إلى البريد الإلكتروني kite-mutual-vibes@duck.com ثم حذف الأسئلة لإضافة المزيد.');
        } else {
            addQuestionBtn.disabled = false;
        }
    } catch (e: any) {
        if (e.name === 'QuotaExceededError') {
            showMessage('لا يمكن حفظ الأسئلة. يرجى مسح السجل.');
            addQuestionBtn.disabled = true;
        } else {
            console.error('Error saving to localStorage:', e);
        }
    }
}

function addHandlers() {
    saveUsernameBtn.onclick = () => {
        const username = usernameInput.value.trim();
        if (username) {
            currentUsername = username;
            localStorage.setItem('username', username);
            usernameText.textContent = username;
            usernameInputWrapper.style.display = 'none';
            usernameDisplay.style.display = 'block';
        } else {
            showMessage('يرجى إدخال اسم المستخدم');
        }
    };

    editUsernameBtn.onclick = () => {
        usernameInput.value = currentUsername || '';
        usernameInputWrapper.style.display = 'block';
        usernameDisplay.style.display = 'none';
    };

    optionsContainer.addEventListener('keydown', (e) => {
        if (e.target instanceof HTMLInputElement && e.key === 'Tab' && !e.shiftKey) {
            const inputs = optionsContainer.querySelectorAll('.option input');
            if (e.target === inputs[inputs.length - 1]) {
                e.preventDefault();
                addNewOption();
            }
        }
    });

    viewQuestionsBtn.onclick = () => {
        renderQuestionsList();
        modalOverlay.style.display = 'flex';
    };

    closeModalBtn.onclick = () => modalOverlay.style.display = 'none';
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.style.display = 'none';
    });
}

function addNewOption() {
    optionTexts.push('');
    renderOptions();
    const newInput = optionsContainer.querySelector('.option:last-child input') as HTMLInputElement;
    if (newInput) newInput.focus();
}

// **5. Added check for 25-question limit**
function addQuestion() {
    if (questions.length >= 25) {
        showMessage('لقد وصلت إلى الحد الأقصى من 25 سؤالاً.');
        return;
    }
    const q = questionInput.value.trim();
    if (!q) {
        showMessage('يرجى إدخال سؤال');
        return;
    }
    if (!currentUsername) {
        showMessage('يرجى حفظ اسم المستخدم أولاً');
        return;
    }
    const opts = optionTexts.map(o => o.trim()).filter(o => o);
    if (opts.length < 2 || !optionTexts[0].trim()) {
        showMessage('يجب تحديد إجابة صحيحة وخيار واحد على الأقل');
        return;
    }

    const corr = correctionInput.value.trim();
    let correction: string | undefined;
    if (corr && corr !== q) correction = highlightDifferences(q, corr);

    const questionObj: Question = {
        question: q,
        correction,
        options: opts,
        contributor: currentUsername
    };

    questions.push(questionObj);
    updateLocalStorage();
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

// **1. Updated to remove 'test-questions'**
clearBtn.onclick = () => {
    if (confirm('هل أنت متأكد؟')) {
        questions.length = 0;
        localStorage.removeItem('test-questions');
        renderQuestionsList();
        generateJSON();
        addQuestionBtn.disabled = false;
        showMessage('تم مسح جميع الأسئلة');
    }
};

// **2 & 3. Added handler for 'Take Quiz' button**
takeQuizBtn.onclick = () => {
    if (questions.length > 0) {
        localStorage.setItem('useTestQuestions', 'true'); // **2. Set flag in localStorage**
        window.location.href = '/exam'; // **3. Redirect to /exam**
    } else {
        showMessage('لا توجد أسئلة لاختبارها');
    }
};

// Initialize
renderOptions();
addHandlers();
renderQuestionsList();
addOptionBtn.onclick = addNewOption;
addQuestionBtn.onclick = addQuestion;
generateBtn.onclick = () => {
    navigator.clipboard.writeText(JSON.stringify(questions, null, 2))
        .then(() => showMessage('تم نسخ JSON إلى الحافظة'))
        .catch(() => showMessage('حدث خطأ أثناء النسخ'));
};