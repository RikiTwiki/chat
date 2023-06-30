import styles from "./Loader.module.scss";

function Loader({ loading }: { loading: boolean }) {
  return (
    <>
      {loading ? (
        <section className={styles["dots-container"]}>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </section>
      ) : (
        ""
      )}
    </>
  );
}

export default Loader;
