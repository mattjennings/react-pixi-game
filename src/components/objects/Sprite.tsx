import { Sprite as PixiSprite } from '@inlet/react-pixi'
import React, { useContext, useRef, useEffect, useState } from 'react'
import { LevelContext } from '~components/levels/Level'
import { CollisionContext } from '~components/system/CollisionProvider'

export interface CollisionData {
  direction: 'left' | 'right' | 'top' | 'bottom'
  x: number
  y: number
  adjustedX: number
  adjustedY: number
}

export interface SpriteProps extends Omit<Partial<PIXI.Sprite>, 'anchor'> {
  spriteRef?: (sprite: PIXI.Sprite) => any
  image?: string
  anchor?: PIXI.ObservablePoint | number[] | number
  roundPixels?: boolean

  collisionSettings?: {
    group: string
    allowOutsideLevel?: boolean
  }

  onCollision?: () => any
}

export default function Sprite(props: SpriteProps) {
  const { x, y, anchor, hitArea, collisionSettings, onCollision } = props
  const spriteRef = useRef<PIXI.Sprite>(null)
  const level = useContext(LevelContext)
  const [bodyId, setBodyId] = useState(null)
  const [box, setBox] = useState(null)
  const collisionContext = useContext(CollisionContext)

  if (collisionSettings && spriteRef.current) {
    // Register the body with CollisionContext
    useEffect(() => {
      const { width, height } = spriteRef.current

      const bodyInfo = collisionContext.registerBody({
        group: collisionSettings.group,
        x: x + width,
        y: y + height,
        width: spriteRef.current.width,
        height: spriteRef.current.height
      })
      setBodyId(bodyInfo.id)
      setBox(bodyInfo.box)
    }, [])

    // Update body in CollisionContext when position changes
    if (bodyId) {
      useEffect(
        () => {
          box.moveTo(x, y)
          collisionContext.updateBody({
            bodyId,
            box
          })
        },
        [x, y]
      )
    }
  }
  return (
    <PixiSprite
      ref={ref => {
        ;(spriteRef as any).current = ref

        if (props.spriteRef) {
          props.spriteRef(ref as any)
        }
      }}
      {...props}
    />
  )
}
