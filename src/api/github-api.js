export async function getCommits(date) {
    return await fetch(`https://api.github.com/repos/chucoding/today-i-learned/commits?since=${date}&until=${date}`, {
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
    }).then(response =>response.text());
}