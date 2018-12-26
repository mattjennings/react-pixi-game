import { Sprite, useApp } from '@inlet/react-pixi'
import keycodes from 'keycodes'
import React, { useRef, useState } from 'react'
import Input from '~components/io/Input'
import usePosition from '~hooks/usePosition'

const PlayerSprite = Sprite as any // get around outdated Sprite prop types
const SPEED = 2

export interface PlayerProps {
  x: number
  y: number
}

function Player(props: PlayerProps) {
  const [spriteRef, setSpriteRef] = useState<PIXI.Sprite>(null)
  const [{ x, y }, setPosition] = usePosition(spriteRef, {
    x: props.x,
    y: props.y
  })

  const bounds = new PIXI.Rectangle(0, 0, 26, 37)
  return (
    <>
      <React.Fragment>
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
      </React.Fragment>
      <PlayerSprite
        ref={setSpriteRef}
        {...props}
        image="images/bunny.png"
        x={x}
        y={y}
        hitArea={bounds}
        anchor={[0.5, 0.5]}
        roundPixels={true}
      />
    </>
  )
}

export default Player
