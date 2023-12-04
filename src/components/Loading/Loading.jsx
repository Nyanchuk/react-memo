import LoadingPage from "../../img/logo192.png";
import styles from "./Loading.module.css";

const Loading = () => {
  return (
    <div className={styles.conteiner}>
      <img src={LoadingPage} alt="Loading" className={styles.loadingImage} />
      <div className={styles.text}>Подождите, идет загрузка...</div>
    </div>
  );
};

export default Loading;
