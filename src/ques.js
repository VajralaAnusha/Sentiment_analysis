import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Questionnaire = () => {
  const [questions] = useState([
    "Question 1: What is your favorite color?",
    "Question 2: What is your favorite animal?",
    "Question 3: What is your favorite food?",
    "Question 4: What is your favorite hobby?"
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [submittedAnswers, setSubmittedAnswers] = useState([]);
  const [sentimentAnalysis, setSentimentAnalysis] = useState([]);

  const handleAnswerChange = (event) => {
    const { value } = event.target;
    setAnswers(prevAnswers => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[currentQuestionIndex] = value;
      return updatedAnswers;
    });
  };

  const handleSubmit = () => {
    const formData = {
      question: questions[currentQuestionIndex],
      answer: answers[currentQuestionIndex]
    };
    
    setSubmittedAnswers(prevAnswers => [...prevAnswers, formData]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  useEffect(() => {
    if (submittedAnswers.length === questions.length) {
      analyzeSentimentForSubmittedAnswers();
    }
  }, [submittedAnswers]);

  const analyzeSentimentForSubmittedAnswers = async () => {
    try {
      const analyzedAnswers = [];
      for (const answer of submittedAnswers) {
        const response = await axios.post(
          'https://eastus.api.cognitive.microsoft.com/text/analytics/v3.0/sentiment',
          {
            documents: [
              {
                id: '1',
                text: answer.answer,
              },
            ],
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key': '9f54ecd90376405587302221386854f8',
            },
          }
        );
        const sentimentResponse = response.data.documents[0];
        analyzedAnswers.push({
          question: answer.question,
          sentiment: sentimentResponse.sentiment,
          positiveScore: sentimentResponse.confidenceScores.positive * 100,
          negativeScore: sentimentResponse.confidenceScores.negative * 100,
          neutralScore: sentimentResponse.confidenceScores.neutral * 100,
        });
      }
      console.log("Sentiment Analysis Results:", analyzedAnswers);
      setSentimentAnalysis(analyzedAnswers);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    }
  };

  return (
    <div className="questionnaire">
      {currentQuestionIndex < questions.length ? (
        <>
          <h2>{questions[currentQuestionIndex]}</h2>
          <textarea
            rows="4"
            cols="50"
            value={answers[currentQuestionIndex]}
            onChange={handleAnswerChange}
          />
          <button onClick={handleSubmit}>Submit</button>
        </>
      ) : (
        <div>
          <h3>Submitted Answers:</h3>
          <ul>
            {submittedAnswers.map((answer, index) => (
              <li key={index}>
                <strong>{answer.question}</strong>: {answer.answer}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Questionnaire;
