import { ImageResponse } from '@vercel/og'
import { html } from 'satori-html'

export const config = {
  runtime: 'edge'
}

export default function (req, res) {
  return new ImageResponse(html`<div tw="bg-indigo-500">foo bar</div>`)
}
