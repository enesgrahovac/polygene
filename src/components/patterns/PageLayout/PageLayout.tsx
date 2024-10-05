import { useState, useEffect, useRef } from 'react';
import styles from './PageLayout.module.css';
import SideBar from '@/components/patterns/SideBar/SideBar';
import confetti from 'canvas-confetti';
import { useConfetti } from '@/contexts/ConfettiContext';

interface PageLayoutProps {
    children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
    // Remove all confetti-related code from here
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