import React, { useState, useEffect } from 'react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
//import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
//import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dark} from 'react-syntax-highlighter/dist/esm/styles/prism'
import Annotation from './modules/Annotation';
import "../src/markdown.css";

const ONE_DAY_AGO = 1;
const ONE_WEEK_AGO = 7;
const ONE_MONTH_AGO = 30;

function App() {
  //TODO API 호출할때마다 키 값 저장해야함. 안 그러면 다음 API 호출시 중복 발생
  const [markdownText, setMarkdownText] = useState({1:``,7:``,30:``});
  const getData = async (day) => {
    const commits = await getCommits(day);
    for (let commit of commits) {
      const commit_detail = await getFilename(commit.sha);
      for (let file of commit_detail.files) {
          if(file.filename.endsWith(".md")) {
            const markdown = await getMarkdown(file.filename); //TODO markdown 다 받을때까지 대기한다음 setState 할 수 있도록
            markdownText[day] = markdown;
            setMarkdownText(markdownText);
          }
      }
    }
  }
  
  const getCommits = async (day) => {
    return await fetch("https://api.github.com/repos/chucoding/today-i-learned/commits?since=2023-09-05&until=2023-09-06", {
      headers : {
        "Authorization":`Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`
      }
    }).then(res=>res.json());
  }

  const getFilename = async (commit_sha) => {
    return await fetch(`https://api.github.com/repos/chucoding/today-i-learned/commits/${commit_sha}`, {
      headers : {
        "Authorization":`Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`
      }
    }).then(res=>res.json());
  }

  const getMarkdown = async (filename) => {
    return await fetch(`https://api.github.com/repos/chucoding/today-i-learned/contents/${filename}`, {
      headers : {
        "Accept":"application/vnd.github.raw",
        "Authorization":`Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`
      }
    }).then(response =>response.text());
  }

  useEffect(()=>{
    getData(ONE_DAY_AGO);
    getData(ONE_WEEK_AGO);
    getData(ONE_MONTH_AGO);
  }, []);

  return (
    <div>
      {
        Object.entries(markdownText).forEach(([key, value]) => {
          <div key={key}>
            <Annotation text={`/* Day${key} */`} />
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: ({ node, inline, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={dark}
                      language={match[1]}
                      PreTag="div"
                      children={String(children).replace(/\n$/, '')}
                      {...props}
                    />
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
              children={value}
              className="markdown-table"
            />
          </div>
        })
      }
    </div>
  );
}

export default App;