import Loading from "../../components/Loading/Loading";
import React, { useState, useEffect } from "react";
import styles from "./LeaderboardPage.module.css";
import LoadingPage from "../../components/Loading/logo192.png";
import { ButtonExit } from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { getFetchWinners } from "../../api";

export function LeaderboardPage() {
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const data = await getFetchWinners(); // Вызов API-запроса для получения данных
        setLeaderboardData(data.leaders); // Обновление состояния с данными из API
        setShowLoading(false); // Установка состояния загрузки в false
        const maxLeaders = 10; // Максимальное количество лидеров
        const updatedLeaders = [...data.leaders];
        while (updatedLeaders.length < maxLeaders) {
          updatedLeaders.push({ id: null, name: "", time: null }); // Заполнение пустыми значениями, если массив не содержит 10 элементов
        }
        // Помещаем пустые элементы в конец массива, сортируем непустые элементы
        const nonEmptyLeaders = updatedLeaders.filter(entry => entry.id !== null);
        const emptyLeaders = updatedLeaders.filter(entry => entry.id === null);
        const sortedNonEmptyLeaders = nonEmptyLeaders.sort((a, b) => a.time - b.time);
        const finalLeaders = [...sortedNonEmptyLeaders, ...emptyLeaders];
        setLeaderboardData(finalLeaders);
        console.log(data);
      } catch (error) {
        console.error("Ошибка получения данных:", error);
        // Добавьте обработку ошибки, например, отображение сообщения об ошибке
      }
    };
    fetchLeaderboardData(); // Вызов функции получения данных с сервера
  }, []);

  return (
    <div className={styles.box}>
      {showLoading ? (
        <Loading />
      ) : (
        <>
          <div className={styles.img}>
            <img src={LoadingPage} alt="Loading" className={styles.loadingImage} />
            <img src={LoadingPage} alt="Loading" className={styles.loadingImage1} />
          </div>
          <table className={styles.table}>
            <thead>
              <tr className={styles.position}>
                <th className={styles.position}>Позиция</th>
                <th className={styles.position}>Пользователь</th>
                <th className={styles.position}>Время</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.slice(0, 10).map((entry, index) => (
                <tr key={index}>
                  <td className={styles.users}>{index + 1}</td>
                  <td className={styles.users}>{entry.name ? entry.name : "-"}</td>
                  <td className={styles.users}>{entry.time ? entry.time : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ButtonExit onClick={() => navigate("/")}>Начать игру</ButtonExit>
        </>
      )}
    </div>
  );
}
