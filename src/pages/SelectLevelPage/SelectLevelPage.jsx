import { Link } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import React, { useState } from "react";

export function SelectLevelPage() {
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  function handleCheckboxChange(e) {
    setIsCheckboxChecked(e.target.checked);
  }

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
    </div>
  );
}
