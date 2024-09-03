import { useState } from "react";

import styles from "./SubscribeModal.module.css";
import classNames from "classnames";
import Modal, { ModalProps } from "../../Modal";
import { Check } from "lucide-react";
import Button from "@/components/patterns/Button/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { upgradeToPremium } from '@/utils/stripe/subscription'

export interface SubscribeModalProps extends ModalProps { fromCreateQuizButton?: boolean; }

export function formatDate(date?: Date) {
    function getOrdinalIndicator(day: number) {
        if (day > 3 && day < 21) return "th"; // for 4th to 20th
        switch (day % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    }
    const weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];



    const now = date || new Date();
    const dayOfWeek = weekdays[now.getDay()];
    const month = months[now.getMonth()];
    const dayOfMonth = now.getDate();

    const ordinal = getOrdinalIndicator(dayOfMonth);
    return `${dayOfWeek}, ${month} ${dayOfMonth}${ordinal}`;
}

export const SubscriptionBenefits = () => {
    // const sampleVideo = "https://www.youtube.com/watch?v=krsBRQbOPQ4"; // Mr. Beast video
    const subBenefits = [
        <p>Unlimited quiz creation</p>,
        <p>Unlimited quiz taking</p>,
        <p>
            Early access to new features
        </p>,
        // <p>
        //     Currently supporting smart redirection on all YouTube videos, with more
        //     sites planned.{" "}
        //     <Link href={sampleVideo}>Try it out on a sample video</Link>.
        // </p>,
    ];

    return (
        <div className={styles.benefits}>
            {subBenefits.map((ben) => (
                <div className={styles.benefit}>
                    <Check size={20} />
                    {ben}
                </div>
            ))}
        </div>
    );
};

const SubscribeModal = ({
    className,
    hideModal,
    fromCreateQuizButton,
    ...rest
}: SubscribeModalProps) => {
    const [isOnTrial, setIsOnTrial] = useState(true);
    const [isFirstOpen, setIsFirstOpen] = useState(true);
    const { userId } = useUser();


    const getModalTitle = () => {

        if (fromCreateQuizButton) {
            return "Join Pro to create a quiz";
        }

        if (isFirstOpen && isOnTrial) {
            return "Join Pro to become a lifelong learner";
        }

        if (isOnTrial) {
            return "Join Pro to keep full access";
        }

        return "Join Pro for full access";
    };

    const getDeclineButtonText = () => {
        if (isFirstOpen && isOnTrial) {
            return "Not yet";
        }

        return "Not yet";
    };

    const currentDate: Date = new Date();
    const renewDate: Date = new Date(
        currentDate.getFullYear() + 1,
        currentDate.getMonth(),
        currentDate.getDate()
    );
    const router = useRouter();

    return (
        <Modal title={getModalTitle()} hideModal={hideModal} {...rest}>
            <div className={classNames(className, styles.container)} {...rest}>
                <SubscriptionBenefits />
                <div className={styles.yearlyOption}>
                    <div className={styles.text}>
                        <h2>$99 one-time payment</h2>
                        <p>
                            This is an early-supporter offer. With a 7-day money back guarantee.
                        </p>
                    </div>
                    <div className={styles.checkmark}>
                        <Check size={16} />
                    </div>
                </div>
                <div className={styles.buttonGroup}>
                    <Button
                        variant="primary"
                        label="Join BookQuest Pro"
                        onClick={() => {
                            if (userId) {
                                upgradeToPremium(userId)
                            } else {
                                console.error("User ID is undefined. Cannot upgrade to premium.");
                            }
                        }}
                    />
                    <Button label={getDeclineButtonText()} onClick={hideModal} />
                </div>
            </div>
        </Modal>
    );
};

export default SubscribeModal;
