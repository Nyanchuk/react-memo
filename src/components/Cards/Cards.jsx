import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button, ButtonExit } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const STATUS_LOST = "STATUS_LOST";
const STATUS_WON = "STATUS_WON";
const STATUS_IN_PROGRESS = "STATUS_IN_PROGRESS";
const STATUS_PREVIEW = "STATUS_PREVIEW";

function getTimerValue(startDate, endDate) {
  if (!startDate && !endDate) {
    return {
      minutes: 0,
      seconds: 0,
    };
  }

  if (endDate === null) {
    endDate = new Date();
  }

  const diffInSecconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
  const minutes = Math.floor(diffInSecconds / 60);
  const seconds = diffInSecconds % 60;
  return {
    minutes,
    seconds,
  };
}

export function Cards({ pairsCount = 3, previewSeconds = 5 }) {
  const navigate = useNavigate();
  const easyMode = useSelector(state => state.game.easyMode);
  const attempts = easyMode ? 3 : 1;
  const [remainingAttempts, setRemainingAttempts] = useState(attempts);
  const [cards, setCards] = useState([]);
  const [status, setStatus] = useState(STATUS_PREVIEW);
  const [gameStartDate, setGameStartDate] = useState(null);
  const [gameEndDate, setGameEndDate] = useState(null);
  const [showLeaderboardPrompt, setShowLeaderboardPrompt] = useState(false);

  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0,
  });

  function finishGame(status = STATUS_LOST) {
    setGameEndDate(new Date());
    setStatus(status);
    if (status === STATUS_WON && pairsCount === 9) {
      setShowLeaderboardPrompt(true);
    }
  }
  function startGame() {
    const startDate = new Date();
    setGameEndDate(null);
    setGameStartDate(startDate);
    setTimer(getTimerValue(startDate, null));
    setStatus(STATUS_IN_PROGRESS);
  }
  function resetGame() {
    setGameStartDate(null);
    setGameEndDate(null);
    setTimer(getTimerValue(null, null));
    setStatus(STATUS_PREVIEW);
    setRemainingAttempts(easyMode ? 3 : 1);
  }

  const openCard = clickedCard => {
    // Если карта уже открыта, то ничего не делаем
    if (clickedCard.open) {
      return;
    }
    // Игровое поле после открытия кликнутой карты
    const nextCards = cards.map(card => {
      if (card.id !== clickedCard.id) {
        return card;
      }

      return {
        ...card,
        open: true,
      };
    });

    setCards(nextCards);

    const isPlayerWon = nextCards.every(card => card.open);

    // Победа - все карты на поле открыты
    if (isPlayerWon) {
      finishGame(STATUS_WON);
      return;
    }

    // Открытые карты на игровом поле
    const openCards = nextCards.filter(card => card.open);

    // Ищем открытые карты, у которых нет пары среди других открытых
    const openCardsWithoutPair = openCards.filter(card => {
      const sameCards = openCards.filter(openCard => card.suit === openCard.suit && card.rank === openCard.rank);

      if (sameCards.length < 2) {
        return true;
      }

      return false;
    });

    const playerLost = openCardsWithoutPair.length >= 2;

    // "Игрок проиграл", т.к на поле есть две открытые карты без пары
    if (playerLost) {
      if (!easyMode) {
        // В стандартном режиме завершаем игру после одной ошибки
        finishGame(STATUS_LOST);
      } else {
        // В облегченном режиме уменьшаем счетчик ошибок
        setRemainingAttempts(prevAttempts => prevAttempts - 1);

        if (remainingAttempts <= 1) {
          // Завершаем игру после использования всех попыток
          finishGame(STATUS_LOST);
        } else {
          // Открываем и закрываем вторую карту после ошибки
          const updatedCards = nextCards.map(card => {
            if (openCardsWithoutPair.some(openCard => openCard.id === card.id)) {
              // Временно открываем вторую карту
              if (card.open) {
                setTimeout(() => {
                  setCards(prevCards => {
                    const updated = prevCards.map(c => (c.id === card.id ? { ...c, open: false } : c));
                    return updated;
                  });
                }, 1000); // Задержка в миллисекундах (в данном случае 1 секунда)
              }
            }
            return card;
          });
          setCards(updatedCards);
        }
      }
      return;
    }

    // ... игра продолжается
  };

  const isGameEnded = status === STATUS_LOST || status === STATUS_WON;

  // Игровой цикл
  useEffect(() => {
    // В статусах кроме превью доп логики не требуется
    if (status !== STATUS_PREVIEW) {
      return;
    }

    // В статусе превью мы
    if (pairsCount > 36) {
      alert("Столько пар сделать невозможно");
      return;
    }

    setCards(() => {
      return shuffle(generateDeck(pairsCount, 10));
    });

    const timerId = setTimeout(() => {
      startGame();
    }, previewSeconds * 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [status, pairsCount, previewSeconds]);

  // Обновляем значение таймера в интервале
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer(getTimerValue(gameStartDate, gameEndDate));
    }, 300);
    return () => {
      clearInterval(intervalId);
    };
  }, [gameStartDate, gameEndDate]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.timer}>
          {status === STATUS_PREVIEW ? (
            <div>
              <p className={styles.previewText}>Запоминайте пары!</p>
              <p className={styles.previewDescription}>Игра начнется через {previewSeconds} секунд</p>
            </div>
          ) : (
            <>
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>min</div>
                <div>{timer.minutes.toString().padStart("2", "0")}</div>
              </div>
              .
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>sec</div>
                <div>{timer.seconds.toString().padStart("2", "0")}</div>
              </div>
            </>
          )}
        </div>
        <div className={styles.attemptConteiner}>
          <div className={styles.attemptText}>Число попыток:</div>
          <div className={styles.attempt}>{remainingAttempts}</div>
        </div>
        {status === STATUS_IN_PROGRESS ? <Button onClick={resetGame}>Начать заново</Button> : null}
      </div>

      <div className={styles.cards}>
        {cards.map(card => (
          <Card
            key={card.id}
            onClick={() => openCard(card)}
            open={status !== STATUS_IN_PROGRESS ? true : card.open}
            suit={card.suit}
            rank={card.rank}
          />
        ))}
      </div>

      {isGameEnded ? (
        <div className={styles.modalContainer}>
          <EndGameModal
            isWon={status === STATUS_WON}
            gameDurationSeconds={timer.seconds}
            gameDurationMinutes={timer.minutes}
            onClick={resetGame}
            showLeaderboardPrompt={showLeaderboardPrompt}
          />
        </div>
      ) : null}
      <ButtonExit onClick={() => navigate("/")}>Вернуться к выбору сложности</ButtonExit>
    </div>
  );
}

