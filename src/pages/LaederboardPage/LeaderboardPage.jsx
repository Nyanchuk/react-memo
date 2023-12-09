import Loading from "../../components/Loading/Loading";
import React, { useState, useEffect } from "react";
import styles from "./LeaderboardPage.module.css";
import LoadingPage from "../../img/logo192.png";
import { ButtonExit } from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { getFetchWinners } from "../../api";
import active1 from "../../img/active-1.png";
import isInactive1 from "../../img/inactive-1.png";
import active2 from "../../img/active-2.png";
import isInactive2 from "../../img/inactive-2.png";

export function LeaderboardPage() {
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [superPowerDescription, setSuperPowerDescription] = useState(null);

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

  const handleSuperPowerMouseEnter = description => {
    setSuperPowerDescription(description);
  };

  const handleSuperPowerMouseLeave = () => {
    setSuperPowerDescription(null);
  };

  return (
    <div className={styles.box}>
      {showLoading ? (
        <Loading />
      ) : (
        <>
          <div className={styles.img}>
            <img src={LoadingPage} alt="Loading" className={styles.loadingImage} />
            <img src={LoadingPage} alt="Loading" className={styles.loadingImage1} />
            <div className={`${styles.bottomInfo} ${superPowerDescription ? styles.descriptionSlideIn : ""}`}>
              {superPowerDescription && (
                <div
                  className={styles.superPowerDescription}
                  dangerouslySetInnerHTML={{ __html: superPowerDescription }}
                ></div>
              )}
            </div>
          </div>
          <table className={styles.table}>
            <thead>
              <tr className={styles.position}>
                <th className={styles.position}>Позиция</th>
                <th className={styles.position}>Пользователь</th>
                <th className={styles.position}>Достижения</th>
                <th className={styles.position}>Время</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(10)].map((_, index) => {
                const entry = leaderboardData[index] || { id: null, name: "", time: null, achievements: [] };
                const accentClass = index < 3 ? styles.accentRow : "";
                return (
                  <tr key={index} className={accentClass}>
                    <td className={styles.users}>{index + 1}</td>
                    <td className={styles.users}>{entry.name ? entry.name : "-"}</td>
                    <td className={styles.users}>
                      <div className={styles.achievementImages}>
                        <img
                          src={
                            entry.id !== null ? (entry.achievements.includes(1) ? active1 : isInactive1) : isInactive1
                          }
                          alt="Achievement 1"
                          className={styles.achievementImage}
                          onMouseEnter={() => {
                            if (entry.achievements && entry.achievements.includes(1)) {
                              handleSuperPowerMouseEnter("Игра пройдена в сложном режиме");
                            } else {
                              handleSuperPowerMouseEnter("Достижений не получено");
                            }
                          }}
                          onMouseLeave={() => handleSuperPowerMouseLeave()}
                        />
                        <img
                          src={
                            entry.id !== null ? (entry.achievements.includes(2) ? active2 : isInactive2) : isInactive2
                          }
                          alt="Achievement 2"
                          className={styles.achievementImage}
                          onMouseEnter={() => {
                            if (entry.achievements && entry.achievements.includes(2)) {
                              handleSuperPowerMouseEnter("Игра пройдена без супер-сил");
                            } else {
                              handleSuperPowerMouseEnter("Пока достижений не получено");
                            }
                          }}
                          onMouseLeave={() => handleSuperPowerMouseLeave()}
                        />
                      </div>
                    </td>
                    <td className={styles.users}>{entry.time ? entry.time : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <ButtonExit onClick={() => navigate("/")}>Начать игру</ButtonExit>
        </>
      )}
    </div>
  );
}
