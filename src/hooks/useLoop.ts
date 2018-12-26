import { useApp } from '@inlet/react-pixi'
import { InputIdentityList, useEffect } from 'react'

// enhanced version of react-pixi's useTick
export default function useLoop(fn: (delta: number) => any, inputs?: InputIdentityList) {
  const app = useApp()
  useEffect(() => {
    app.ticker.add(fn)
    return () => app.ticker.remove(fn)
  }, inputs)
}
