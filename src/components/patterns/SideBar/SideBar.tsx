"use client"
import { useState, HTMLAttributes, useCallback } from "react";
import styles from "./SideBar.module.css";
import classnames from "classnames";
import Button from "@/components/patterns/Button/Button";
import { Dna, ChartScatter, Mail, CircleHelp, BookCopy, User, Plus, PanelLeftOpen, PanelLeftClose, Copy, Check } from "lucide-react";
// import Tooltip from "@/components/patterns/Tooltip/Tooltip";
import {useUser} from "@/contexts/UserContext"
import { useRouter } from 'next/navigation';

interface SideBarProps extends HTMLAttributes<HTMLDivElement> { }

const SideBar = ({ ...rest }: SideBarProps) => {

    const [showFullSideBar, setShowFullSideBar] = useState(true);
    const [showEmail, setShowEmail] = useState(false);
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);
    const iconStyle = { strokeWidth: 2 };
    const router = useRouter(); 
    const handleClick = (eventName: string, callback: () => void) => {
        // track(`Sidebar: ${eventName}`, {userId: userId || ""});
        callback();
    };
    // const copyEmailToClipboard = useCallback(() => {
    //     navigator.clipboard.writeText(email).then(() => {
    //         setShowCopiedMessage(true);
    //         setTimeout(() => {
    //             setShowCopiedMessage(false);
    //         }, 1000);
    //     });
    // }, [email]);

    return (
        <div
            className={classnames(
                styles.sideBar,
                { [styles.sideBarFull]: showFullSideBar, [styles.sideBarCollapsed]: !showFullSideBar }
            )}
            {...rest}
        >
            <div className={styles.topSideBarIcons}>
                {showFullSideBar &&
                    <div className={styles.titleBar}>
                        <span className={styles.titleText}>PolyGene V</span>
                        <Button
                            variant="ghost"
                            icon={<PanelLeftClose style={iconStyle} />}
                            onClick={() => handleClick("Close Panel", () => setShowFullSideBar(false))} />
                    </div>
                }
                <Button
                    variant="primary"
                    icon={<Plus style={iconStyle} />}
                    onClick={() => handleClick("New Trial", () => { router.push("/lab"); })}
                    className={classnames({ [styles.leftAlignButton]: showFullSideBar, [styles.showLabel]: showFullSideBar })}
                    label={showFullSideBar ? "New Trial" : undefined}
                />
                <Button
                    variant="ghost"
                    icon={<Dna style={iconStyle} />}
                    onClick={() => handleClick("Predictions", () => { router.push("/predictions"); })}
                    className={classnames({ [styles.leftAlignButton]: showFullSideBar, [styles.showLabel]: showFullSideBar })}
                    label={showFullSideBar ? "Predictions" : undefined}
                />
                <Button
                    variant="ghost"
                    icon={<ChartScatter style={iconStyle} />}
                    onClick={() => handleClick("Analysis", () => { router.push("/analysis"); })}
                    className={classnames({ [styles.leftAlignButton]: showFullSideBar, [styles.showLabel]: showFullSideBar })}
                    label={showFullSideBar ? "Analysis" : undefined}
                />
            </div>
            <div className={styles.bottomSideBarIcons}>
                {/* <Tooltip
                    content={
                        <div className={styles.helpTooltip}>
                            <div className={styles.helpOption} onClick={() => handleClick("More Information", () => { window.open("/home", "_blank", "noopener,noreferrer"); })}>
                                <Info height={20} strokeWidth={.1} />
                                <span>More Information</span>
                            </div>
                            <div
                                className={styles.helpOption}
                                onClick={() => {
                                    if (showEmail) {
                                        handleClick("Copy Email", () => copyEmailToClipboard());
                                    } else {
                                        handleClick("Show Email", () => setShowEmail(true));
                                        copyEmailToClipboard();
                                    }
                                }}
                            >
                                {showCopiedMessage ? (
                                    <>
                                        <Check height={20} strokeWidth={0.1} />
                                        <span>Copied to clipboard!</span>
                                    </>
                                ) : showEmail ? (
                                    <>
                                        <Mail height={20} strokeWidth={0.1} />
                                        <span>{email}</span>
                                        <Copy height={16} strokeWidth={0.1} style={{ marginLeft: '4px' }} />
                                    </>
                                ) : (
                                    <>
                                        <Mail height={20} strokeWidth={0.1} />
                                        <span>Email us</span>
                                    </>
                                )}
                            </div>
                            <div className={styles.helpOption} onClick={() => handleClick("Feature Request", () => { window.open("https://promptvo.canny.io/feature-requests", "_blank", "noopener,noreferrer"); })}>
                                <Lightbulb height={20} strokeWidth={.1} />
                                <span >Feature request</span>
                            </div>
                        </div>
                    }
                    position="right"
                    customClassName={styles.helpTooltip}
                >
                    <Button
                        variant="ghost"
                        icon={<CircleHelp style={iconStyle} />}
                        className={classnames({ [styles.leftAlignButton]: showFullSideBar, [styles.showLabel]: showFullSideBar })}
                        label={showFullSideBar ? "Help" : undefined}
                    />
                </Tooltip> */}

                {!showFullSideBar &&
                    <div className={styles.hiddenOnMobile}>
                        <Button
                            variant="ghost"
                            icon={<PanelLeftOpen style={iconStyle} />}
                            onClick={() => { handleClick("Open Panel", () => setShowFullSideBar(!showFullSideBar)); }}
                            className={classnames({ [styles.leftAlignButton]: showFullSideBar, [styles.showLabel]: showFullSideBar })}
                            label={showFullSideBar ? "Close Panel" : undefined}
                        />
                    </div>
                }
            </div>
        </div>
    );
};

export default SideBar;