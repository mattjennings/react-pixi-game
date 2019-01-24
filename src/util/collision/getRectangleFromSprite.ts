import { Rectangle } from './interfaces'

export default function getRectangleFromSprite(sprite: PIXI.Sprite): Rectangle {
  const { x, y, anchor } = sprite
  const hitArea = sprite.hitArea as PIXI.Rectangle

  const xOffset = hitArea ? hitArea.width * anchor.x : 0
  const yOffset = hitArea ? hitArea.height * anchor.y : 0

  return {
    left: x + (hitArea ? hitArea.left : 0) - xOffset,
    right: x + (hitArea ? hitArea.right : 0) - xOffset,
    top: y + (hitArea ? hitArea.top : 0) - yOffset,
    bottom: y + (hitArea ? hitArea.bottom : 0) - yOffset
  }
}
