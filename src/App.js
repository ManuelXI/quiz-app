import { useState, useEffect } from "react";
import { nanoid } from "nanoid";

import Question from "./components/Question";
import data from "./data";

import questionWhite from "./images/questionWhite.png";
import questionBlue from "./images/questionBlue.png";

function App() {
  const [startGame, setStartGame] = useState(false);
  const [quizData, setQuizData] = useState();
  const [checkedAnswers, setCheckedAnswers] = useState(false);
  const [score, setScore] = useState(0);
  const [startNewGame, setStartNewGame] = useState(false);

  useEffect(() => {
    async function getQuestions() {
      const res = await fetch(
        "https://opentdb.com/api.php?amount=5&category=31&difficulty=easy&type=multiple"
      );
      const data = await res.json();
      setQuizData(trimValues(data.results));
    }
    getQuestions();
  }, [startNewGame]);

  function trimValues(arr) {
    const newArr = [];
    arr.forEach((element) => {
      newArr.push({
        id: nanoid(),
        question: cleanString(element.question),
        correct_answer: cleanString(element.correct_answer),
        answers: shuffle([
          {
            value: cleanString(element.correct_answer),
            isSelected: false,
            isCorrect: true,
            reveal: false,
          },
          ...element.incorrect_answers.map((item) => ({
            value: cleanString(item),
            isSelected: false,
            isCorrect: false,
            reveal: false,
          })),
        ]),
      });
    });
    return newArr;
  }

  function flipStartGame() {
    setStartGame((prevState) => !prevState);
  }

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  function handleClick(question, answer) {
    const prevData = [...quizData];
    const updatedArray = [];
    for (let i = 0; i < prevData.length; i++) {
      if (prevData[i].question === question) {
        for (let j = 0; j < prevData[i].answers.length; j++) {
          if (prevData[i].answers[j].value === answer) {
            prevData[i].answers[j].isSelected =
              !prevData[i].answers[j].isSelected;
          } else {
            prevData[i].answers[j].isSelected = false;
          }
        }
        updatedArray.push(prevData[i]);
      } else {
        updatedArray.push(prevData[i]);
      }
    }
    setQuizData(updatedArray);
  }

  function cleanString(val) {
    let newStr = val.replace(/&quot;/g, "'");
    newStr = newStr.replace(/&#/g, " #");
    newStr = newStr.replace(/;s/g, "");
    newStr = newStr.replace(/&amp;/g, "");
    return newStr;
  }

  function scoreQuiz() {
    setQuizData((prevData) => {
      const updatedArray = [];
      for (let i = 0; i < prevData.length; i++) {
        for (let j = 0; j < prevData[i].answers.length; j++) {
          prevData[i].answers[j].reveal = true;
          if (
            prevData[i].answers[j].isSelected &&
            prevData[i].answers[j].value === prevData[i].correct_answer
          ) {
            setScore((prevScore) => prevScore + 1);
          }
        }
        updatedArray.push(prevData[i]);
      }
      return updatedArray;
    });
    setCheckedAnswers(true);
  }

  function restartGame() {
    setQuizData(null);
    setCheckedAnswers(false);
    setStartNewGame((prevValue) => !prevValue);
    setScore(0);
  }

  let quizElements = null;
  if (quizData) {
    quizElements = quizData.map((item) => (
      <Question
        key={item.id}
        question={item.question}
        correct_answer={item.correct_answer}
        answers={item.answers}
        handleClick={handleClick}
      />
    ));
  }

  return (
    <main>
      <img
        id={startGame ? "ques-white" : ""}
        className="question-white"
        src={questionWhite}
        alt="question mark"
      />
      <img
        id={startGame ? "ques-blue" : ""}
        className="question-blue"
        src={questionBlue}
        alt="question mark"
      />
      {!startGame && (
        <div className="start-screen">
          <h2>Quizzical</h2>
          <p>Answer all questions</p>
          <button onClick={flipStartGame}>Start Quiz</button>
        </div>
      )}
      {startGame && (
        <div className="quiz-screen">
          {quizElements}

          <div className="bottom-tab">
            {checkedAnswers && (
              <p>
                You scored {score}/{quizData.length} correct answers.
              </p>
            )}
            {checkedAnswers && (
              <p>
                <button onClick={restartGame} className="bottom-button">
                  Play Again
                </button>
              </p>
            )}
            {!quizData && (
              <p className="loader-text">Getting new questions...</p>
            )}
            {!checkedAnswers && quizData && (
              <button className="bottom-button" onClick={scoreQuiz}>
                Check Answers
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
