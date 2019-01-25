import keycodes from 'keycodes'
import React, { useState } from 'react'
import Input from '~components/io/Input'
import useCollision from '~hooks/useCollision'
import usePosition from '~hooks/usePosition'
import { Sprite } from '@inlet/react-pixi'

const SPEED = 2
const GRAVITY = 0.5
const JUMP = 2

export interface PlayerProps {
  x: number
  y: number
}

function Player(props: PlayerProps) {
  const [{ x, y }, setPosition] = usePosition({
    x: props.x,
    y: props.y
  })

  const { box, bodyId } = useCollision({
    group: 'player',
    x,
    y,
    width: 26,
    height: 37
  })

  return (
    <>
      <Input
        keyCode={keycodes('left')}
        onDown={delta => {
          setPosition({ x: x - SPEED * delta })
        }}
      />
      <Input
        keyCode={keycodes('right')}
        onDown={delta => {
          setPosition({ x: x + SPEED * delta })
        }}
      />
      <Input
        keyCode={keycodes('up')}
        onDown={delta => {
          setPosition({ y: y - SPEED * delta })
        }}
      />
      <Input
        keyCode={keycodes('down')}
        onDown={delta => {
          setPosition({ y: y + SPEED * delta })
        }}
      />
      <Sprite
        {...props}
        image="images/bunny.png"
        x={x}
        y={y}
        roundPixels={true}
      />
    </>
  )
}

export default Player
