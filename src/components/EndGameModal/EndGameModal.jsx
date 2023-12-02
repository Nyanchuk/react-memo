import styles from "./EndGameModal.module.css";
import { useNavigate } from "react-router-dom";
import { Button, ButtonExit } from "../Button/Button";
import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";
import { useState } from "react";
import { addNewLeader } from "../../api";

export function EndGameModal({ isWon, gameDurationSeconds, gameDurationMinutes, onClick, showLeaderboardPrompt }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(""); // Состояние для имени пользователя
  const title = isWon ? (showLeaderboardPrompt ? "Вы попали на Лидерборд!" : "Вы победили!") : "Вы проиграли!";
  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;
  const imgAlt = isWon ? "celebration emodji" : "dead emodji";
  const padWithZero = num => (num < 10 ? `0${num}` : num);
  const minutes = padWithZero(gameDurationMinutes);
  const seconds = padWithZero(gameDurationSeconds);

  const handleInputChange = event => {
    setUserName(event.target.value); // Обновляем состояние userName при изменении значения поля ввода
  };

  const handleLeaderboardClick = async () => {
    if (showLeaderboardPrompt) {
      const time = parseInt(gameDurationMinutes, 10) * 60 + parseInt(gameDurationSeconds, 10);
      console.log("Отправляемые данные:", userName, time); // Вывод данных перед отправкой

      try {
        await addNewLeader(userName, time); // Отправка API-запроса на добавление нового лидера
        // Переход на страницу лидерборда
        navigate("/leaderboard");
      } catch (error) {
        console.error("Ошибка при добавлении нового лидера:", error);
        // Обработка ошибки, например, отображение сообщения об ошибке
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
            <ButtonExit onClick={handleLeaderboardClick}>Посмотреть Лидерборд</ButtonExit>
          </div>
        ) : (
          <Button onClick={onClick}>Начать сначала</Button>
        )}
        <ButtonExit onClick={() => navigate("/")}>Вернуться к выбору сложности</ButtonExit>
      </div>
    </div>
  );
}
