import keycodes from 'keycodes'
import React, { useRef, useState } from 'react'
import Input from '~components/io/Input'
import usePosition from '~hooks/usePosition'
import useSpriteCollision from '~hooks/useSpriteCollision'
import isRectangleCollision from '~util/collision/isRectangleCollision'
import Sprite from '../Sprite'

const SPEED = 2
const GRAVITY = 0.5
const JUMP = 2

export interface PlayerProps {
  x: number
  y: number
}

function Player(props: PlayerProps) {
  const [sprite, setSprite] = useState<PIXI.Sprite>(null)
  const [{ x, y }, setPosition] = usePosition({
    x: props.x,
    y: props.y
  })

  const bounds = new PIXI.Rectangle(0, 0, 26, 37)

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
        spriteRef={ref => {
          if (ref && !sprite) {
            setSprite(ref)
          }
        }}
        x={x}
        y={y}
        hitArea={bounds}
        anchor={[0, 1]}
        roundPixels={true}
        collisionSettings={{
          group: '',
          allowOutsideLevel: false
        }}
      />
    </>
  )
}

export default Player
