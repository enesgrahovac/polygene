import React, { ReactElement } from "react";
import styles from "./Header.module.css";
import classNames from "classnames";
import Button from "../Button/Button";
import { Menu } from "lucide-react";
import HamburgerMenu from "@/components/patterns/HamburgerMenu/HamburgerMenu";

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string | ReactElement;
  actions?: ReactElement;
  showMenu?: boolean;
}

const Header = ({
  title,
  subtitle,
  actions,
  className,
  showMenu = false,
  ...rest
}: HeaderProps) => {
  return (
    <div className={classNames(className, styles.container)} {...rest}>
      <div
        className={classNames(
          styles.mainHeader,
          showMenu ? styles.offsetHeader : null
        )}
      >
        <div className={styles.titleAndMenu}>
          {showMenu && <HamburgerMenu />}
          <h1>{title}</h1>
        </div>
        {actions && <div className={styles.actionGroup}>{actions}</div>}
      </div>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
};

export default Header;
