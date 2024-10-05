import React from 'react';
import styles from './PageLayout.module.css';
import SideBar from '@/components/patterns/SideBar/SideBar';
interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className={styles.pageLayout}>
      <div className={styles.sidebar}>
        <SideBar />
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;