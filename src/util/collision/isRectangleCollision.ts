import { Rectangle } from './interfaces'

export default function isRectangleCollision(r1: Rectangle, r2: Rectangle) {
  return !(
    r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top
  )
}
