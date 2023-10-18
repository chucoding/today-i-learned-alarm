export default function Annotation({text}) {
    console.log(text);
    return (
        <i style={{color:'lightgray'}}>{text}</i>
    );
};