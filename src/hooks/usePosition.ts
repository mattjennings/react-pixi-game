import * as PIXI from 'pixi.js'
import { useContext, useState } from 'react'
import { LevelContext } from '~components/levels/Level'

export interface Position {
  x: number
  y: number
}

/**
 * Moves a Sprite inside a level
 */
export default function usePosition(
  spriteRef: PIXI.Sprite,
  initialPosition: Position,
  options: {
    allowOutsideLevel?: boolean
  } = {}
): [Position, (position: Partial<Position>) => void] {
  const { allowOutsideLevel } = options
  const [x, setX] = useState(initialPosition.x)
  const [y, setY] = useState(initialPosition.y)
  const level = useContext(LevelContext)

  function setPosition(position: Partial<Position>) {
    if (!spriteRef) {
      return
    }

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
      setY(nextY)
    }
  }

  return [{ x, y }, setPosition]
}
