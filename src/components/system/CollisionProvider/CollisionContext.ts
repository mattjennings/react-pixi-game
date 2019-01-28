import React from 'react'

export interface CollisionContextValue {
  groups: string[]
  colliders: Record<
    string,
    {
      groupId: string
      box: any
    }
  >
  /**
   * Registers a body to the CollisionContext and returns the id and box
   */
  registerCollider: (
    args: {
      groupId: string
      collidesWith?: string[]
      x: number
      y: number
      width: number
      height: number
      onCollision?: (other, res, cancel) => any
    }
  ) => {
    id: string
    box: any
  }

  /**
   * Updates the body so that the CollisionContext can recalculate the necessary collisions
   */
  updateCollider: (
    args: {
      colliderId: string
      box: any
    }
  ) => any
}

export default React.createContext<CollisionContextValue>({
  groups: [],
  colliders: {},
  registerCollider: () => null,
  updateCollider: () => null
})
