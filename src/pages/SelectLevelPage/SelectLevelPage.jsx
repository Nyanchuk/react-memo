import { Link } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { lightHard } from "../../store/actions & types/gameActions";

export function SelectLevelPage() {
  const dispatch = useDispatch();
  const isCheckboxChecked = useSelector(state => state.game.easyMode);
  const [showDescription, setShowDescription] = useState(false); // Состояние для отображения описания
  console.log("Состояние чекбокса:", isCheckboxChecked);

  function handleCheckboxChange(e) {
    dispatch(lightHard(e.target.checked));
  }

  useEffect(() => {
    if (isCheckboxChecked) {
      setShowDescription(true); // Показываем табличку при включении упрощенного режима
      const timeout = setTimeout(() => {
        setShowDescription(false);
      }, 7000);
      return () => clearTimeout(timeout);
    }
  }, [isCheckboxChecked]);

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>
        <ul className={styles.levels}>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/3">
              1
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/6">
              2
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/9">
              3
            </Link>
          </li>
        </ul>
        <div className={`${styles.customCheckboxContainer} ${isCheckboxChecked ? styles.checked : ""}`}>
          <label className={styles.customCheckboxLabel}>
            <input
              type="checkbox"
              checked={isCheckboxChecked}
              onChange={handleCheckboxChange}
              className={styles.customCheckbox}
            />
            Упрощенный режим
            {/* {isCheckboxChecked ? "Упрощенный режим включен" : "Упрощенный режим выключен"} */}
          </label>
        </div>
      </div>
      <div>
        <div className={`${styles.descriptionContainer} ${showDescription ? styles.descriptionSlideIn : ""}`}>
          {showDescription && ( // Отображаем табличку при showDescription = true
            <div className={styles.description}>
              <p>Описание упрощенного режима:</p>
              <p>В упрощенном режиме у вас будет больше попыток для удачного завершения игры.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
