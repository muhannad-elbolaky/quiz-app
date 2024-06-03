const repositoryUrl: string = "muhannad-elbolaky/quiz-app";
const branch: string = "master";

export const fetchLatestCommitHash = async (): Promise<string> => {
	try {
		const response = await fetch(
			`https://api.github.com/repos/${repositoryUrl}/commits/${branch}`,
			{
				headers: {
					"User-Agent": "Mozilla/5.0", // GitHub API requires a User-Agent header
					Accept: "application/vnd.github.v3+json", // GitHub API version
				},
			},
		);

		if (!response.ok) {
			throw new Error(
				`Failed to fetch commit hash: ${response.status} ${response.statusText}`,
			);
		}

		const commitInfo = await response.json();
		const commitHash = commitInfo.sha;
		return commitHash;
	} catch (error) {
		throw new Error(`Error fetching commit hash: ${error}`);
	}
};
