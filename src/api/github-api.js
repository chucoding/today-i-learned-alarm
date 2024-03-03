export async function getCommits(since, until) {
    return await fetch(`https://api.github.com/repos/chucoding/today-i-learned/commits?since=${since}&until=${until}`, {
      headers : {
        "Authorization":`Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`
      }
    }).then(res=>res.json());
}

export async function getFilename(commit_sha) {
    return await fetch(`https://api.github.com/repos/chucoding/today-i-learned/commits/${commit_sha}`, {
        headers : {
            "Authorization":`Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`
        }
    }).then(res=>res.json());
}

export async function getMarkdown(filename) {
    return await fetch(`https://api.github.com/repos/chucoding/today-i-learned/contents/${filename}`, {
        headers : {
            "Accept":"application/vnd.github.raw",
            "Authorization":`Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`
        }
    }).then(response => response.ok ? response.text() : '');
}