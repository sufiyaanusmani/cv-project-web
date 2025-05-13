import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Forward the request to the external API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/inpaint/`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to process image' },
        { status: response.status }
      );
    }

    // Get the image data from the response
    const imageBlob = await response.blob();
    
    // Return the image with the correct content type
    return new NextResponse(imageBlob, {
      headers: {
        'Content-Type': imageBlob.type,
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
