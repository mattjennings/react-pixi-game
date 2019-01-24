import getRectangleFromSprite from './getRectangleFromSprite'
import isRectangleCollision from './isRectangleCollision'

export default function isSpriteCollision(s2: PIXI.Sprite, s1: PIXI.Sprite) {
  return isRectangleCollision(
    getRectangleFromSprite(s1),
    getRectangleFromSprite(s2)
  )
}
