import React from 'react';

import Annotation from '../modules/Annotation';
import MarkdownBlock from '../templates/MarkdownBlock';

/**
 * 2024-03-03 Deprecated
 * 날짜별 출력 방식에서 flip 카드 방식으로 변경
 * 
 * @returns 
 */
const DocViewer = () => {
    return (
        <>
            <Annotation text={`/* Day 1 */`} />
            <MarkdownBlock target={1} />
            <Annotation text={`/* Day 7 */`} />
            <MarkdownBlock target={7} />
            <Annotation text={`/* Day 30 */`} />
            <MarkdownBlock target={30} />
        </>
    );
}

export default DocViewer;