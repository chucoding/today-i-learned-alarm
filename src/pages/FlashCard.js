import React, { useEffect, useState, useRef } from 'react';
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { getGithubData } from '../services/github-service';
import MarkdownBlock from '../templates/MarkdownBlock';

const FlashCard = () => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState(false);
    const daysAgoList = [1,7,30];

    let sliderRef = useRef(null);
    const next = () => {
        sliderRef.slickNext();
    };
    const previous = () => {
        sliderRef.slickPrev();
    };

    const flipCard = () => {
        setFlipped(!flipped);
    };

    useEffect(()=>{
        (async () => {
            let promises = daysAgoList.map(async daysAgo => {
                const data = await getGithubData(daysAgo);
                //TODO 질문 개수 별로 데이터 만들기
                return { question: 'test', answer: data };
            });
        
            let list = await Promise.all(promises);
            setCards(list);
        })();

        // TODO 덱 셔플
    }, []);
    
    if (cards.length == 0) return null;
    return (
        <div className='card-player'>
            <div>
                <Slider
                    ref={slider => {
                        sliderRef = slider;
                    }}
                    dots={true}
                    arrows={false}
                    swipe={false}
                    appendDots={dots => (
                        <div style={{ top:'10px'}}>
                            <ul style={{ padding:'0px' }}>{dots}</ul>
                        </div>
                    )}
                >
                    {cards.map((card, i) =>
                        <div key={i} className={`flashcard ${flipped ? 'flipped' : ''}`}>
                            {flipped ? <MarkdownBlock markdown={card.answer} /> : <p>{card.question}</p> } 
                        </div>
                    )}                       
                </Slider>
            </div>
            <div className='button-wrapper'>
                <button className='button-circle' onClick={previous}>
                ⬅️
                </button>
                <button className='button-oval' onClick={flipCard}>🔃</button>
                <button className='button-circle' onClick={next}>
                ➡️
                </button>
            </div>
        </div>
    );
}

export default FlashCard;