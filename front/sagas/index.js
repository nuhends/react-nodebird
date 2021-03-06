import { all, fork } from "@redux-saga/core/effects";
import axios from 'axios';

import { backUrl } from '../config/config';
import postSaga from './post';
import userSaga from './user';

// axios.defaults.baseURL = 'http://localhost:3065';
axios.defaults.baseURL = backUrl;
axios.defaults.withCredentials = true;

export default function* rootSaga() {
  yield all([
    fork(postSaga),
    fork(userSaga),
  ]);
}
