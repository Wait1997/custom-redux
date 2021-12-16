import React from 'react'

export const appContext = React.createContext(null)

export const Provider = ({ store, children }) => {
  return <appContext.Provider value={store}>{children}</appContext.Provider>
}
