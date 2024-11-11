import AzureSentimentAnalysis from './SentimentAnalysis';
import Average from './average';
import { BrowserRouter, Routes, Route, Router } from 'react-router-dom';
import Questionnaire from './ques';
import Appp from './sample';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AzureSentimentAnalysis/>}></Route>
          <Route path='/scores' element={<Average/>}></Route>
          <Route path='/ques' element={<Questionnaire/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
