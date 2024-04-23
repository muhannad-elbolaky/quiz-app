import questions from '../questions.json';

const stats = document.querySelector('#stats') as HTMLHeadingElement;
const image = document.querySelector('img') as HTMLImageElement;
const mostRecentScore = localStorage.getItem('mostRecentScore') ?? 0;
const currentScore = localStorage.getItem('currentScore') ?? 0;

localStorage.setItem('mostRecentScore', currentScore.toString());

const currentScoreNumber = Number(currentScore);
const isPassed = currentScoreNumber >= Math.round(questions.length / 2);
const percentage = `${Math.round(
  (currentScoreNumber / questions.length) * 100
)}%`;

image.setAttribute(
  'src',
  currentScoreNumber / questions.length >= 0.98
    ? 'https://cdn.discordapp.com/attachments/1122243494312939560/1232247471959183410/majoramari_2024-04-23_EPYu.png?ex=6628c363&is=662771e3&hm=62b5afa6b537fc662e1e75441b47212f765b8df43781a733216c163b0b29785d&'
    : currentScoreNumber / questions.length >= 0.5
    ? 'https://cdn.discordapp.com/attachments/1122243494312939560/1232247152252813322/DJIOSAJDIOAJD.jpg?ex=6628c317&is=66277197&hm=956a64b41128739c3c357a93930690cff11a24b3d400d90c599e60c4941fd874&'
    : 'https://cdn.discordapp.com/attachments/1122243494312939560/1232246408556314695/EYVhGNJX0AIPOUw.jpg?ex=6628c265&is=662770e5&hm=81dc11c3faba79cd19139bd46535d36043a5f86f231e1ec012681fcd8ab71d9c&'
);

stats.innerHTML = `\
  ${
    isPassed
      ? '<h1 class="text-center" style="color: #199827; margin-bottom: 3rem;">نجحت</h1>'
      : '<h1 class="text-center" style="color: #c70000; margin-bottom: 3rem;">رسبت</h1>'
  }
  <p>نتيجتك: <span style="color: yellow;">${currentScore}</span></p>
  <p>النتيجة السابقة: <span style="color: yellow;">${mostRecentScore}</span></p>
  <p style="margin-bottom: 4.2rem;">النسبة: <span style="color: yellow;">${percentage}</span></p>
`;