// import { shuffle } from "lodash";
// import { useEffect, useState } from "react";
// import { generateDeck } from "../../utils/cards";
// import styles from "./Cards.module.css";
// import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
// import { Button, ButtonExit } from "../../components/Button/Button";
// import { Card } from "../../components/Card/Card";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// // Игра закончилась
// const STATUS_LOST = "STATUS_LOST";
// const STATUS_WON = "STATUS_WON";
// // Идет игра: карты закрыты, игрок может их открыть
// const STATUS_IN_PROGRESS = "STATUS_IN_PROGRESS";
// // Начало игры: игрок видит все карты в течении нескольких секунд
// const STATUS_PREVIEW = "STATUS_PREVIEW";

// function getTimerValue(startDate, endDate) {
//   if (!startDate && !endDate) {
//     return {
//       minutes: 0,
//       seconds: 0,
//     };
//   }

//   if (endDate === null) {
//     endDate = new Date();
//   }

//   const diffInSecconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
//   const minutes = Math.floor(diffInSecconds / 60);
//   const seconds = diffInSecconds % 60;
//   return {
//     minutes,
//     seconds,
//   };
// }

// /**
//  * Основной компонент игры, внутри него находится вся игровая механика и логика.
//  * pairsCount - сколько пар будет в игре
//  * previewSeconds - сколько секунд пользователь будет видеть все карты открытыми до начала игры
//  */
// export function Cards({ pairsCount = 3, previewSeconds = 5 }) {
//   const navigate = useNavigate();
//   const easyMode = useSelector(state => state.game.easyMode); // Получение значения из глобального состояния
//   const attempts = easyMode ? 3 : 1;
//   const [remainingAttempts, setRemainingAttempts] = useState(attempts);
//   // В cards лежит игровое поле - массив карт и их состояние открыта\закрыта
//   const [cards, setCards] = useState([]);
//   const [isLevel3Completed, setIsLevel3Completed] = useState(false);
//   // Текущий статус игры
//   const [status, setStatus] = useState(STATUS_PREVIEW);

//   // Дата начала игры
//   const [gameStartDate, setGameStartDate] = useState(null);
//   // Дата конца игры
//   const [gameEndDate, setGameEndDate] = useState(null);

//   // Стейт для таймера, высчитывается в setInteval на основе gameStartDate и gameEndDate
//   const [timer, setTimer] = useState({
//     seconds: 0,
//     minutes: 0,
//   });

//   function finishGame(status = STATUS_LOST) {
//     setGameEndDate(new Date());
//     setStatus(status);
//   }
//   function startGame() {
//     const startDate = new Date();
//     setGameEndDate(null);
//     setGameStartDate(startDate);
//     setTimer(getTimerValue(startDate, null));
//     setStatus(STATUS_IN_PROGRESS);
//   }
//   function resetGame() {
//     setGameStartDate(null);
//     setGameEndDate(null);
//     setTimer(getTimerValue(null, null));
//     setStatus(STATUS_PREVIEW);
//     setRemainingAttempts(easyMode ? 3 : 1);
//   }

//   /**
//    * Обработка основного действия в игре - открытие карты.
//    * После открытия карты игра может пепереходит в следующие состояния
//    * - "Игрок выиграл", если на поле открыты все карты
//    * - "Игрок проиграл", если на поле есть две открытые карты без пары
//    * - "Игра продолжается", если не случилось первых двух условий
//    */
//   const openCard = clickedCard => {
//     // Если карта уже открыта, то ничего не делаем
//     if (clickedCard.open) {
//       return;
//     }
//     // Игровое поле после открытия кликнутой карты
//     const nextCards = cards.map(card => {
//       if (card.id !== clickedCard.id) {
//         return card;
//       }

