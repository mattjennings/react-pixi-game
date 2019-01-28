import { Container, Sprite, Stage } from '@inlet/react-pixi'
import React from 'react'
import Level from '~components/levels/Level'
import Player from './components/objects/Player'
import { CollisionProvider } from '~components/system/CollisionProvider'
import Block from '~components/objects/Block'

const App = () => (
  <Stage width={400} height={225}>
    <Level width={400} height={225}>
      <CollisionProvider>
        <Player x={300} y={100} />
        <Block x={200} y={100} />
      </CollisionProvider>
    </Level>
  </Stage>
)

export default App
