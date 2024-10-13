export default async function isGitHubRepoAvailable(
  url: string,
): Promise<boolean> {
  const githubRepoPattern =
    /^https:\/\/github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)(\/)?$/;
  const match = url.match(githubRepoPattern);

  if (!match) {
    return false;
  }

  const user = match[1];
  const repo = match[2];

  const apiUrl = `https://api.github.com/repos/${user}/${repo}`;

  const response = await fetch(apiUrl);
  return response.status === 200;
}
