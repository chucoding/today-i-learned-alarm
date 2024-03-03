import React, { useEffect, useState, useRef } from 'react';
import Slider from "react-slick";
import { useIndexedDB } from "react-indexed-db-hook";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import MarkdownBlock from '../templates/MarkdownBlock';

const FlashCardViewer = () => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState(false);

    let sliderRef = useRef(null);
    const next = () => {
        setFlipped(false);
        sliderRef.slickNext();
    };
    const previous = () => {
        setFlipped(false);
        sliderRef.slickPrev();
    };

    const flipCard = () => {
        setFlipped(!flipped);
    };

    const { getAll } = useIndexedDB("data");
    
    useEffect(() => {
        getAll().then((dataFromDB) => {
            setCards(dataFromDB[0].data);
        });
    }, []);
    
    if (cards.length === 0) return <div style={{display:"flex", height:"100vh", alignItems:"center", justifyContent:"center", background:"lightgray", fontSize:"larger"}}>질문을 생성하고 있습니다.<br/>잠시만 기다려주세요.</div>
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
                    infinite={false}
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

export default FlashCardViewer;