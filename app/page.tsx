'use client'

import { useState } from 'react'
import Image from 'next/image'

const styles = {
  'anime': 'In the style of anime, vibrant colors, detailed backgrounds',
  'realistic': 'Photorealistic, highly detailed, natural lighting',
  'abstract': 'Abstract art style, bold colors, geometric shapes',
  'fantasy': 'Fantasy art style, magical atmosphere, ethereal lighting',
  'sci-fi': 'Science fiction style, futuristic elements, high-tech environment'
}

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('anime')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)

  const generateWallpaper = async () => {
    setLoading(true)
    const response = await fetch('/api/wallpaper', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `${prompt}, ${styles[style as keyof typeof styles]}`,
      }),
    })

    if (response.ok) {
      const blob = await response.blob()
      setImage(URL.createObjectURL(blob))
    } else {
      console.error('Failed to generate wallpaper')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">AI Wallpaper Generator</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex flex-col">
                  <label className="leading-loose">Prompt</label>
                  <input
                    type="text"
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="Describe your wallpaper"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose">Style</label>
                  <select
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                  >
                    {Object.keys(styles).map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="pt-4 flex items-center space-x-4">
                  <button
                    className="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                    onClick={generateWallpaper}
                    disabled={loading}
                  >
                    {loading ? 'Generating...' : 'Generate Wallpaper'}
                  </button>
                </div>
              </div>
            </div>
            {image && (
              <div className="mt-8">
                <Image src={image} alt="Generated Wallpaper" width={400} height={400} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}