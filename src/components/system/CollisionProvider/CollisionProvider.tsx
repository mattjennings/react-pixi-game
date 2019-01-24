import Crash from 'crash-colliders'
import React, { useContext, useEffect, useReducer } from 'react'
import { LevelContext } from '~components/levels/Level'
import CollisionContext, { CollisionContextValue } from './CollisionContext'
import { forEach } from 'lodash'

const crash = new Crash()

export default function CollisionProvider(props) {
  const level = useContext(LevelContext)

  // create box for level bounds
  const levelBox = new crash.Box(
    new crash.Vector(0, 0),
    level.width,
    level.height
  )
  crash.insert(levelBox)

  const [contextValue, dispatch] = useReducer<CollisionContextValue, any>(
    reducer,
    {
      groups: ['LEVEL_BOUNDS'],
      bodies: {
        LEVEL: {
          groupId: 'LEVEL_BOUNDS',
          box: levelBox
        }
      },
      registerBody: ({ group, x, y, width, height }) => {
        const bodyId = (Math.random() * 10000).toString() // todo: replace with uuid
        const box = new crash.Box(new crash.Vector(x, y), width, height)
        crash.insert(box)
        dispatch({
          type: ActionTypes.REGISTER_BODY,
          payload: {
            groupId: group,
            bodyId
          }
        })

        return { id: bodyId, box }
      },
      updateBody: ({ bodyId, box }) => {
        dispatch({
          type: ActionTypes.UPDATE_BODY,
          payload: {
            bodyId,
            box
          }
        })
      }
    }
  )

  useEffect(
    () => {
      // todo: calculate collisions

      // simple check if body is inside the bounds
      const boxes = forEach(contextValue.bodies, (body, key) => {
        if (key !== 'LEVEL' && body.box) {
          console.log('inside bounds: ', crash.test(levelBox, body.box))
        }
      })
    },
    [contextValue.bodies]
  )
  return (
    <CollisionContext.Provider value={contextValue}>
      {props.children}
    </CollisionContext.Provider>
  )
}

enum ActionTypes {
  REGISTER_BODY = 'REGISTER_BODY',
  UPDATE_BODY = 'UPDATE_BODY'
}

function reducer(state: CollisionContextValue, action) {
  switch (action.type) {
    case ActionTypes.REGISTER_BODY: {
      const { bodyId, groupId } = action.payload
      return {
        ...state,
        bodies: {
          ...state.bodies,
          [bodyId]: {
            group: groupId
          }
        },
        groups:
          state.groups.indexOf(groupId) === -1
            ? [...state.groups, groupId]
            : state.groups
      }
    }
    case ActionTypes.UPDATE_BODY: {
      const { bodyId, box } = action.payload
      return {
        ...state,
        bodies: {
          ...state.bodies,
          [bodyId]: {
            ...state.bodies[bodyId],
            box
          }
        }
      }
    }
  }

  return state
}
