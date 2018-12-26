import { Container, Sprite, Stage } from '@inlet/react-pixi'
import React from 'react'

export interface LevelProps {
  width: number
  height: number
  children?: React.ReactNode
}

export const LevelContext = React.createContext<LevelProps>({
  width: null,
  height: null,
  children: null
})

export default function Level(props: LevelProps) {
  return (
    <LevelContext.Provider value={props}>
      <Container {...props}>{props.children}</Container>
    </LevelContext.Provider>
  )
}
