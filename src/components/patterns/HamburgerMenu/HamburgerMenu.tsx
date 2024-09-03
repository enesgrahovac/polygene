import React from "react";
import styles from "./HamburgerMenu.module.css";
import Button from "../Button/Button";
import {
    Lightbulb,
    Mail,
    Menu,
    PanelLeftClose,
    Settings,
    Info,
    Book,
} from "lucide-react";
import classNames from "classnames";
import Header from "../Header/Header";
import Link from "next/link";

const HamburgerMenu = () => {
    const [isMenuOpen, setMenuOpen] = React.useState(false);

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    return (
        <div>
            <Button variant="ghost" icon={<Menu />} onClick={toggleMenu} />
            <div onClick={toggleMenu} className={classNames(styles.overlay, isMenuOpen ? styles.open : null)} >
                <div className={classNames(styles.menu, isMenuOpen ? styles.open : null)}>
                    <Header
                        title="BookQuest"
                        actions={
                            <Button
                                variant="ghost"
                                icon={<PanelLeftClose onClick={toggleMenu} />}
                            />
                        }
                        className={styles.header}
                    />
                    <ul>
                        {/* <li>
              <Link href="/home">
                <Home /> Home
              </Link>
            </li> */}
                        <li>
                            <Link href="/home">
                                <Book /> My books
                            </Link>
                        </li>
                        <li>
                            <Link href="/settings">
                                <Settings /> Settings
                            </Link>
                        </li>
                        <li>
                            <a href="https://bookquest.canny.io/feature-requests" target="_blank">
                                <Lightbulb /> Feature requests
                            </a>
                        </li>
                    </ul>
                    <div className={styles.divider} />
                    <ul>
                        <li className={styles.bTop}>
                            <a href="mailto:bookquest.contact@gmail.com" target="_blank">
                                <Mail />{" "}
                                <div>
                                    Contact<p>bookquest.contact@gmail.com</p>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="/landing" target="_blank">
                                <Info /> About BookQuest
                            </a>
                        </li>
                        {/* <li>
              <a
                href="/blogs"
                target="_blank"
              >
                <Newspaper /> Blog
              </a>
            </li> */}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default HamburgerMenu;
