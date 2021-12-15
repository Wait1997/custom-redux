import { appContext, store, connect } from './redux'

export const App = () => {
  return (
    <appContext.Provider value={store}>
      <LargeSon />
      <MediumSon />
      <SmallSon />
    </appContext.Provider>
  )
}

const LargeSon = () => (
  <section>
    大儿子
    <User />
  </section>
)
const MediumSon = () => (
  <section>
    二儿子
    <UserModifier />
  </section>
)

const SmallSon = connect((state) => {
  return { group: state.group }
})((group) => (
  <section>
    小儿子<div>Group:{group.name}</div>
  </section>
))

const User = connect((state) => {
  return { user: state.user }
})(({ user }) => {
  return <div>User: {user.name}</div>
})

const UserModifier = connect((state) => {
  return { user: state.user }
})(({ dispatch, user }) => {
  const onChange = (e) => {
    dispatch({ type: 'updateUser', payload: { name: e.target.value } })
  }

  return (
    <div>
      <input type='text' value={user.name} onChange={onChange} />
    </div>
  )
})
