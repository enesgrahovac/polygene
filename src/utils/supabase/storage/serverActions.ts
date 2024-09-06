'use server'
import { createClient } from '@/utils/supabase/auth/server';
import { v4 as uuidv4 } from 'uuid';

export const createSupabaseSignedUrl = async (fileName: string, timeLimit: number=60) => {
    const supabase = createClient();
    

    const { data, error } = await supabase.storage
        .from('user-files-upload')
        .createSignedUrl(fileName, timeLimit)

    if (error) {
        throw error
    }

    const signedUrl = data.signedUrl
    return signedUrl
}

// This could be placed in a utility file where you handle API interactions.
export async function serverSideUpload(file: File, uploadPath:string): Promise<any> {
    if (!file) {
        alert('No file selected');
        return null;
    }

    const supabase = createClient();

    
    try {
        const { data, error } = await supabase.storage
            .from('user-files-upload') // Your bucket name
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