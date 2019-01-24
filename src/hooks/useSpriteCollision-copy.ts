import * as PIXI from 'pixi.js'
import { useContext, useState } from 'react'
import { LevelContext } from '~components/levels/Level'
import usePosition, { Position } from './usePosition'

export interface CollisionResponse {
  collision: boolean
  adjustedX?: number
  adjustedY?: number
}

export default function useSpriteCollision(
  spriteRef: PIXI.Sprite,
  position: Position,
  options: {
    allowOutsideLevel?: boolean
  } = {}
) {
  const { allowOutsideLevel } = options
  const [x, setX] = useState(position.x)
  const [y, setY] = useState(position.y)
  const [prevX, setPrevX] = useState(position.x)
  const [prevY, setPrevY] = useState(position.y)
  const level = useContext(LevelContext)

  function setPosition(position: Partial<Position>) {
    const { anchor } = spriteRef
    const hitArea = spriteRef.hitArea as PIXI.Rectangle
    if (typeof position.x !== 'undefined') {
      let nextX = position.x

      if (!allowOutsideLevel) {
        const isMovingLeft = x - position.x > 0
        const isMovingRight = x - position.x < 0
        const xOffset = hitArea ? hitArea.width * anchor.x : 0
        const right = position.x + (hitArea ? hitArea.right : 0) - xOffset
        const left = position.x + (hitArea ? hitArea.left : 0) - xOffset

        // left side of level
        if (isMovingLeft && left <= 0) {
          nextX = position.x - left
        }

        // right side of level
        if (isMovingRight && right >= level.width) {
          nextX = level.width - (right - position.x)
        }
      }

      setPrevX(x)
      setX(nextX)
    }

    if (typeof position.y !== 'undefined') {
      let nextY = position.y

      if (!allowOutsideLevel) {
        const isMovingUp = y - position.y > 0
        const isMovingDown = y - position.y < 0
        const yOffset = hitArea ? hitArea.height * anchor.y : 0
        const top = position.y + (hitArea ? hitArea.top : 0) - yOffset
        const bottom = position.y + (hitArea ? hitArea.bottom : 0) - yOffset

        // top of level
        if (isMovingUp && top <= 0) {
          nextY = position.y - top
        }

        // bottom of level
        if (isMovingDown && bottom >= level.height) {
          nextY = level.height - (bottom - position.y)
        }
      }
      setPrevY(y)
      setY(nextY)
    }
  }

  return { collision: false }
}
