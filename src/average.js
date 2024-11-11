import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

export default function Average() {
    const [scores, setScores] = useState([]);
    const [averagePositive, setAveragePositive] = useState(0);
    const [averageNegative, setAverageNegative] = useState(0);
    const [averageNeutral, setAverageNeutral] = useState(0);

    useEffect(() => {
        axios.get('http://localhost:5001/getscores')
        .then((response) => {
            setScores(response.data.scoresData);
            calculateAverages(response.data.scoresData); 
        })
        .catch((error) => {
            console.error('Error fetching scores:', error);
        });
    }, []);

    const calculateAverages = (scores) => {
        const totalPositive = scores.reduce((acc, score) => acc + score.positiveScore, 0);
        const totalNegative = scores.reduce((acc, score) => acc + score.negativeScore, 0);
        const totalNeutral = scores.reduce((acc, score) => acc + score.neutralScore, 0);
        const count = scores.length;

        setAveragePositive(totalPositive / count);
        setAverageNegative(totalNegative / count);
        setAverageNeutral(totalNeutral / count);
    };
    
    return (
        <div>
            <h3 style={{color:'white', fontWeight:'bold', marginTop:'40px', marginBottom:'40px'}}>Community Sentiment Scores</h3>
            <table style={{color:'white', width:'1687px', border:'1px solid white'}}>
                <thead style={{border:'1px solid white'}}>
                    <tr>
                        <th style={{padding:'20px', fontFamily:'Times New Roman'}}>Sentiment Text</th>
                        <th style={{textAlign:'left', fontFamily:'Times New Roman'}}>Positive</th>
                        <th style={{textAlign:'left', fontFamily:'Times New Roman'}}>Neutral</th>
                        <th style={{textAlign:'left', fontFamily:'Times New Roman'}}>Negative</th>
                    </tr>
                </thead>
                <tbody style={{padding:'15px'}}>
                    {scores.map((score, index) => (
                        <tr key={index}>
                            <td style={{padding:'15px', textAlign:'left'}}>{score.content}</td>
                            <td style={{padding:'15px'}}>
                            <div style={{ width: '60px', height: '70px' }}><CircularProgressbar
                                value={score.positiveScore}
                                text={`${(score.positiveScore).toFixed(2)}%`}
                                styles={buildStyles({
                                    trailColor: '#f3f3f3',
                                    pathColor: '#00ff00',
                                })}
                            /></div>
                            </td>
                            <td style={{padding:'15px'}}>
                            <div style={{ width: '60px', height: '70px' }}><CircularProgressbar
                                value={score.neutralScore}
                                text={`${(score.neutralScore).toFixed(2)}%`}
                                styles={buildStyles({
                                    trailColor: '#f3f3f3',
                                    pathColor: 'yellow',
                                })}
                            /></div></td>
                            <td style={{padding:'15px'}}>
                            <div style={{ width: '60px', height: '70px' }}><CircularProgressbar
                                value={score.negativeScore}
                                text={`${(score.negativeScore).toFixed(2)}%`}
                                styles={buildStyles({
                                    trailColor: '#f3f3f3',
                                    pathColor: 'red',
                                })}
                            /></div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}