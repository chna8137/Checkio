import CommuteCard from '../attendance/CommuteCard';
import styles from './home.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>환영합니다! B Team입니다.</h2>
      <p className={styles.subtitle}>B Team 출퇴근 관리 사이트 입니다.</p>
      <CommuteCard />
    </div>
    
  );
};

export default Home;
