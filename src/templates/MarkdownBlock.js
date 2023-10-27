import React, { useState, useEffect } from 'react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
//import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
//import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dark} from 'react-syntax-highlighter/dist/esm/styles/prism'

import "../../src/markdown.css";
import { getCommits, getFilename, getMarkdown } from '../api/github-api';

export default function MarkdownBlock({target}) {

    const [markdown, setMarkdown] = useState();

    //TODO API 호출할때마다 저장해야함. 안 그러면 다음 API 호출시 중복 발생
    async function getGithubData() {

        const interval =  24 * target * 60 * 60 * 1000;
        const currentDate = new Date();
        const pastDate = new Date(currentDate.getTime() - interval);
        const formattedPastDate = pastDate.toISOString().slice(0, 10);

        const commits = await getCommits(formattedPastDate);
        console.log(commits);
        for (let commit of commits) {
            const commit_detail = await getFilename(commit.sha);
            for (let file of commit_detail.files) {
                if(file.filename.endsWith(".md")) {
                    const markdown = await getMarkdown(file.filename);
                    setMarkdown(markdown);
                }
            }
        }
    }

    useEffect(()=>{
        getGithubData();
    }, []);

    return (
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
            children={markdown}
            className="markdown-table"
        />
    );
}