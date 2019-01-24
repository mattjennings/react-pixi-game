import * as PIXI from 'pixi.js'
import { useContext, useState } from 'react'
import { LevelContext } from '~components/levels/Level'
import getRectangleFromSprite from '~util/collision/getRectangleFromSprite'
import { isRectangleInside } from '~util/collision/isRectangleInside'
import usePosition, { Position } from './usePosition'

export interface CollisionResponse {
  collision: boolean
  adjustedX?: number
  adjustedY?: number
}

export default function useSpriteCollision(
  sprite: PIXI.Sprite,
  position: Position,
  options: {
    allowOutsideLevel?: boolean
  } = {}
) {
  const { allowOutsideLevel } = options
  const level = useContext(LevelContext)

  const updatedSprite = { ...sprite, ...position } as PIXI.Sprite
  Object.setPrototypeOf(updatedSprite, PIXI.Sprite.prototype)
  if (!allowOutsideLevel) {
    const collision = !isRectangleInside(
      getRectangleFromSprite(updatedSprite),
      {
        left: 0,
        right: level.width,
        top: 0,
        bottom: level.height
      }
    )

    if (collision) {
      return { collision: true }
    }
  }

  return { collision: false }
}
