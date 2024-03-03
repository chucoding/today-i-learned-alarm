import React from 'react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {dark} from 'react-syntax-highlighter/dist/esm/styles/prism';

import "../markdown.css";
import Sally from "../resource/sally.gif";

export default function MarkdownBlock({markdown}) {
    if (markdown === "") return <div style={{margin:"auto"}}><img src={Sally} /></div>
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