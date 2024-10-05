import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/auth/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    const supabase = createClient();
    const body = await request.json();

    const userId = body.userId;
    const data = body.data;

    if (!userId || !data) {
        return NextResponse.json({ error: 'Missing userId or data' }, { status: 400 });
    }

    const filename = `cachedExamples/${userId}/phenotype_prediction_${uuidv4()}.json`;
    const jsonData = JSON.stringify(data, null, 2);

    const { error } = await supabase.storage
        .from('uploads') // Replace with your Supabase bucket name
        .upload(filename, new Blob([jsonData], { type: 'application/json' }), {
            cacheControl: '3600',
            upsert: true
        });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: signedUrl, error: urlError } = await supabase.storage
        .from('uploads')
        .createSignedUrl(filename, 60 * 60); // URL valid for 1 hour

    if (urlError) {
        return NextResponse.json({ error: urlError.message }, { status: 500 });
    }

    return NextResponse.json({ url: signedUrl.signedUrl }, { status: 200 });
}