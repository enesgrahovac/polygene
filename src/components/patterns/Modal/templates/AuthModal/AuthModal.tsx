// AuthModal.tsx
import React, { useState, useEffect } from "react";
import Modal, { ModalProps } from "../../Modal";
import styles from "./AuthModal.module.css";
import classNames from "classnames";
import Button from "@/components/patterns/Button/Button";
import Image from "next/image";
import google from "@/public/img/google.png";
import { createClient } from '@/utils/supabase/auth/client';

export interface AuthModalProps extends ModalProps {
  onAuthSuccess?: () => void;
}

const AuthModal = ({
  className,
  onAuthSuccess,
  hideModal,
  ...rest
}: AuthModalProps) => {
  const supabase = createClient();
  const [login, setLogin] = useState(false);
  const [titleText, setTitleText] = useState("Register for BookQuest");
  const [preLinkText, setPreLinkText] = useState("Have an account?");
  const [linkText, setLinkText] = useState("Sign in instead");
  const [labelText, setLabelText] = useState("Register with Google");
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (login) {
      setTitleText("Log in to create a quiz");
      setPreLinkText("Don't have an account?");
      setLinkText("Sign up instead");
      setLabelText("Log in with Google");
    } else {
      setTitleText("Register to create a quiz");
      setPreLinkText("Have an account?");
      setLinkText("Sign in instead");
      setLabelText("Register with Google");
    }
  }, [login]);

  const handleGoogleAuth = async () => {
    setIsAuthenticating(true);
    const redirectToURL = `${window.location.origin}/auth/callback?next=/home`;
    try {
      const result = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectToURL,
        },
      });

      if (result.error) {
        console.error('Error logging in:', result.error.message);
        setErrorMessage("Authentication failed. Please try again.");
      } else if (onAuthSuccess) {
        onAuthSuccess();
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      setErrorMessage("Authentication failed. Please try again.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <Modal
      title={titleText}
      hideModal={hideModal}
      {...rest}
    >
      <div className={classNames(className, styles.container)}>
        <p className={styles.signInText}>
          {preLinkText}{" "}
          <a href="#" onClick={(e) => {
              e.preventDefault();
              setLogin(!login);
          }}>
            {linkText}
          </a>.
        </p>
        {errorMessage && <div className={styles.error}>{errorMessage}</div>}
        <Button
          variant="primary"
          label={labelText}
          disabled={isAuthenticating}
          icon={
            <div className={styles.iconWrapper}>
              <Image alt="Google" src={google} width={16} height={16} />
            </div>
          }
          className={styles.button}
          onClick={handleGoogleAuth}
        />
      </div>
    </Modal>
  );
};

export default AuthModal;