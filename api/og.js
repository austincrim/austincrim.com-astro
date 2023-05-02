import { ImageResponse } from '@vercel/og'

export const config = {
  runtime: 'edge'
}

export default function (req, res) {
  return new ImageResponse(
    { type: 'div', props: { children: 'hello world' } },
    {
      debug: true,
      width: 1200,
      height: 630
    }
  )
}
