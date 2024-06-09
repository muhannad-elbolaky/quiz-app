import questions from "../questions.json";

const stats = document.querySelector("#stats") as HTMLHeadingElement;
const mostRecentScore = localStorage.getItem("mostRecentScore") ?? "0";
const currentScore = localStorage.getItem("currentScore") ?? "0";

localStorage.setItem("mostRecentScore", currentScore.toString());

const MAX_QUESTIONS = questions.length > 25 ? 25 : questions.length;

const currentScoreNumber = Number(currentScore);
const percentageNumber = Math.round((currentScoreNumber / MAX_QUESTIONS) * 100);
const percentage = `${percentageNumber}%`;

function renderRating(percentage: number): string {
	let rating = "";

	if (percentage >= 50 && percentage <= 100) {
		// At 50%, show one star
		rating = "⭐";
		// For percentages above 50%, calculate the number of additional stars
		const additionalStars = Math.floor((percentage - 50) / 10);
		// Ensure it doesn't exceed 5 stars
		const starsToShow = Math.min(additionalStars, 4);
		rating += "⭐".repeat(starsToShow);
	} else if (percentage >= 0 && percentage < 50) {
		// Calculate the number of bagels based on the percentage
		const bagels = Math.ceil((50 - percentage) / 10);
		rating = "🍪".repeat(bagels);
	} else {
		rating = "Invalid percentage";
	}

	return rating;
}

const rating = renderRating(percentageNumber);

stats.innerHTML = `\
  ${
			currentScoreNumber == 0
				? `<h2 class="text-center">25 سؤال لكل اختبار!</h2>`
				: `<h2 class="text-center">${rating}</h2>`
		}
  <div class="results">
    <p>نتيجتك:</p>
    <span style="color: yellow">${currentScore}</span>
  </div>
  <div class="results">
    <p>النتيجة السابقة:</p>
    <span style="color: yellow">${mostRecentScore}</span>
  </div>
  <div class="results">
    <p style="margin-bottom: 4.2rem">النسبة:</p>
    <span style="color: yellow">${percentage}</span>
  </div>
`;
