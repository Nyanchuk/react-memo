import styles from "./EndGameModal.module.css";
import { useNavigate } from "react-router-dom";
import { Button, ButtonExit } from "../Button/Button";
import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";
import { useState } from "react";
import { addNewLeader } from "../../api";
import { useSelector } from "react-redux";

export function EndGameModal({ isWon, gameDurationSeconds, gameDurationMinutes, onClick, showLeaderboardPrompt }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const title = isWon ? (showLeaderboardPrompt ? "Вы попали на Лидерборд!" : "Вы победили!") : "Вы проиграли!";
  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;
  const imgAlt = isWon ? "celebration emodji" : "dead emodji";
  const padWithZero = num => (num < 10 ? `0${num}` : num);
  const minutes = padWithZero(gameDurationMinutes);
  const seconds = padWithZero(gameDurationSeconds);
  const easyMode = useSelector(state => state.game.easyMode);
  const usedSuperPowers = useSelector(state => state.game.usedSuperPowers);

  const handleInputChange = event => {
    setUserName(event.target.value);
  };

  const handleLeaderboardClick = async () => {
    if (showLeaderboardPrompt && !isLoading) {
      setIsLoading(true);
      const time = parseInt(gameDurationMinutes, 10) * 60 + parseInt(gameDurationSeconds, 10);
      const finalUserName = userName || "Пользователь";
      let achievements = [];

      if (easyMode === false) {
        achievements.push(1); // Добавление значения 1 в массив achievements
      }

      if (usedSuperPowers === false) {
        achievements.push(2); // Добавление значения 2 в массив achievements
      }

      console.log("Отправляемые данные:", finalUserName, time, achievements); // Вывод данных перед отправкой

      try {
        await addNewLeader({ name: finalUserName, time: time, achievements: achievements }); // Отправка API-запроса на добавление нового лидера
        // Переход на страницу лидерборда
        navigate("/leaderboard");
      } catch (error) {
        console.error("Ошибка при добавлении нового лидера:", error);
        // Обработка ошибки
      } finally {
        setIsLoading(false); // Устанавливаем isLoading в false после завершения запроса
      }
    } else {
      navigate("/leaderboard");
    }
  };

  return (
    <div className={styles.modal}>
      <img className={styles.image} src={imgSrc} alt={imgAlt} />
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>Затраченное время:</p>
      <div className={styles.time}>{`${minutes}:${seconds}`}</div>
      <div className={styles.navigate}>
        {isWon && showLeaderboardPrompt ? (
          <div className={styles.userBlock}>
            <input
              className={styles.userName}
              type="text"
              placeholder="Введите ваше имя"
              value={userName}
              onChange={handleInputChange}
            />
            <ButtonExit onClick={handleLeaderboardClick} disabled={isLoading}>
              {isLoading ? "Добавляем вас в список..." : "Посмотреть Лидерборд"}
            </ButtonExit>
          </div>
        ) : (
          <Button onClick={onClick}>Начать сначала</Button>
        )}
        <ButtonExit onClick={() => navigate("/")}>Вернуться к выбору сложности</ButtonExit>
      </div>
    </div>
  );
}
