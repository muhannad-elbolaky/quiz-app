const repositoryUrl = "muhannad-elbolaky/quiz-app";
const branch = "master";

export async function fetchLatestCommitHash(): Promise<string> {
    const response = await fetch(
        `https://api.github.com/repos/${repositoryUrl}/commits/${branch}`,
        {
            headers: {
                "User-Agent": "Mozilla/5.0",
                Accept: "application/vnd.github.v3+json",
            },
        }
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch commit hash: ${response.status} ${response.statusText}`
        );
    }

    const {sha} = await response.json();
    return sha;
}
