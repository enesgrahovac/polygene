import React, { useState, useEffect, useRef, ChangeEvent, DragEvent } from "react";
import styles from "./FileUpload.module.css";
import Button from "@/components/patterns/Button/Button";
import TextInput from "@/components/patterns/TextInput/TextInput";
import { Upload, XCircle, File, CheckCircle, Circle } from "lucide-react";
import { clientSideUpload, createSupabaseSignedUrl } from "@/utils/supabase/storage/clientActions";
import Loader from '@/components/patterns/Loader/Loader';
import { replicateInference, startInference, getInferenceStatus } from "@/utils/inference";
import { v4 as uuidv4 } from 'uuid';
import PageLayout from "@/components/patterns/PageLayout/PageLayout";
import { useUser } from "@/contexts/UserContext";
import { useInference } from "@/contexts/InferenceContext";
import { useRouter } from 'next/navigation';

interface Errors {
    name: boolean;
    file: boolean;
}

const UploadFileInferencePage: React.FC = () => {
    const [inferenceName, setInferenceName] = useState<string>("");
    const [errors, setErrors] = useState<Errors>({ name: false, file: false });
    const [errorMessages, setErrorMessages] = useState({ name: '', file: '' });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<string>('');
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [dragging, setDragging] = useState<boolean>(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { userId } = useUser(); 
    const { setInference } = useInference(); 
    const router = useRouter(); 

    const steps = [
        "Uploading your file...",
        "Processing inference...",
        "Trial complete",
    ];

    const handleClick = (eventName: string, callback: () => void) => {
        // You can add tracking here if needed
        callback();
    };

    const createInference = async () => {
        const nameError = inferenceName.trim() === "";
        const fileError = uploadedFile === null;

        setErrors({ name: nameError, file: fileError });

        const errorMsgs: { name: string, file: string } = {
            name: nameError ? 'Inference Name is required.' : '',
            file: fileError ? 'Uploaded file is required.' : '',
        };

        setErrorMessages(errorMsgs);

        if (nameError || fileError) {
            console.error("Form validation errors");
            if (nameError) triggerErrorAnimation("name");
            if (fileError) triggerErrorAnimation("file");
            return;
        }

        const runInference = async (file: string, inferenceName: string) => {
            console.log("file", file);
            console.log("inferenceName", inferenceName);
            const signedUrl = await createSupabaseSignedUrl(file, 300);
            console.log("signedUrl", signedUrl);
            const startedPrediction = await startInference(signedUrl);
            console.log("startedPrediction", startedPrediction);
            const status = await getInferenceStatus(startedPrediction.id);
            console.log("status", status);
            return startedPrediction.id;
        };

        try {
            setIsLoading(true);
            setCurrentStep(0);
            setStatusMessage(steps[0]);

            const fileExtension = uploadedFile.name.split('.').pop();
            const uniqueFilename = `public/${uploadedFile.name.split('.').slice(0, -1).join('.')}-${uuidv4()}.${fileExtension}`;

            const clientUploadResult = await clientSideUpload(uploadedFile as File, uniqueFilename);

            if (!clientUploadResult) {
                throw new Error("Error uploading file");
            }

            setCurrentStep(1);
            setStatusMessage(steps[1]);

            const predictionId = await runInference(clientUploadResult.path, inferenceName);

            const inferenceResult = await getInferenceStatus(predictionId);
            const inferenceData = {
                predictionId: predictionId,
                status: inferenceResult.status,
                output: inferenceResult.output,
                metrics: inferenceResult.metrics
            };

            if (!userId) {
                throw new Error("User ID not found");
            }

            const response = await fetch('/api/saveInference', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, data: inferenceData })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to save inference data');
            }

            const responseData = await response.json();
            const { url } = responseData;

            // Update InferenceContext
            setInference({
                ...inferenceData,
                predictionUrl: url,
                pathToGenotypePhenotypeGraph: '/cachedExamples/example1/genotype_phenotype_clustering.html',
                pathToPhenotypeGraph: '/cachedExamples/example1/phenotype_clustering.html',
            });

            setCurrentStep(2);
            setStatusMessage(steps[2]);

            // Navigate to PredictionsPage using client-side routing
            router.push(`/predictions`);

        }
        catch (error) {
            console.error("Error creating inference", error);
        }
        finally {
            // wait for 2 seconds
            await new Promise(resolve => setTimeout(resolve, 2000));
            setIsLoading(false);
        }
    };

    const triggerErrorAnimation = (field: keyof Errors) => {
        setErrors((prevErrors) => ({ ...prevErrors, [field]: true }));
        setTimeout(() => {
            setErrors((prevErrors) => ({ ...prevErrors, [field]: false }));
        }, 1000);
    };

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedFile(file);
        }
    };

    const handleFileDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        setDragging(false);

        const file = event.dataTransfer.files[0];
        if (file) {
            setUploadedFile(file);
        }
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragging(true);
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragging(false);
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const removeFile = () => {
        setUploadedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleExampleClick = async (exampleNumber: number) => {
        // const exampleUrl = `/cachedExamples/example${exampleNumber}/phenotype_prediction.json`;
        const exampleUrl = `/cachedExamples/example1/phenotype_prediction.json`;

        console.log("exampleUrl", exampleUrl);
        try {
            setIsLoading(true);
            setCurrentStep(0);
            setStatusMessage("Loading example data...");
    
            // Simulate Step 1: Loading example data
            await new Promise(resolve => setTimeout(resolve, 1000));
            setCurrentStep(1);
            setStatusMessage("Processing inference...");
    
            // Simulate Step 2: Processing inference
            await new Promise(resolve => setTimeout(resolve, 3000));
    
            const response = await fetch(exampleUrl);
            console.log("response", response);
            if (!response.ok) {
                throw new Error('Failed to load example data');
            }
    
            const data = await response.json();
            console.log("data", data);
    
            // Generate a unique prediction ID for the example
            const predictionId = `example${exampleNumber}-${uuidv4()}`;
    
            const inferenceData = {
                predictionId: predictionId,
                status: "Completed",
                output: data,
                metrics: {
                    predict_time: 0 // Example data may not have metrics
                },
                predictionUrl: exampleUrl,
                pathToGenotypePhenotypeGraph: '/cachedExamples/example1/genotype_phenotype_clustering.html',
                pathToPhenotypeGraph: '/cachedExamples/example1/phenotype_clustering.html',
            };
    
            // Update InferenceContext
            setInference(inferenceData);
    
            setCurrentStep(2);
            setStatusMessage("Trial complete");
            await new Promise(resolve => setTimeout(resolve, 2500));
    
            // Navigate to PredictionsPage using client-side routing
            router.push(`/predictions`);
            
        } catch (error) {
            console.error("Error loading example data", error);
        } finally {
            // Wait for 1.5 seconds before ending the loading state
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsLoading(false);
        }
    };

    return (
        <PageLayout>
            <div className={styles.centeredContainer}>
                <div className={styles.newInferenceContainer}>
                    <div className={styles.topBar}>
                        <h1>New Trial</h1>
                        {!isLoading && (
                            <Button
                                label="Run"
                                variant="primary"
                                onClick={() => handleClick("Create Inference", createInference)}
                            />
                        )}
                    </div>
                    {isLoading ? (
                        <div className={styles.stepsContainer}>
                            {steps.map((step, index) => (
                                <div key={index} className={styles.step}>
                                    {index < currentStep ? (
                                        <CheckCircle className={styles.checkIcon} />
                                    ) : index === currentStep ? (
                                        index === steps.length - 1 ? (
                                            <CheckCircle className={styles.checkIcon} />
                                        ) : (
                                            <div className={styles.loaderIconContainer}>
                                                <Loader height="20px" width="20px" />
                                            </div>
                                        )
                                    ) : (
                                        <Circle className={styles.circleIcon} />
                                    )}
                                    <span className={styles.stepText}>
                                        {index === currentStep ? statusMessage : step}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.formParent}>
                            <TextInput
                                label="Name"
                                placeholder="Enter trial name"
                                didUpdateText={(text) => setInferenceName(text)}
                                className={errors.name ? styles.errorBorder : ""}
                            />
                            {errors.name && <span className={styles.errorMessage}>{errorMessages.name}</span>}
                            {uploadedFile ? (
                                <div className={styles.uploadedFileContainer}>
                                    <div className={styles.uploadedFileInfo}>
                                        <span className={styles.fileIcon}><File /></span>
                                        <span className={styles.fileName}>{uploadedFile.name}</span>
                                    </div>
                                    <Button icon={<XCircle />} label="Remove" variant="secondary" onClick={() => handleClick("Remove File", removeFile)} />
                                </div>
                            ) : (
                                <div
                                    className={`${styles.uploadMainContainer} ${dragging ? styles.dragging : ""}`}
                                    onDrop={handleFileDrop}
                                    onDragOver={handleDragOver}
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                >
                                    <div className={styles.uploadMainContent}>
                                        <input
                                            type="file"
                                            accept=".h5ad"
                                            onChange={handleFileUpload}
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                        />
                                        <div className={styles.uploadButton}>
                                            <Button icon={<Upload />} label="Choose File" variant="primary" onClick={() => handleClick("Choose File", triggerFileInput)} />
                                        </div>
                                        <span className={styles.uploadTitle}>Upload or drag a document here to start the trial</span>
                                        <span className={styles.uploadSubtitle}>H5AD files are accepted</span>
                                        {errors.file && <span className={styles.errorMessage}>{errorMessages.file}</span>}
                                    </div>
                                </div>
                            )}
                            <h3>Or choose an example file</h3>
                            <div className={styles.exampleFilesContainer}>
                                <div
                                    className={styles.exampleFile}
                                    onClick={() => handleClick("Example 1", () => handleExampleClick(1))}
                                >
                                    <span className={styles.exampleFileIcon}><File size={64} strokeWidth={.5} /></span>
                                    <span className={styles.exampleFileName}>Example 1</span>
                                </div>
                                <div
                                    className={styles.exampleFile}
                                    onClick={() => handleClick("Example 2", () => handleExampleClick(2))}
                                >
                                    <span className={styles.exampleFileIcon}><File size={64} strokeWidth={.5} /></span>
                                    <span className={styles.exampleFileName}>Example 2</span>
                                </div>
                                <div
                                    className={styles.exampleFile}
                                    onClick={() => handleClick("Example 3", () => handleExampleClick(3))}
                                >
                                    <span className={styles.exampleFileIcon}><File size={64} strokeWidth={.5} /></span>
                                    <span className={styles.exampleFileName}>Example 3</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default UploadFileInferencePage;