import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button, ButtonExit } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import eyeOfGod from "../../img/free-icon-god-1152084.png";
import pairOfCards from "../../img/free-icon-spade-8217313.png";
import goodMove from "../../img/free-icon-luck-1626871.png";

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
  const [superPowerDescription, setSuperPowerDescription] = useState(null);

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

  //ИНФО-ОКНА

  const handleSuperPowerMouseEnter = description => {
    setSuperPowerDescription(description);
  };

  const handleSuperPowerMouseLeave = () => {
    setSuperPowerDescription(null);
  };

  return (
    <div className={styles.max}>
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
          {pairsCount === 3 && (
            <>
              <div className={styles.topInfo}>
                <ButtonExit onClick={() => navigate("/")}>Вернуться к выбору сложности</ButtonExit>
              </div>
            </>
          )}
          {pairsCount === 6 && (
            <>
              <div className={styles.topInfo}>
                <ButtonExit onClick={() => navigate("/")}>Вернуться к выбору сложности</ButtonExit>
              </div>
            </>
          )}
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
      </div>
      {pairsCount === 9 && (
        <>
          <div className={styles.topInfo}>
            <div className={styles.footer}>
              <div
                className={styles.footerConteiner}
                onMouseEnter={() =>
                  handleSuperPowerMouseEnter(
                    "ГЛАЗ БОГА <br><br> На 5 секунд показывает все карты. Таймер длительности игры на это время останавливается",
                  )
                }
                onMouseLeave={() => handleSuperPowerMouseLeave()}
              >
                <img src={eyeOfGod} alt="Eye of God" className={styles.footerImg} />
              </div>
              <div
                className={styles.footerConteiner}
                onMouseEnter={() =>
                  handleSuperPowerMouseEnter(
                    "ВТОРАЯ ПОЛОВИНКА <br><br> Находит пару карт или вторую карту, если игрок уже успел выбрать первую карту",
                  )
                }
                onMouseLeave={() => handleSuperPowerMouseLeave()}
              >
                <img src={pairOfCards} alt="Pair of Cards" className={styles.footerImg} />
              </div>
              <div
                className={styles.footerConteiner}
                onMouseEnter={() =>
                  handleSuperPowerMouseEnter(
                    "УДАЧНЫЙ ХОД <br><br> При активации игрок имеет право на ошибку в выборе карты. Ход всегда удачный, потому что игрок не проиграет даже в случае несовпадения выбранных карт",
                  )
                }
                onMouseLeave={() => handleSuperPowerMouseLeave()}
              >
                <img src={goodMove} alt="Good Move" className={styles.footerImg} />
              </div>
            </div>
            <ButtonExit onClick={() => navigate("/")}>Вернуться к выбору сложности</ButtonExit>
          </div>
        </>
      )}
      <div className={styles.bottomInfo}>
        {superPowerDescription && (
          <div
            className={styles.superPowerDescription}
            dangerouslySetInnerHTML={{ __html: superPowerDescription }}
          ></div>
        )}
      </div>
    </div>
  );
}
