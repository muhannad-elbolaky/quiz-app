import { fetchLatestCommitHash } from "./utils/fetchLatestCommitHash";

fetchLatestCommitHash().then((newHash) => {
	const currentHash = localStorage.getItem("commit-hash");

	if (newHash === currentHash) return;
	localStorage.setItem("commit-hash", newHash);
	localStorage.removeItem("currentScore");
	localStorage.removeItem("mostRecentScore");
});
