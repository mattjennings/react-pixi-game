import keycodes from 'keycodes'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import Input from '~components/io/Input'
import useCollision from '~hooks/useCollision'
import usePosition from '~hooks/usePosition'
import { Sprite, useTick } from '@inlet/react-pixi'
import { useGetState } from '~hooks/useGetState'

// import useLoop from '~hooks/useLoop'
const SPEED = 1.5
const GRAVITY = 0.25
const MAX_VELOCITY = {
  x: 10,
  y: 6
}
const JUMP_VELOCITY = -5

export interface PlayerProps {
  x: number
  y: number
}

const controls = {
  LEFT: keycodes('left'),
  RIGHT: keycodes('right'),
  UP: keycodes('up'),
  DOWN: keycodes('down'),
  JUMP: keycodes('space')
}

function Player(props: PlayerProps) {
  const [health, setHealth] = useState(100)
  const [{ x, y }, setPosition] = usePosition({ x: props.x, y: props.y })
  const [velocity, setVelocity] = usePosition({ x: 0, y: 0 })

  const getVelocity = useGetState(velocity)
  const getPosition = useGetState({ x, y })

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

  // gravity
  useTick(() => {
    const velocity = getVelocity()
    if (velocity.y < MAX_VELOCITY.y) {
      setVelocity({
        x: velocity.x,
        y: velocity.y + GRAVITY
      })
    }
  })

  // apply velocity to position if no collision
  useTick(delta => {
    const velocity = getVelocity()
    const { x, y } = getPosition()
    const velocityDelta = {
      x: velocity.x * delta,
      y: velocity.y * delta
    }

    const newPos = { x: x + velocityDelta.x, y: y + velocityDelta.y }

    const collision = isCollidingAt(newPos, 'ground')

    if (!collision) {
      setPosition(newPos)
    } else {
      if (collision.overlapV.y && velocityDelta.y > 0) {
        setVelocity({ x: velocity.x, y: 0 })
      }
      setPosition({
        x: newPos.x - collision.overlapV.x,
        y: newPos.y - collision.overlapV.y
      })
    }
  })

  const onInputDown = (keycode: string) => (delta: number) => {
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
    }
  }

  const onInputPress = (keycode: string) => (delta: number) => {
    switch (keycode) {
      case controls.JUMP: {
        const velocity = getVelocity()
        if (isCollidingAt({ x, y: y + 1 }, 'ground')) {
          setVelocity({ ...velocity, y: JUMP_VELOCITY })
        }
        return
      }
    }
  }

  const onInputRelease = (keycode: string) => (delta: number) => {
    switch (keycode) {
      case controls.JUMP: {
        const velocity = getVelocity()
        if (!isCollidingAt({ x, y: y + 1 }, 'ground') && velocity.y < 0) {
          setVelocity({ ...velocity, y: 0 })
        }
        return
      }
    }
  }

  return (
    <>
      <Input keyCode={controls.LEFT} onDown={onInputDown(controls.LEFT)} />
      <Input keyCode={controls.RIGHT} onDown={onInputDown(controls.RIGHT)} />
      <Input keyCode={controls.UP} onDown={onInputDown(controls.UP)} />
      <Input keyCode={controls.DOWN} onDown={onInputDown(controls.DOWN)} />
      <Input
        keyCode={controls.JUMP}
        onPress={onInputPress(controls.JUMP)}
        onRelease={onInputRelease(controls.JUMP)}
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
