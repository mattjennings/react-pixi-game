import React, { useContext, useEffect, useReducer } from 'react'
import { LevelContext } from '~components/levels/Level'
import CollisionContext, { CollisionContextValue } from './CollisionContext'
import { forEach, filter } from 'lodash'
import useLoop from '~hooks/useLoop'
import crash from '~util/crash'

export default function CollisionProvider(props) {
  const [contextValue, dispatch] = useReducer<CollisionContextValue, any>(
    reducer,
    {
      groups: [],
      colliders: {},
      registerCollider: ({
        groupId,
        collidesWith,
        x,
        y,
        width,
        height,
        onCollision
      }) => {
        const colliderId = (Math.random() * 10000).toString() // todo: replace with uuid
        const box = new crash.Box(new crash.Vector(x, y), width, height)

        // this is not a crash feature, but should be safe to do
        box.groupId = groupId
        box.collidesWith = collidesWith

        crash.insert(box)

        if (onCollision) {
          crash.onCollision((a, b, res, cancel) => {
            const aCollidesWith = a.collidesWith || []
            const bCollidesWith = b.collidesWith || []

            // if collision doesn't involve this box, ignore
            if (a.sat !== box.sat && b.sat !== box.sat) {
              return
            }

            if (
              aCollidesWith.indexOf(b.groupId) === -1 &&
              bCollidesWith.indexOf(a.groupId) === -1
            ) {
              return
            }

            onCollision(b, res, cancel)
          })
        }

        dispatch({
          type: ActionTypes.REGISTER_COLLIDER,
          payload: {
            groupId,
            colliderId,
            box
          }
        })

        return { id: colliderId, box }
      },
      updateCollider: ({ colliderId, box }) => {
        dispatch({
          type: ActionTypes.UPDATE_COLLIDER,
          payload: {
            colliderId,
            box
          }
        })
      }
    }
  )

  // useLoop(delta => {
  //   crash.check()
  // })

  return (
    <CollisionContext.Provider value={contextValue}>
      {props.children}
    </CollisionContext.Provider>
  )
}

enum ActionTypes {
  REGISTER_COLLIDER = 'REGISTER_COLLIDER',
  UPDATE_COLLIDER = 'UPDATE_COLLIDER'
}

function reducer(state: CollisionContextValue, action) {
  switch (action.type) {
    case ActionTypes.REGISTER_COLLIDER: {
      const { colliderId, groupId, box } = action.payload

      return {
        ...state,
        colliders: {
          ...state.colliders,
          [colliderId]: {
            groupId,
            box
          }
        },
        groups:
          state.groups.indexOf(groupId) === -1
            ? [...state.groups, groupId]
            : state.groups
      }
    }
    case ActionTypes.UPDATE_COLLIDER: {
      const { colliderId, box } = action.payload
      return {
        ...state,
        colliders: {
          ...state.colliders,
          [colliderId]: {
            ...state.colliders[colliderId],
            box
          }
        }
      }
    }
  }

  return state
}
