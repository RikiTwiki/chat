import Routing from "routing/Routing";
import styles from "./App.module.scss";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { RoutesEnum } from "shared/constants/routesEnum";
import { setItem } from "services/localStorage.service";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(RoutesEnum.HOME);
  }, [navigate]);

  return (
    <div className={styles.wrapper}>
      <Routing />
    </div>
  );
}

export default App;
