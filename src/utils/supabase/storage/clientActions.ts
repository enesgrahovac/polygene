"use client"
import { createClient } from '@/utils/supabase/auth/client';

export const createSupabaseSignedUrl = async (fileName: string, timeLimit: number=60) => {
    const supabase = createClient();
    

    const { data, error } = await supabase.storage
        .from('uploads')
        .createSignedUrl(fileName, timeLimit)

    if (error) {
        throw error
    }

    const signedUrl = data.signedUrl
    return signedUrl
}

export const downloadFileFromSupabase = async (fileName: string): Promise<Blob | null> => {
    const supabase = createClient();

    const { data, error } = await supabase.storage
        .from('uploads')
        .download(fileName);

    if (error) {
        console.error('Download failed:', error);
        return null;
    }

    return data;
}


// This could be placed in a utility file where you handle API interactions.
export async function clientSideUpload(file: File, uploadPath:string): Promise<{
    id: string;
    path: string;
    fullPath: string;
} | null > {
    if (!file) {
        alert('No file selected');
        return null;
    }

    const supabase = createClient();

    try {
        
        const { data, error } = await supabase.storage
            .from('uploads')
            .upload(uploadPath, file, {
                contentType: file.type || 'application/octet-stream',  // Use default MIME type if null
                upsert: false
            });

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Upload failed:', error);
        return null;
    }
}