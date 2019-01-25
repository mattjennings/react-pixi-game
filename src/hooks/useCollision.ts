import { useContext, useEffect, useState } from 'react'
import { CollisionContext } from '~components/system/CollisionProvider'

export default function useCollision(args: {
  group: string
  x: number
  y: number
  width: number
  height: number
}) {
  const { x, y, width, height, group } = args

  const collisionContext = useContext(CollisionContext)
  const [bodyId, setBodyId] = useState(null)
  const [box, setBox] = useState(null)

  // Register the body with CollisionContext
  useEffect(() => {
    const bodyInfo = collisionContext.registerBody({
      group,
      x,
      y,
      width,
      height
    })
    setBodyId(bodyInfo.id)
    setBox(bodyInfo.box)
    bodyInfo.box.moveTo(x, y)
    collisionContext.updateBody({
      bodyId: bodyInfo.id,
      box: bodyInfo.box
    })
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

  return { bodyId, box }
}
