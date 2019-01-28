import { useState, useRef, useEffect } from 'react'

export function usePersistentState<S>(
  initialState: S | (() => S)
): [S, React.Dispatch<React.SetStateAction<S>>] {
  const [value, setValue] = useState(initialState)

  const valueRef = useRef(value)

  useEffect(
    () => {
      valueRef.current = value
    },
    [value]
  )

  return [
    valueRef.current,
    state => {
      setValue(state)
    }
  ]
}
