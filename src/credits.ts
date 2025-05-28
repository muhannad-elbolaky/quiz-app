import questions from '../questions.json';

interface Question {
    contributor?: string;
}

const contributorCounts: { [key: string]: number } = {};

questions.forEach((question: Question) => {
    const contributor = question.contributor;
    if (contributor) {
        contributorCounts[contributor] = (contributorCounts[contributor] || 0) + 1;
    }
});

const sortedContributors = Object.entries(contributorCounts).sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
);

const list = document.getElementById('contributor-list');
if (list) {
    sortedContributors.forEach(([contributor, count]) => {
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