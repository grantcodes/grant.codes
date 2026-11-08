import React, { useContext, createContext } from 'react'

const defaultState = {
  isAdmin: false,
  previewMode: false,
}

const Context = createContext(null)

const Provider = ({ children, data: initialData = {} }) => {
  const data = Object.assign({}, defaultState, initialData)
  return <Context.Provider value={data}>{children}</Context.Provider>
}

const useAppContext = () => {
  const context = useContext(Context)
  return context
}

export { Provider }
export default useAppContext
