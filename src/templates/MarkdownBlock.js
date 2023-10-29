import React, { useState, useEffect } from 'react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {dark} from 'react-syntax-highlighter/dist/esm/styles/prism';

import "../markdown.css";
import { getCommits, getFilename, getMarkdown } from '../api/github-api';
import Sally from "../resource/sally.gif";
const NO_DATA = "-1";

export default function MarkdownBlock({target}) {

    const [markdown, setMarkdown] = useState("");

    async function getGithubData() {
        const interval =  24 * target * 60 * 60 * 1000;
        const currentDate = new Date();
        const pastDate = new Date(currentDate.getTime() - interval);

        const since = new Date(pastDate);
        since.setHours(0, 0, 0, 0);

        const until = new Date(pastDate);
        until.setHours(23, 59, 59, 999);

        const commits = await getCommits(since, until);

        if (commits.length === 0) {
            setMarkdown(NO_DATA);
            return;
        }

        for (let commit of commits) {
            const commit_detail = await getFilename(commit.sha);
            let cache = {}; 
            for (let file of commit_detail.files) {
                if(file.filename.endsWith(".md")) {
                    if (cache && Object.keys(cache).includes(file.filename)) {
                        setMarkdown(cache[file.filename]);
                    } else {
                        const data = await getMarkdown(file.filename);
                        cache[file.filename] = data;
                        setMarkdown(data);
                    }
                }
            }
        }
    }

    useEffect(()=>{
        getGithubData();
    }, []);

    if (!markdown) return "로딩중...";
    else if (markdown === NO_DATA) return <img src={Sally} />
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                code({children, className, node, ...rest}) {
                    const match = /language-(\w+)/.exec(className || '') || [""];
                    return (
                        <SyntaxHighlighter
                            {...rest}
                            children={String(children).replace(/\n$/, '')}
                            style={dark}
                            language={match[1]}
                            PreTag="div"
                        />
                    )
                }
            }}
            className="markdown-table"
        >
        {markdown}
        </ReactMarkdown>
    );
}