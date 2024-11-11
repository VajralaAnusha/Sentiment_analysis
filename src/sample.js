import React from 'react';
import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

function Appp() {
  return (
    <div className="App">
      <header>
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Features</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">About</a></li>
          </ul>
        </nav>
      </header>
      <main>
        <section className="hero">
          <h1>Sentiment Analysis Tool</h1>
          <p>Analyze customer feedback and sentiment in real-time</p>
          <button>Get Started</button>
        </section>
        <section className="features">
          <h2>Features</h2>
          <ul>
            <li>
              <FontAwesomeIcon icon={faCheckCircle} />
              <p>Real-time sentiment analysis</p>
            </li>
            <li>
              <FontAwesomeIcon icon={faCheckCircle} />
              <p>Customer feedback analysis</p>
            </li>
            <li>
              <FontAwesomeIcon icon={faCheckCircle} />
              <p>Competitor analysis</p>
            </li>
          </ul>
        </section>
        <section className="pricing">
          <h2>Pricing</h2>
          <ul>
            <li>
              <h3>Basic</h3>
              <p>$99/month</p>
              <p>1000 feedbacks analyzed</p>
            </li>
            <li>
              <h3>Pro</h3>
              <p>$299/month</p>
              <p>5000 feedbacks analyzed</p>
            </li>
            <li>
              <h3>Enterprise</h3>
              <p>Custom pricing</p>
              <p>Unlimited feedbacks analyzed</p>
            </li>
          </ul>
        </section>
        <section className="about">
          <h2>About Us</h2>
          <p>We're a team of experts in natural language processing and machine learning</p>
        </section>
      </main>
      <footer>
        <p>&copy; 2023 ClientZen</p>
      </footer>
    </div>
  );
}

export default Appp;