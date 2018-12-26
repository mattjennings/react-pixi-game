import { useApp, withPixiApp } from '@inlet/react-pixi'
import React, { InputIdentityList, useEffect, useState } from 'react'

export interface InputProps {
  keyCode: number
  onPress?: () => any
  onRelease?: () => any
  onDown?: (delta: number) => any
  onUp?: (delta: number) => any
}

export interface InputPropsWithInjections extends InputProps {
  app: any
}

export interface InputState {
  isDown: boolean
  isUp: boolean
}

class Input extends React.Component<InputPropsWithInjections, InputState> {
  public upListener
  public downListener

  public state = {
    isDown: false,
    isUp: true
  }

  constructor(props: InputPropsWithInjections) {
    super(props)

    props.app.ticker.add(this.loop, this)
  }

  public loop(delta: number) {
    const { onDown, onUp } = this.props
    const { isDown, isUp } = this.state
    if (isDown && onDown) {
      onDown(delta)
    }

    if (isUp && onUp) {
      onUp(delta)
    }
  }

  public componentWillMount() {
    this.downListener = (event: KeyboardEvent) => {
      const { keyCode, onPress } = this.props
      const { isUp } = this.state

      if (event.keyCode === keyCode) {
        if (isUp && onPress) {
          onPress()
        }
        this.setState({
          isDown: true,
          isUp: false
        })
        event.preventDefault()
      }
    }

    this.upListener = (event: KeyboardEvent) => {
      const { keyCode, onRelease } = this.props
      const { isDown } = this.state

      if (event.keyCode === keyCode) {
        if (isDown && onRelease) {
          onRelease()
        }
        this.setState({
          isDown: false,
          isUp: true
        })
        event.preventDefault()
      }
    }

    window.addEventListener('keydown', this.downListener, false)
    window.addEventListener('keyup', this.upListener, false)
  }

  public componentWillUnmount() {
    window.removeEventListener('keydown', this.downListener)
    window.removeEventListener('keyup', this.upListener)
    this.props.app.ticker.remove(this.loop, this)
  }

  public render() {
    return null
  }
}

export default withPixiApp(Input) as React.ComponentType<InputProps>

// implementation with hooks - causes memory leak / internal state reference issues with useLoop/useTick
// export default function Input({
//   keyCode,
//   onPress,
//   onRelease,
//   onDown,
//   onUp
// }: {
//   keyCode: number
//   onPress?: () => any
//   onRelease?: () => any
//   onDown?: (delta: number) => any
//   onUp?: (delta: number) => any
// }) {
//   const [isUp, setIsUp] = useState(false)
//   const [isDown, setIsDown] = useState(false)

//   useLoop(delta => {
//     if (isDown && onDown) {
//       onDown(delta)
//     }

//     if (isUp && onUp) {
//       onUp(delta)
//     }
//   })

//   useEffect(() => {
//     const downListener = (event: KeyboardEvent) => {
//       if (event.keyCode === keyCode) {
//         if (isUp && onPress) {
//           onPress()
//         }
//         setIsDown(true)
//         setIsUp(false)
//         event.preventDefault()
//       }
//     }

//     const upListener = (event: KeyboardEvent) => {
//       if (event.keyCode === keyCode) {
//         if (isDown && onRelease) {
//           onRelease()
//         }
//         setIsDown(false)
//         setIsUp(true)
//         event.preventDefault()
//       }
//     }

//     window.addEventListener('keydown', downListener, false)
//     window.addEventListener('keyup', upListener, false)

//     return () => {
//       window.removeEventListener('keydown', downListener)
//       window.removeEventListener('keyup', upListener)
//     }
//   }, [])

//   return null
// }
