import { useContext, useEffect, useState, useRef } from 'react'
import { CollisionContext } from '~components/system/CollisionProvider'
import Crash from 'crash-colliders'
import { getCollidersByGroup } from '~components/system/CollisionProvider/selectors'

export default function useCollision(args: {
  groupId: string

  /**
   * groupIds should trigger collisions
   */
  collidesWith?: string[]

  x: number
  y: number
  width: number
  height: number
  data?: any
  onCollision?: (other, res, cancel) => any
}) {
  const { x, y, width, height, groupId, data, collidesWith, onCollision } = args

  const collisionContext = useContext(CollisionContext)
  const [colliderId, setColliderId] = useState(null)
  const [box, setBox] = useState(undefined)

  const boxRef = useRef(box)

  useEffect(
    () => {
      boxRef.current = box
    },
    [box]
  )

  const collisionContextRef = useRef(collisionContext)

  useEffect(
    () => {
      collisionContextRef.current = collisionContext
    },
    [collisionContext]
  )
  // Register the body with CollisionContext
  useEffect(() => {
    const bodyInfo = collisionContext.registerCollider({
      groupId,
      collidesWith,
      x,
      y,
      width,
      height,
      onCollision
    })

    bodyInfo.box.setData(data)

    setColliderId(bodyInfo.id)
    setBox(bodyInfo.box)
  }, [])

  // update custom data in box
  useEffect(
    () => {
      if (colliderId && box) {
        box.setData(data)
        collisionContext.updateCollider({
          colliderId,
          box
        })
      }
    },
    [data]
  )

  // Update body in CollisionContext when position changes
  useEffect(
    () => {
      if (colliderId) {
        box.moveTo(x, y)
        collisionContext.updateCollider({
          colliderId,
          box
        })
      }
    },
    [x, y]
  )

  return {
    colliderId,
    box,
    /**
     * Returns the response object if collison, returns false if no collision
     */
    isCollidingAt: (pos: { x: number; y: number }, groupId: string) => {
      const box = boxRef.current
      if (!box) {
        return
      }
      const lastPos = { x: box.pos.x, y: box.pos.y }
      const crash = new Crash()
      const colliders = getCollidersByGroup(
        collisionContextRef.current,
        groupId
      )

      crash.insert(box)
      colliders.forEach(collider => {
        crash.insert(collider.box)
      })

      const response = new Crash.Response()

      box.moveTo(pos.x, pos.y)
      crash.testAll(box, response)
      box.moveTo(lastPos.x, lastPos.y)

      return !!response.a && !!response.b && response
    }
  }
}
