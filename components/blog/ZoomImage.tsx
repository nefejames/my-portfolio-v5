'use client'

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import type { ReactNode } from 'react'

export default function ZoomImage({ children }: { children: ReactNode }) {
  return <Zoom zoomMargin={24}>{children}</Zoom>
}
