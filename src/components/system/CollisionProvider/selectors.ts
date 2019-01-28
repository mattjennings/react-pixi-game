import { CollisionContextValue } from './CollisionContext'
import { filter } from 'lodash'

export const getCollidersByGroup = (
  context: CollisionContextValue,
  groupId: string
) => {
  return filter(context.colliders, collider => collider.groupId === groupId)
}
