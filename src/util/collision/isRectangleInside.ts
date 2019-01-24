import { Rectangle } from './interfaces'

export function isRectangleInside(r1: Rectangle, r2: Rectangle) {
  console.log(r1)
  return (
    r1.left >= r2.left &&
    r1.right <= r2.right &&
    r1.top >= r2.top &&
    r1.bottom <= r2.bottom
  )
}
