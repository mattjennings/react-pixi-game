import keycodes from 'keycodes'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import Input from '~components/io/Input'
import useCollision from '~hooks/useCollision'
import usePosition from '~hooks/usePosition'
import { Sprite } from '@inlet/react-pixi'
import crash from '~util/crash'

const SPEED = 2
const GRAVITY = 0.5
const JUMP = 2

export interface PlayerProps {
  x: number
  y: number
}

const controls = {
  LEFT: keycodes('left'),
  RIGHT: keycodes('right'),
  UP: keycodes('up'),
  DOWN: keycodes('down')
}

function Player(props: PlayerProps) {
  const [health, setHealth] = useState(100)
  const [{ x, y }, setPosition] = usePosition({ x: props.x, y: props.y })

  const posRef = useRef({ x, y })

  useEffect(
    () => {
      posRef.current = { x, y }
    },
    [x, y]
  )

  const { box, isCollidingAt } = useCollision({
    groupId: 'player',
    collidesWith: ['ground'],
    x,
    y,
    width: 26,
    height: 37,
    data: {
      health
    }
  })

  const onInput = (keycode: string) => (delta: number) => {
    switch (keycode) {
      case controls.LEFT: {
        const newPos = { x: x - SPEED * delta, y }
        const collisionRes = isCollidingAt(newPos, 'ground')
        if (!collisionRes) {
          setPosition({ x: x - SPEED * delta })
        } else {
          const xDif = newPos.x - collisionRes.overlapV.x
          setPosition({ x: xDif })
        }
        return
      }
      case controls.RIGHT: {
        const newPos = { x: x + SPEED * delta, y }
        const collisionRes = isCollidingAt(newPos, 'ground')
        if (!collisionRes) {
          setPosition(newPos)
        } else {
          const xDif = newPos.x - collisionRes.overlapV.x
          setPosition({ x: xDif })
        }
        return
      }
      case controls.UP: {
        const newPos = { x, y: y - SPEED * delta }
        const collisionRes = isCollidingAt(newPos, 'ground')
        if (!collisionRes) {
          setPosition(newPos)
        } else {
          const yDif = newPos.y - collisionRes.overlapV.y
          setPosition({ y: yDif })
        }
        return
      }
      case controls.DOWN: {
        const newPos = { x, y: y + SPEED * delta }
        const collisionRes = isCollidingAt(newPos, 'ground')
        if (!collisionRes) {
          setPosition(newPos)
        } else {
          const yDif = newPos.y - collisionRes.overlapV.y
          setPosition({ y: yDif })
        }
        return
      }
    }
  }

  return (
    <>
      <Input keyCode={controls.LEFT} onDown={onInput(controls.LEFT)} />
      <Input keyCode={controls.RIGHT} onDown={onInput(controls.RIGHT)} />
      <Input keyCode={controls.UP} onDown={onInput(controls.UP)} />
      <Input keyCode={controls.DOWN} onDown={onInput(controls.DOWN)} />
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
