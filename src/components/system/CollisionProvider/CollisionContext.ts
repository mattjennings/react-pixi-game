import React from 'react'

export interface CollisionContextValue {
  groups: string[]
  bodies: Record<
    string,
    {
      groupId: string
      box: any
    }
  >

  /**
   * Registers a body to the CollisionContext and returns the id and box
   */
  registerBody: (
    args: { group: string; x: number; y: number; width: number; height: number }
  ) => {
    id: string
    box: any
  }

  /**
   * Updates the body so that the CollisionContext can recalculate the necessary collisions
   */
  updateBody: (args: { bodyId: string; box: any }) => any
}

export default React.createContext<CollisionContextValue>({
  groups: [],
  bodies: {},
  registerBody: () => null,
  updateBody: () => null
})
