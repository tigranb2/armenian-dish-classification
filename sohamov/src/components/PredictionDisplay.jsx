import { useState, useEffect } from 'react'

import "./PredictionDisplay.css" // style sheet

// use dish name as an identifier to determine which description to show
const DISH_DESCRIPTIONS = {
    'Բաստուրմա (basturma)': "Basturma is ...."
}


function PredictionDisplay({prediction, selectedImage}) {
    const [results, setResults] = useState();
    const [dishInfo, setDishInfo] = useState();

    function determineInfo(dish) {
        setDishInfo(DISH_DESCRIPTIONS[dish]);
    };

    useEffect(() => {
        const parsePrediction = () => {
            if (prediction == null){
                if (selectedImage) {
                    setResults(<p>Click predict</p>);
                } else {
                    setResults(null);
                }
                setDishInfo(null);
                return;
            };

            let parsed;
            if (prediction[0].probability < 0.5 || prediction[2].probability > 0.03) { 
                // uncertain prediction
                parsed = <h3><span id="uncertain-indicator">May be:</span> {prediction.map((item, index) => 
                        <li key={index} className="dish-li-item">
                            <span className="dish" onClick={() => determineID(item.className)}>{item.className}</span>
                        </li>)}
                    </h3>;
            } else {          
                parsed = [<div key={0}><h1>Likely: </h1><h2><span className="dish">{prediction[0].className}</span></h2></div>];
                
                if (prediction[1].probability > 0.05) {
                    // second prediction has reasonable probability
                    parsed.push(<div className="divider" />)
                    parsed.push(<h3 key={2}>May also be: <span className="dish">{prediction[1].className}</span></h3>)
                }
            };
            setResults(parsed);
            determineInfo(prediction[0].className);
        };
        parsePrediction();
    }, [prediction]);

    return (
        <div id="prediction-container">
            {
            results
                ? <>
                    {results}
                    <div className="divider thick" />
                    <p>{dishInfo}</p>
                </>
                : <p>Upload an image and press predict to get a prediction</p>
            }
        </div>
    );
};

export default PredictionDisplay;