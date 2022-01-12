import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';

import user from './user';
import post from './post';

// 비동기 액션 생성자 -> saga


// (이전 상태, 액션) => 다음 상태
// 액션에 따라 이전 상태에서 변화된 다음 상태로 변경해주는 함수
const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log('HYDRATE', action);
      return action.payload;
    default:
      const combinedReducer = combineReducers({
        user,
        post,
      });
      return combinedReducer(state, action);
  }
};

// const rootReducer = combineReducers({
//   index: (state = {}, action) => {
//     switch (action.type) {
//       case HYDRATE:
//         console.log('HYDRATE', action);
//         return { ...state, ...action.payload };
//       default:
//         return state;
//     }
//   },
//   user,
//   post
// });

export default rootReducer;
