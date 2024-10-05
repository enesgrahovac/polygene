import React from 'react';
import styles from './Loader.module.css';

interface LoaderProps {
  width?: string;
  height?: string;
}

const Loader: React.FC<LoaderProps> = ({ width = '36px', height = '36px' }) => {
  return (
    <div className={styles.loader}>
      <div className={styles.spinner} style={{ width, height }}></div>
    </div>
  );
};

export default Loader;
