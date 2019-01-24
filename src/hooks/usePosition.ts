import { useState } from 'react'

export interface Position {
  x: number
  y: number
}

/**
 * Moves a Sprite inside a level
 */
export default function usePosition(
  initialPosition: Position
): [Position, (position: Partial<Position>) => void] {
  const [x, setX] = useState(initialPosition.x)
  const [y, setY] = useState(initialPosition.y)

  function setPosition(position: Partial<Position>) {
    if (typeof position.x !== 'undefined') {
      setX(position.x)
    }

    if (typeof position.y !== 'undefined') {
      setY(position.y)
    }
  }

  return [{ x, y }, setPosition]
}
