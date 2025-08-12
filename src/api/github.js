import axios from 'axios';

export async function fetchRepoContents(owner, repo, token) {
  const headers = token ? { Authorization: `token ${token}` } : {};
  const repoRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  const defaultBranch = repoRes.data.default_branch;

  const treeRes = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
    { headers }
  );
  const tree = (treeRes.data && treeRes.data.tree) || [];
  const files = tree.filter(
    (f) => f.type === 'blob' && /\.(js|jsx|ts|tsx|py|java|go|rs|c|cpp|md|json)$/.test(f.path)
  );

  const MAX = 200;
  const selected = files.slice(0, MAX);
  const contents = await Promise.all(
    selected.map(async (f) => {
      try {
        const raw = await axios.get(
          `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${f.path}`,
          {
            headers,
            responseType: 'text',
            transformResponse: [d => d]
          }
        );
        return { path: f.path, content: raw.data };
      } catch {
        return { path: f.path, content: '' };
      }
    })
  );
  return { files: contents, defaultBranch };
}

export function parseOwnerRepo(url) {
  const u = new URL(url);
  const parts = u.pathname.split('/').filter(Boolean);
  if (parts.length < 2) throw new Error('Invalid GitHub URL');
  return { owner: parts[0], repo: parts[1] };
}