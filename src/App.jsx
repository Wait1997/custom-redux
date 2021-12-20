import { createStore, connect } from './redux';
import { Provider } from './redux/context';

const initState = {
  user: { name: 'frank', age: 18 },
  group: { name: '前端组' }
};

const reducer = (state, { type, payload }) => {
  if (type === 'updateUser') {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload
      }
    };
  } else {
    return state;
  }
};

const store = createStore(reducer, initState);

export const App = () => {
  return (
    <Provider store={store}>
      <LargeSon />
      <MediumSon />
      <SmallSon />
    </Provider>
  );
};

const LargeSon = () => (
  <section>
    大儿子
    <User />
  </section>
);
const MediumSon = () => (
  <section>
    二儿子
    <UserModifier />
  </section>
);

const SmallSon = connect(state => {
  return { group: state.group };
})(({ group }) => {
  return (
    <section>
      小儿子<div>Group: {group.name}</div>
    </section>
  );
});

const userSelector = state => {
  return { user: state.user };
};

const userDispatcher = dispatch => {
  return {
    updateUser: value => dispatch({ type: 'updateUser', payload: value })
  };
};

const User = connect(userSelector)(({ user }) => {
  return <div>User: {user.name}</div>;
});

const UserModifier = connect(
  userSelector,
  userDispatcher
)(({ updateUser, user }) => {
  const onChange = e => {
    updateUser({ name: e.target.value });
  };

  return (
    <div>
      <input type='text' value={user.name} onChange={onChange} />
    </div>
  );
});
