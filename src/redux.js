import React, { useState, useContext, useEffect, useMemo } from 'react'

export const appContext = React.createContext(null)

export const store = {
  state: {
    user: { name: 'frank', age: 18 },
    grour: { name: '前端组' }
  },
  setState(newState) {
    store.state = newState
    store.listeners.map((fn) => fn(store.state))
  },
  listeners: [],
  subscribe(fn) {
    store.listeners.push(fn)
    return () => {
      const index = store.listeners.indexOf(fn)
      store.listeners.splice(index, 1)
    }
  }
}

const reducer = (state, { type, payload }) => {
  if (type === 'updateUser') {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload
      }
    }
  } else {
    return state
  }
}

const changed = (oldState, newState) => {
  let changed = false
  for (const key in oldState) {
    if (oldState[key] !== newState[key]) {
      changed = true
    }
  }
  return changed
}

export const connect = (selector) => (Component) => {
  return (props) => {
    const { state, setState } = useContext(appContext)

    // forceUpdate强制更新组件
    const [, update] = useState({})

    const data = useMemo(() => {
      return selector ? selector(state) : { state }
    }, [state])

    useEffect(() => {
      return store.subscribe(() => {
        const newData = selector ? selector(store.state) : { state: store.state }
        if (changed(data, newData)) {
          update({})
        }
      })
      // 这里最好 取消订阅 否则在 selector 变化时会出现重复订阅
    }, [data])

    const dispatch = (action) => {
      setState(reducer(state, action))
    }

    return <Component {...props} {...data} dispatch={dispatch} />
  }
}
