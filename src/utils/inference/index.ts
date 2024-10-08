"use server";
import Replicate from "replicate";
import { InferencePayload } from "@/types/inference";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

type ModelVersionResponse = {
    next: string | null;
    previous: string | null;
    results: ModelVersion[];
};

type ModelVersion = {
    id: string;
    created_at: string;
    cog_version: string;
    openapi_schema: object;
    
};

const getLatestModelVersion = async (modelOwner: string, modelName: string) => {
    const modelResults: ModelVersionResponse = await replicate.models.versions.list(modelOwner, modelName) as unknown as ModelVersionResponse;

    const models = modelResults.results;
    // Sort models by created_at in descending order
    models.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Select the latest model based on created_at
    const latestModel = models[0];
    return latestModel?.id;
}

export const startReplicateInference = async (inferencePayload: InferencePayload) => {

    // Set default values if not provided
    const { inputPath, taskName, maxCells = 8, batchSize = 2 } = inferencePayload;

    // Add validation for required fields
    if (!inputPath || !taskName) {
        throw new Error("inputPath and taskName are required fields.");
    }

    const reformattedPayload = {
        input_path: inputPath,
        task: taskName,
        max_cells: maxCells,
        batch_size: batchSize,
    };


    const latestModelVersion = await getLatestModelVersion(process.env.REPLICATE_ACCOUNT_ID as string, process.env.REPLICATE_MODEL_NAME as string);

    let prediction = await replicate.predictions.create({
        model: process.env.REPLICATE_MODEL_NAME,
        version: latestModelVersion,
        input: reformattedPayload,
    });

    // let prediction = await replicate.run(
    //     `${process.env.REPLICATE_ACCOUNT_ID}/${process.env.REPLICATE_MODEL_NAME}:${process.env.REPLICATE_MODEL_VERSION}`,
    //     {
    //         input: reformattedPayload,
    //     }
    // )



    return prediction;
}

export const getReplicateInferenceStatus = async (predictionId: string) => {
    let prediction = await replicate.predictions.get(predictionId);
    return prediction;
}

export const cancelReplicateInference = async (predictionId: string) => {
    const response = await replicate.predictions.cancel(predictionId);
    return response;
}

