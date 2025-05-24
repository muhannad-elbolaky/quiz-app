import questions from "../questions.json";

const stats = document.querySelector("#stats") as HTMLDivElement;

// Raw retrieval (could be null if never taken)
const rawCurrent     = localStorage.getItem("currentScore");
const rawMostRecent  = localStorage.getItem("mostRecentScore");

// Parse or keep null
const currentScore    = rawCurrent     !== null ? Number(rawCurrent)    : null;
const mostRecentScore = rawMostRecent  !== null ? Number(rawMostRecent) : null;

// Update “previous” for next time if we have a current score
if (currentScore !== null) {
    localStorage.setItem("mostRecentScore", String(currentScore));
}

const MAX_QUESTIONS = Math.min(questions.length, 25);

// Compute percentage only if they’ve taken it
const percentageNumber =
    currentScore !== null
        ? Math.round((currentScore / MAX_QUESTIONS) * 100)
        : null;

function renderRating(pct: number | null): string {
    if (pct === null) return "";
    if (pct >= 50 && pct <= 100) {
        const extra = Math.min(Math.floor((pct - 50) / 10), 4);
        return "⭐".repeat(1 + extra);
    } else if (pct >= 0) {
        const count = Math.ceil((50 - pct) / 10);
        return "🍪".repeat(count);
    }
    return "";
}

const rating = renderRating(percentageNumber);

// Helpers for display
const showNum = (v: number | null) => (v === null ? "–" : String(v));
const showPct = (v: number | null) => (v === null ? "–" : `${v}%`);

const titleText = percentageNumber === null
    ? "بسم الله الرحمن الرحيم"
    : rating;

stats.innerHTML = `
  <h1 class="text-center">${titleText}</h1>

  <div class="results">
    <p>نتيجتك:</p>
    <span style="color: yellow">${showNum(currentScore)}</span>
  </div>
  <div class="results">
    <p>النتيجة السابقة:</p>
    <span style="color: yellow">${showNum(mostRecentScore)}</span>
  </div>
  <div class="results">
    <p style="margin-bottom: 4.2rem">النسبة:</p>
    <span style="color: yellow">${showPct(percentageNumber)}</span>
  </div>
`;
