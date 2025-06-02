import questions from '../questions.json';

interface Question {
    contributor?: string;
}

const contributorCounts: { [key: string]: number } = {};

for (let i = 0; i < questions.length; i++) {
    const question: Question = questions[i];
    const contributor = question.contributor;
    if (contributor) {
        contributorCounts[contributor] = (contributorCounts[contributor] || 0) + 1;
    }
}

const {forEach} = Object.entries(contributorCounts).sort(
    ([first, second], [first1, second1]) => second1 - second || first.localeCompare(first1)
);

const list = document.getElementById('contributor-list');
if (list) {
    forEach(([contributor, count]) => {
        const li = document.createElement('li');
        li.className = 'contributor-item';

        const nameSpan = document.createElement('p');
        nameSpan.className = 'name';
        nameSpan.textContent = contributor;

        const countSpan = document.createElement('p');
        countSpan.className = 'count';
        countSpan.textContent = `${count}`;

        li.appendChild(nameSpan);
        li.appendChild(countSpan);
        list.appendChild(li);
    });
}