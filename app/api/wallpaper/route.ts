import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: Request) {
  const { prompt } = await request.json()

  const payload = {
    prompt: prompt,
    output_format: "jpeg"
  }

  try {
    const response = await axios.postForm(
      `https://api.stability.ai/v2beta/stable-image/generate/sd3`,
      axios.toFormData(payload),
      {
        validateStatus: undefined,
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "image/*"
        },
      }
    )

    if (response.status === 200) {
      return new NextResponse(response.data, {
        status: 200,
        headers: {
          'Content-Type': 'image/jpeg',
        },
      })
    } else {
      return new NextResponse(JSON.stringify({ error: 'Failed to generate image' }), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  } catch (error) {
    console.error('Error:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}