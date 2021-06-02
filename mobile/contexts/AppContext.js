import {createContext} from 'react'

const AppContext = createContext({})

export default AppContext

// const AppProvider = ({children}) => {
//   const [access, setAccess] = useState('')
//   const [refresh, setRefresh] = useState('')

//   return (
//     <AppContext.Provider
//       value={{
//         access,
//         setAccess,
//         refresh,
//         setRefresh,
//       }}
//     >
//       {Children.map(children, child => {
//         return cloneElement(child, {access})
//       })}
//     </AppContext.Provider>
//   )
// }

// export {AppContext, AppProvider}
