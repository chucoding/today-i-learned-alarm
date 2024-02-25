import React, { useEffect, useState, useRef, Fragment } from 'react';
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const FlashCard = () => {
    const [questions, setQuestions] = useState([]);

    let sliderRef = useRef(null);
    const next = () => {
        sliderRef.slickNext();
    };
    const previous = () => {
        sliderRef.slickPrev();
    };

    useEffect(()=>{
        setQuestions(["Q. 안녕하세요", "2", "3"]);
    }, []);

    return (
        <div className='card-player'>
            <Slider
                ref={slider => {
                    sliderRef = slider;
                }}
                dots={true}
                arrows={false}
                appendDots={dots => (
                    <div style={{ top:'10px'}}>
                        <ul style={{ padding:'0px' }}>{dots}</ul>
                    </div>
                )}
            >
                {questions.map((question, i) => 
                    <Fragment key={i}>
                        <div className='flashcard'>
                            <p>{question}</p>
                        </div>
                    </Fragment>
                )}                       
            </Slider>
            <div className='button-wrapper'>
                <button className='button-circle' onClick={previous}>
                ⬅️
                </button>
                <button className='button-oval'>🔃</button>
                <button className='button-circle' onClick={next}>
                ➡️
                </button>
            </div>
        </div>
    );
}

export default FlashCard;