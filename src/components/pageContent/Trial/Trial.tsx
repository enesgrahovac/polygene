import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { cancelReplicateInference, getReplicateInferenceStatus } from "@/utils/inference";
import Button from '@/components/patterns/Button/Button';
import styles from './Trial.module.css';

const TrialPageContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [trialName, setTrialName] = useState('');
    const [prediction, setPrediction] = useState('');
    const [predictionOutput, setPredictionOutput] = useState('');
    const [isWaitingForInference, setIsWaitingForInference] = useState(true);
    const [predictionTime, setPredictionTime] = useState(0);
    const [statusMessage, setStatusMessage] = useState('');
    const [isCanceled, setIsCanceled] = useState(false);

    useEffect(() => {
        const name = searchParams.get('name');
        const predictionId = searchParams.get('predictionId');
        if (name && predictionId) {
            setTrialName(name);
            setPrediction(predictionId);
        }
    }, [searchParams]);

    const getInferenceData = async () => {
        const inferenceResult = await getReplicateInferenceStatus(prediction);
        let inferenceStatus = inferenceResult.status;
        return {
            status: inferenceStatus,
            output: inferenceResult.output,
            predictionTime: inferenceResult.metrics?.predict_time || 0,
        }
    }

    const waitUntilInferenceIsDone = async () => {
        let inferenceData = await getInferenceData();
        let { status, predictionTime, output } = inferenceData;
        if (status === "canceled") {
            setIsCanceled(true);
            setStatusMessage("Inference was canceled.");
            return;
        }
        while (status !== "succeeded" && !isCanceled) {
          
            inferenceData = await getInferenceData();
            ({ status, predictionTime, output } = inferenceData);
            if (status === "processing") {
                setStatusMessage("Inference is in progress...");
            } else if (status === "starting") {
                setStatusMessage("Booting up...");
            } else if (status === "canceled") {
                setIsCanceled(true);
                setStatusMessage("Inference was canceled.");
                break; // Exit the loop if status is canceled
            }
            if (status !== "succeeded") {
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }

        if (status === "succeeded") {
            setIsWaitingForInference(false);
            while (!output) {
                inferenceData = await getInferenceData();
                ({ status, predictionTime, output } = inferenceData);
                if (!output) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            setPredictionOutput(output);
            setPredictionTime(predictionTime);
        }
    }

    const cancelInferenceHandler = async () => {
        const cancellationResponse = await cancelReplicateInference(prediction);
        setIsCanceled(true);
        // router.push('/lab');
    }

    useEffect(() => {
        if (trialName && prediction && !isCanceled) {
            waitUntilInferenceIsDone();
        }
    }, [trialName, prediction]);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.container}>
                <h1>Trial: {trialName}</h1>
                <p>Inference Results</p>
                <div className={styles.predictionOutput}>
                    {isCanceled ? (
                        <div>
                            <p>Inference was canceled.</p>
                        </div>
                    ) : isWaitingForInference ? (
                        <div>
                            <p>{statusMessage}</p>
                        </div>
                    ) : (
                        <div>
                            <p>Prediction Output: {predictionOutput}</p>
                            <p>Prediction Time: {predictionTime} seconds</p>
                        </div>
                    )}
                </div>
                <div className={styles.buttonContainer}>
                    {isCanceled ? (
                        <Button label="Run another trial" onClick={() => router.push('/lab')} />
                    ) : isWaitingForInference ? (
                        <Button label="Cancel" onClick={cancelInferenceHandler} />
                    ) : (
                        <Button label="Run another trial" onClick={() => router.push('/lab')} />
                    )}
                </div>
            </div>
        </div>
    );
};

const TrialPage = () => (
    <Suspense fallback={<div></div>}>
        <TrialPageContent />
    </Suspense>
);

export default TrialPage;