//       return {
//         ...card,
//         open: true,
//       };
//     });

//     setCards(nextCards);

//     const isPlayerWon = nextCards.every(card => card.open);

//     // Победа - все карты на поле открыты
//     if (isPlayerWon) {
//       finishGame(STATUS_WON);
//       return;
//     }

//     // Открытые карты на игровом поле
//     const openCards = nextCards.filter(card => card.open);

//     // Ищем открытые карты, у которых нет пары среди других открытых
//     const openCardsWithoutPair = openCards.filter(card => {
//       const sameCards = openCards.filter(openCard => card.suit === openCard.suit && card.rank === openCard.rank);

//       if (sameCards.length < 2) {
//         return true;
//       }

//       return false;
//     });

//     const playerLost = openCardsWithoutPair.length >= 2;

//     // "Игрок проиграл", т.к на поле есть две открытые карты без пары
//     if (playerLost) {
//       if (!easyMode) {
//         // В стандартном режиме завершаем игру после одной ошибки
//         finishGame(STATUS_LOST);
//       } else {
//         // В облегченном режиме уменьшаем счетчик ошибок
//         setRemainingAttempts(prevAttempts => prevAttempts - 1);

//         if (remainingAttempts <= 1) {
//           // Завершаем игру после использования всех попыток
//           finishGame(STATUS_LOST);
//         } else {
//           // Открываем и закрываем вторую карту после ошибки
//           const updatedCards = nextCards.map(card => {
//             if (openCardsWithoutPair.some(openCard => openCard.id === card.id)) {
//               // Временно открываем вторую карту
//               if (card.open) {
//                 setTimeout(() => {
//                   setCards(prevCards => {
//                     const updated = prevCards.map(c => (c.id === card.id ? { ...c, open: false } : c));
//                     return updated;
//                   });
//                 }, 1000); // Задержка в миллисекундах (в данном случае 1 секунда)
//               }
//             }
//             return card;
//           });
//           setCards(updatedCards);
//         }
//       }
//       return;
//     }

//     // ... игра продолжается
//   };

//   const isGameEnded = status === STATUS_LOST || status === STATUS_WON;

//   // Игровой цикл
//   useEffect(() => {
//     // В статусах кроме превью доп логики не требуется
//     if (status !== STATUS_PREVIEW) {
//       return;
//     }

//     // В статусе превью мы
//     if (pairsCount > 36) {
//       alert("Столько пар сделать невозможно");
//       return;
//     }

//     setCards(() => {
//       return shuffle(generateDeck(pairsCount, 10));
//     });

//     const timerId = setTimeout(() => {
//       startGame();
//     }, previewSeconds * 1000);

//     return () => {
//       clearTimeout(timerId);
//     };
//   }, [status, pairsCount, previewSeconds]);

//   // Обновляем значение таймера в интервале
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setTimer(getTimerValue(gameStartDate, gameEndDate));
//     }, 300);
//     return () => {
//       clearInterval(intervalId);
//     };
//   }, [gameStartDate, gameEndDate]);

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <div className={styles.timer}>
//           {status === STATUS_PREVIEW ? (
//             <div>
//               <p className={styles.previewText}>Запоминайте пары!</p>
//               <p className={styles.previewDescription}>Игра начнется через {previewSeconds} секунд</p>
//             </div>
//           ) : (
//             <>
//               <div className={styles.timerValue}>
//                 <div className={styles.timerDescription}>min</div>
//                 <div>{timer.minutes.toString().padStart("2", "0")}</div>
//               </div>
//               .
//               <div className={styles.timerValue}>
//                 <div className={styles.timerDescription}>sec</div>
//                 <div>{timer.seconds.toString().padStart("2", "0")}</div>
//               </div>
//             </>
//           )}
//         </div>
//         <div className={styles.attemptConteiner}>
//           <div className={styles.attemptText}>Число попыток:</div>
//           <div className={styles.attempt}>{remainingAttempts}</div>
//         </div>
//         {status === STATUS_IN_PROGRESS ? <Button onClick={resetGame}>Начать заново</Button> : null}
//       </div>

//       <div className={styles.cards}>
//         {cards.map(card => (
//           <Card
//             key={card.id}
//             onClick={() => openCard(card)}
//             open={status !== STATUS_IN_PROGRESS ? true : card.open}
//             suit={card.suit}
//             rank={card.rank}
//           />
//         ))}
//       </div>

//       {isGameEnded ? (
//         <div className={styles.modalContainer}>
//           <EndGameModal
//             isWon={status === STATUS_WON}
//             gameDurationSeconds={timer.seconds}
//             gameDurationMinutes={timer.minutes}
//             onClick={resetGame}
//           />
//         </div>
//       ) : null}
//       <ButtonExit onClick={() => navigate("/")}>Вернуться к выбору сложности</ButtonExit>
//     </div>
//   );
// }
