import { useState, useContext, useEffect, useMemo } from 'react';
import { appContext } from './context';
import { changed } from './utils';

const store = {
  state: null,
  reducer: () => {},
  dispatch(action) {
    store.state = store.reducer(store.state, action);
    store.listeners.map(fn => fn(store.state));
  },
  listeners: [],
  subscribe(fn) {
    store.listeners.push(fn);
    return () => {
      const index = store.listeners.indexOf(fn);
      store.listeners.splice(index, 1);
    };
  }
};

// 赋值初始状态
export const createStore = (reducer, initState) => {
  store.state = initState;
  store.reducer = reducer;

  return store;
};

export const connect = (selector, dispatchSelector) => Component => {
  return props => {
    const { state, dispatch } = useContext(appContext);

    // forceUpdate 强制更新组件
    const [, update] = useState({});

    // update 更新时 获取最新的 state
    const data = useMemo(() => {
      return selector ? selector(state) : { state };
    }, [state]);

    const dispatchers = dispatchSelector ? dispatchSelector(dispatch) : { dispatch };

    /**
     * useEffect 只是为了在初始化的时候订阅一次
     * 订阅要更新的函数 只要被 connect 包裹的组件 初始化时都会被订阅
     * 只有在 dispatch 的时候会发布订阅 更新 connect 包裹的组件
     */
    useEffect(() => {
      return store.subscribe(() => {
        // store.state 最新的 state dispatch 派发时存储到 store 的最新值
        const newData = selector ? selector(store.state) : { state: store.state };
        if (changed(data, newData)) {
          update({});
        }
      });
      // 这里最好 取消订阅 否则在 selector 变化时会出现重复订阅
    }, [data]);

    return <Component {...props} {...data} {...dispatchers} />;
  };
};
