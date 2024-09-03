import React, { useEffect } from "react";
import styles from "./LandingPage.module.css";
import Image from "next/image";
import Divider from "@/components/patterns/Divider/Divider";
import Button from "@/components/patterns/Button/Button";
import { Check, Plus, Send } from "lucide-react";
import Link from "next/link";


const LandingPageContent = ({ }: {}) => {
    const [showCopiedMessage, setShowCopiedMessage] = React.useState(false);
    const [showMenuBar, setShowMenuBar] = React.useState(false);

    return (
        <div className={styles.wrapper}>
            <div className={styles.main}>
                <div className={styles.intro}>
                    {/* <p>Meet Molla</p> */}
                    <h1>PolyGene</h1>
                    <h2>
                        1 AI model to replace testing on thousands of Lab Rats.
                    </h2>
                </div>

          


                <Divider />

                <div className={styles.footer}>
                    <h1>Are you ready to use the most advanced AI biotech model?</h1>
                    <div className={styles.buttons}>
                        <Button
                            variant="primary"
                            label="Get started for free"
                            icon={<Plus />}
                            onClick={() => {
                                window.location.href =
                                    "/auth";
                            }}
                        />
                    </div>
            
                </div>
            </div>
        </div>
    );
};

export default LandingPageContent;
