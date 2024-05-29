import questions from "../questions.json";

const stats = document.querySelector("#stats") as HTMLHeadingElement;
const mostRecentScore = localStorage.getItem("mostRecentScore") ?? 0;
const currentScore = localStorage.getItem("currentScore") ?? 0;

localStorage.setItem("mostRecentScore", currentScore.toString());

const currentScoreNumber = Number(currentScore);
const isPassed = currentScoreNumber >= Math.round(questions.length / 2);
const percentage = `${Math.round(
	(currentScoreNumber / questions.length) * 100,
)}%`;

stats.innerHTML = `\
  ${
			isPassed
				? '<h1 class="text-center" style="color: #199827; margin-bottom: 3rem;">نجحت</h1>'
				: mostRecentScore === "0"
				? '<h1 dir="auto">🩶🩷🩵</h1>'
				: '<h1 class="text-center" style="color: #c70000; margin-bottom: 3rem;">رسبت</h1>'
		}
  <p>نتيجتك: <span style="color: yellow;">${currentScore}</span></p>
  <p>النتيجة السابقة: <span style="color: yellow;">${mostRecentScore}</span></p>
  <p style="margin-bottom: 4.2rem;">النسبة: <span style="color: yellow;">${percentage}</span></p>
`;
