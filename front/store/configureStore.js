import { createWrapper } from 'next-redux-wrapper';
import { applyMiddleware, createStore, compose } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import reducer from '../reducers'
import rootSaga from '../sagas';
 
const loggerMiddleware = ({ dispatch, getState }) => (next) => (action) => {
  // thunk에서는 action 을 function으로 둘 수 있음
  // action이 function 이라는 건 
  // 지연함수 -> action 을 나중에 실행해줄 수 있음
  // if(typeof action === 'function') {
  //   return action(dispatch, getState);
  // }
  // default: action은 객체
  console.log({ action });
  return next(action);
};

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware, loggerMiddleware];
  const enhancer = process.env.NODE_ENV === 'production'
    ? compose(applyMiddleware(...middlewares))
    : composeWithDevTools(applyMiddleware(...middlewares))
  const store = createStore(reducer, enhancer);
  
  store.sagaTask = sagaMiddleware.run(rootSaga);
  
  return store;
};

const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === 'development'
});

export default wrapper;
