import { NextRequest, NextResponse } from 'next/server';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  { params }: { params: { params: string[] } }
) {
  try {
    const { params: pathParams } = params;
    
    if (!pathParams || pathParams.length !== 2) {
      return NextResponse.json(
        { error: 'Invalid path. Expected /api/ml/hsi/figure/{dataset_id}/{image_type}' },
        { status: 400 }
      );
    }

    const [datasetId, imageType] = pathParams;
    
    // Validate dataset_id
    const validDatasetIds = ['1', '2', '6'];
    if (!validDatasetIds.includes(datasetId)) {
      return NextResponse.json(
        { error: 'Invalid dataset_id. Use 1, 2, or 6' },
        { status: 400 }
      );
    }

    // Validate image_type
    const validImageTypes = ['fc', 'gt', 'pr', 'legend'];
    if (!validImageTypes.includes(imageType.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid image_type. Use fc, gt, pr, or legend' },
        { status: 400 }
      );
    }

    // Forward request to ML service
    const response = await fetch(
      `${ML_SERVICE_URL}/hsi/figure/${datasetId}/${imageType}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'image/jpeg',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `ML service error: ${errorText}` },
        { status: response.status }
      );
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    
    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });

  } catch (error) {
    console.error('Error fetching figure image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch figure image' },
      { status: 500 }
    );
  }
}
