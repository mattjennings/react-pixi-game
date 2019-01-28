import React from 'react'
import useCollision from '~hooks/useCollision'
import { Sprite } from '@inlet/react-pixi'
import usePosition from '~hooks/usePosition'

export default function Block(props: { x: number; y: number }) {
  const [{ x, y }, setPosition] = usePosition({ x: props.x, y: props.y })

  useCollision({
    groupId: 'ground',
    x: props.x,
    y: props.y,
    width: 70,
    height: 70
  })

  return <Sprite image="images/block.png" x={x} y={y} />
}
