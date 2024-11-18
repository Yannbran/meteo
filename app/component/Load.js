import styles from '../page.module.css';

export default function Loading() {
return(
<div id={styles.loading}>
<div className={styles.load1}></div>
<div className={styles.load2}></div>
<div className={styles.load3}></div>
</div>
)
};