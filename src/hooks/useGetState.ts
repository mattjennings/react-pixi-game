import { useState, useRef, useEffect } from 'react'

/**
 * Guarantees the current value of the state
 *
 * Workaround for https://github.com/facebook/react/issues/14543
 */
export function useGetState<S>(state: S) {
  const stateRef = useRef(state)

  useEffect(
    () => {
      stateRef.current = state
    },
    [state]
  )

  return () => stateRef.current
}
