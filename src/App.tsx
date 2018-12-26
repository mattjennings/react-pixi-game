import { Container, Sprite, Stage } from '@inlet/react-pixi'
import React from 'react'
import Level from '~components/levels/Level'
import Player from './components/objects/Player'

const App = () => (
  <Stage width={400} height={225}>
    <Level width={400} height={225}>
      <Player x={300} y={100} />
    </Level>
  </Stage>
)

export default App
