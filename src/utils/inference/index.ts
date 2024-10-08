"use server";
import Replicate from "replicate";
import { InferencePayload } from "@/types/inference";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});



export const startReplicateInference = async (inferencePayload: InferencePayload) => {
    console.log("in startInference");
  
    console.log(inferencePayload)
    // Set default values if not provided
    const { inputPath, taskName, maxCells = 2000, batchSize = 1 } = inferencePayload;

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

    console.log("reformattedPayload", reformattedPayload);

    let prediction = await replicate.predictions.create({
        model: process.env.REPLICATE_MODEL_NAME as string,
        version: process.env.REPLICATE_MODEL_VERSION as string,
        input: reformattedPayload,
    });

    // let prediction = await replicate.run(
    //     `${process.env.REPLICATE_ACCOUNT_ID}/${process.env.REPLICATE_MODEL_NAME}:${process.env.REPLICATE_MODEL_VERSION}`,
    //     {
    //         input: reformattedPayload,
    //     }
    // )

    console.log("prediction", prediction);
    console.log("typeof prediction", typeof prediction);
    
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

