import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';  
import Loader from './loader';
import Footer from './footer';
import Senti from './senti.jpeg';

const AzureSentimentAnalysis = () => {

    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [listening, setListening] = useState(false);
    const [sentiment, setSentiment] = useState(null);
    const [positiveScore, setPositiveScore] = useState(null);
    const [negativeScore, setNegativeScore] = useState(null);
    const [neutralScore, setNeutralScore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [backendResponse, setBackendResponse] = useState();
    let recognition = null;
    const fileInputRef = useRef(null);
    const [scores, setScores] = useState([]);
    const [averagePositive, setAveragePositive] = useState(0);
    const [averageNegative, setAverageNegative] = useState(0);
    const [averageNeutral, setAverageNeutral] = useState(0);


    const analyzeSentiment = async () => {
        setLoading(true);
        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const fileContent = event.target.result;
                    const response = await axios.post(
                        'https://swaroopraj-777.cognitiveservices.azure.com/text/analytics/v3.0/sentiment',
                        {
                            documents: [
                                {
                                    id: '1',
                                    text: fileContent,
                                },
                            ],
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Ocp-Apim-Subscription-Key': '39605efebfac4b18b5e788db59ebe148',
                            },
                        }
                    );
                    handleSentimentResponse(response.data.documents[0]);
                } catch (error) {
                    console.error('Error analyzing sentiment:', error);
                } finally {
                    setLoading(false);
                }
            };
            reader.readAsText(file);
        } else if (text.trim() !== '') {
            try {
                const response = await axios.post(
                    'https://swaroopraj-777.cognitiveservices.azure.com/text/analytics/v3.0/sentiment',
                    {
                        documents: [
                            {
                                id: '1',
                                text: text,
                            },
                        ],
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Ocp-Apim-Subscription-Key': '39605efebfac4b18b5e788db59ebe148',
                        },
                    }
                );
                handleSentimentResponse(response.data.documents[0]);
            } catch (error) {
                console.error('Error analyzing sentiment:', error);
            } finally {
                setLoading(false);
            }
        } else {
            console.error('No text or file uploaded.');
        }
    };
    

    const handleFileChange = (event) => {
        const uploadedFile = event.target.files[0];
        setFile(uploadedFile);
    };

    const handleRemoveFile = () => {
        setFile(null);
        fileInputRef.current.value = null;
    };

    const handleSentimentResponse = async (document) => {
        setSentiment(document.sentiment);
        const confidenceScores = document.confidenceScores;
        setPositiveScore(confidenceScores.positive);
        setNegativeScore(confidenceScores.negative);
        setNeutralScore(confidenceScores.neutral);
        try {
            const backendResponse = await axios.post(
                'http://localhost:5001/analyze-sentiment',
                {
                    content: text,
                    positiveScore: confidenceScores.positive*100,
                    negativeScore: confidenceScores.negative*100,
                    neutralScore: confidenceScores.neutral*100,
                }
            );
            setBackendResponse(backendResponse.data);
        } catch (error) {
            console.error('Error sending sentiment analysis data to backend:', error);
        }
    };

    const getSentimentEmoji = (sentiment) => {
        if (sentiment === 'Positive') {
            return '😊';
        } else if (sentiment === 'Neutral') {
            return '😐';
        } else if (sentiment === 'Negative') {
            return '😞';
        } else {
            return '';
        }
    };

    const handleVoiceInput = () => {
        recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setText(transcript);
        };
        recognition.start();
        setListening(true);
    };

    const clearText = () => {
        setText('');
    };

    return (
        
        <div>
            <nav class="navbar navbar-expand-lg navbar-light bg-dark">
  <div class="container-fluid">
    <a class="navbar-brand p-4" style={{color:'white', fontWeight:'bold',fontFamily:'bold'}}>SENTI_METER</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a  href="#contact" class="nav-link active" style={{marginRight:'40px',color:'white', fontWeight:'bold',fontFamily:'bold'}} aria-current="page">Contact</a>
        </li>
        <li class="nav-item">
          <a href="#analyse" class="btn btn-primary" role="button">Analyze Now</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
            <div className='row mt-5'>
                <div className='col-md-6'>
                <img src={Senti} className='img-fluid p-4' style={{borderRadius:'80px'}} alt='Background Image' />
                </div>
                <div className='col-md-6' style={{marginTop:'0px', padding:'40px'}}>
                    <h1 style={{color:'white', fontWeight:'bold',fontFamily:'bold'}}>What is Sentiment Analysis</h1><br></br>
                    <p style={{color:'white',fontFamily:'bold'}}>Sentiment Analysis is the process of determining whether a piece of writing is positive, negative or neutral. A sentiment analysis system for text analysis combines natural language processing (NLP) and machine learning techniques to assign weighted sentiment scores to the entities, topics, themes and categories within a sentence or phrase.
                    Sentiment analysis helps data analysts within large enterprises gauge public opinion, conduct nuanced market research, monitor brand and product reputation, and understand customer experiences. In addition, data analytics companies often integrate third-party sentiment analysis APIs into their own customer experience management, social media monitoring, or workforce analytics platform, in order to deliver useful insights to their own customers.</p>
                </div>
            </div>
            <div id='analyse' className='row mt-5'>
                <div className='col-md-12 hentai'>
                    <div className='col-md-12'>
                        <h2 style={{color:'white', fontWeight:'bold',fontFamily:'bold'}}>ANALYZE RIGHT NOW</h2>
                        <textarea
                            className='mt-5'
                            rows="4"
                            cols="50"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="  Enter text for sentiment analysis..."
                        ></textarea>
                    </div>
                    <input className='rajini mt-4' type="file" onChange={handleFileChange} ref={fileInputRef} />
                    {file && (
                        <span className='btn' onClick={handleRemoveFile}>Remove File</span>
                    )}
                    <div className='row mt-5'>
                        <div className='col-md-3'></div>
                        <div className='col-md-2'>
                            <span style={{color:'white', fontWeight:'bold',fontFamily:'bold'}} className="btn" onClick={handleVoiceInput}>Start Voice Input</span>
                        </div>
                        <div className='col-md-2'>
                            <span style={{color:'white', fontWeight:'bold',fontFamily:'bold'}} className='btn' onClick={analyzeSentiment}>Analyze Sentiment</span>
                        </div>
                        <div className='col-md-2'>
                            <span style={{color:'white', fontWeight:'bold',fontFamily:'bold'}} className='btn' onClick={clearText}>Clear Text</span>
                        </div>
                        <div className='col-md-3'></div>
                    </div>
                </div><br></br><br></br>
                <center><div style={{marginBottom:'100px', marginTop:'50px'}}>{loading && <Loader />}</div></center>
                {sentiment && (
                    <div className='chill'>
                        <h3>Sentiment: {sentiment} {getSentimentEmoji(sentiment)}</h3><br/>
                        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                            <div style={{ width: '100px' }}>
                            <CircularProgressbar
                                value={positiveScore * 100}
                                text={`${(positiveScore * 100).toFixed(2)}%`}
                                styles={buildStyles({
                                    trailColor: '#f3f3f3',
                                    pathColor: '#00ff00',
                                })}
                            />
                            <p style={{marginTop:'30px'}}>Positive Score</p>
                            </div>
                            <div style={{ width: '100px' }}>
                            <CircularProgressbar
                                value={neutralScore * 100}
                                text={`${(neutralScore * 100).toFixed(2)}%`}
                                styles={buildStyles({
                                    trailColor: '#f3f3f3',
                                    pathColor: 'yellow',
                                })}
                            />
                            <p style={{marginTop:'30px'}}>Neutral Score</p>
                            </div>
                            <div style={{ width: '100px' }}>
                            <CircularProgressbar
                                value={negativeScore * 100}
                                text={`${(negativeScore * 100).toFixed(2)}%`}
                                styles={buildStyles({
                                    trailColor: '#f3f3f3',
                                    pathColor: '#ff0000',
                                })}
                            />
                            <p style={{marginTop:'30px'}}>Negative Score</p>
                            </div>
                        </div>
                    </div>
                )}
        </div>
        <h2 style={{color:'white', fontWeight:'bold',fontFamily:'bold', marginBottom:'40px'}}>How can sentiment analysis help you</h2>
        <div class="card-group">
  <div class="card">
    <div class="card-body">
      <h5 class="card-title"><i class="fa-regular fa-face-smile mb-4 mt-3" style={{fontSize:'30px',color:'green'}}></i></h5>
      <p class="card-text mb-3" style={{color:'black'}}>Learn the topics your clients are most happy or unhappy about.</p>
    </div>
  </div>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title"><i class="fa-solid fa-check mb-4 mt-3" style={{color: 'green',fontSize:'30px'}}></i></h5>
      <p style={{color:'black'}} class="card-text">Identify pain-points and detect patterns in client needs and behavior.</p>
    </div>
  </div>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title"><i class="fa-solid fa-user-minus mb-4 mt-3" style={{color: 'green',fontSize:"30px"}}></i></h5>
      <p style={{color:'black'}} class="card-text">Quickly detect negative feedback and take action instantly.</p>
    </div>
  </div>
</div>
<h2 style={{color:'white', fontWeight:'bold',fontFamily:'bold', marginBottom:'40px', marginTop:'30px'}}>How does it work</h2>
        <div class="card-group">
  <div class="card">
    <div class="card-body">
      <h5 class="card-title"><i class="fa-solid fa-gear mb-4 mt-3" style={{color: 'green',fontSize:"30px"}}></i></h5>
      <p style={{color:'black'}} class="card-text">Plug in or send us your sample data and we will take care of the rest. <br></br>Our AI algorithm generates the insights in a matter of minutes.</p>
    </div>
  </div>
</div>
<h2 style={{color:'white', fontWeight:'bold',fontFamily:'bold', marginBottom:'40px', marginTop:'30px'}}>Contact US</h2>
<div id='contact'><Footer/></div>
     </div>
    );
};

export default AzureSentimentAnalysis;