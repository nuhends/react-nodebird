import { all, call, delay, fork, put, takeLatest } from '@redux-saga/core/effects';
import axios from 'axios';
import {
  CHANGE_NICKNAME_REQUEST,
  CHANGE_NICKNAME_SUCCESS,
  CHANGE_NICKNAME_FAILURE,
  LOAD_MY_INFO_REQUEST,
  LOAD_MY_INFO_SUCCESS,
  LOAD_MY_INFO_FAILURE,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAILURE,
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  FOLLOW_REQUEST,
  FOLLOW_SUCCESS,
  FOLLOW_FAILURE,
  UNFOLLOW_REQUEST,
  UNFOLLOW_SUCCESS,
  UNFOLLOW_FAILURE,
  REMOVE_FOLLOWER_REQUEST,
  REMOVE_FOLLOWER_SUCCESS,
  REMOVE_FOLLOWER_FAILURE,
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWERS_SUCCESS,
  LOAD_FOLLOWERS_FAILURE,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_FOLLOWINGS_SUCCESS,
  LOAD_FOLLOWINGS_FAILURE,
} from '../reducers/user';

function changeNicknameAPI(data) {
  return axios.patch('/user/nickname', { nickname: data });
}

function loadMyInfoAPI() {
  return axios.get('/user');
}

function loadUserAPI(data) {
  return axios.get(`/user/${data}`);
}

function followAPI(data) {
  return axios.patch(`/user/${data}/follow`);
}

function unfollowAPI(data) {
  return axios.delete(`/user/${data}/follow`);
}

function removeFollowerAPI(data) {
  return axios.delete(`/user/follower/${data}`);
}

function logInAPI(data) {
  return axios.post('/user/login', data);
}

function logOutAPI() {
  return axios.post('/user/logout');
}

function signUpAPI(data) {
  return axios.post('/user', data);
}

function loadFollowersAPI(data) {
  return axios.get('/user/followers', data);
}

function loadFollowingsAPI(data) {
  return axios.get('/user/followings', data);
}

function* changeNickname(action) {
  try {
    const result = yield call(changeNicknameAPI, action.data)

    yield put({ 
      type: CHANGE_NICKNAME_SUCCESS,
      data: result.data
    });
  } catch (err) {
    yield put({
      type: CHANGE_NICKNAME_FAILURE,
      error: err.response.data
    });
  }
}

function* loadMyInfo() {
  try {
    const result = yield call(loadMyInfoAPI)
    yield put({ 
      type: LOAD_MY_INFO_SUCCESS,
      data: result.data
    });
  } catch (err) {
    yield put({
      type: LOAD_MY_INFO_FAILURE,
      error: err.response.data
    });
  }
}

function* loadUser(action) {
  try {
    const result = yield call(loadUserAPI, action.data)
    yield put({ 
      type: LOAD_USER_SUCCESS,
      data: result.data
    });
  } catch (err) {
    yield put({
      type: LOAD_USER_FAILURE,
      error: err.response.data
    });
  }
}

function* follow(action) {
  try {
    console.log('saga follow');
    const result = yield call(followAPI, action.data);
    yield put({
      type: FOLLOW_SUCCESS,
      data: result.data
    });
  } catch (err) {
    yield put({
      type: FOLLOW_FAILURE,
      error: err.response.data
    });
  }
}

function* unfollow(action) {
  try {
    console.log('saga unfollow');
    const result = yield call(unfollowAPI, action.data);
    yield put({
      type: UNFOLLOW_SUCCESS,
      data: result.data
    });
  } catch (err) {
    yield put({
      type: UNFOLLOW_FAILURE,
      error: err.response.data
    });
  }
}

function* removeFollower(action) {
  try {
    console.log('saga removeFollower');
    const result = yield call(removeFollowerAPI, action.data);
    yield put({
      type: REMOVE_FOLLOWER_SUCCESS,
      data: result.data
    });
  } catch (err) {
    yield put({
      type: REMOVE_FOLLOWER_FAILURE,
      error: err.response.data
    });
  }
}

function* logIn(action) {
  try {
    console.log('saga login');
    console.log('login action data :: ', action.data);
    const result = yield call(logInAPI, action.data);
    console.log('loginSuccess DATA :: ', result);
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data
    });
  } catch (err) {
    yield put({
      type: LOG_IN_FAILURE,
      error: err.response.data
    });
  }
}

function* logOut() {
  try {
    yield call(logOutAPI);
    yield put({
      type: LOG_OUT_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: LOG_OUT_FAILURE,
      error: err.response.data
    });
  }
}

function* signUp(action) {
  try {
    const result = yield call(signUpAPI, action.data);

    yield put({
      type: SIGN_UP_SUCCESS,
      data: result.data
    });
  } catch (err) {
    yield put({
      type: SIGN_UP_FAILURE,
      error: err.response.data
    })
  }
}

function* loadFollowers(action) {
  try {
    const result = yield call(loadFollowersAPI, action.data);

    yield put({
      type: LOAD_FOLLOWERS_SUCCESS,
      data: result.data
    });
  } catch (err) {
    yield put({
      type: LOAD_FOLLOWERS_FAILURE,
      error: err.response.data
    })
  }
}

function* loadFollowings(action) {
  try {
    const result = yield call(loadFollowingsAPI, action.data);

    yield put({
      type: LOAD_FOLLOWINGS_SUCCESS,
      data: result.data
    });
  } catch (err) {
    yield put({
      type: LOAD_FOLLOWINGS_FAILURE,
      error: err.response.data
    })
  }
}

// 이벤트 리스너와 비슷한 역할
function* watchChangeNickname() {
  yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickname);
}

function* watchLoadMyInfo() {
  yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo);
}

function* watchLoadUser() {
  yield takeLatest(LOAD_USER_REQUEST, loadUser);
}

function* watchFollow() {
  yield takeLatest(FOLLOW_REQUEST, follow);
}

function* watchUnfollow() {
  yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}

function* watchRemoveFollower() {
  yield takeLatest(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

function* watchLogIn() {
  yield takeLatest(LOG_IN_REQUEST, logIn);
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

function* watchLoadFollowers() {
  yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

function* watchLoadFollowings() {
  yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

export default function* userSaga() {
  yield all([
    fork(watchChangeNickname),
    fork(watchLoadMyInfo),
    fork(watchLoadUser),
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchRemoveFollower),
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchSignUp),
    fork(watchLoadFollowers),
    fork(watchLoadFollowings),
  ]);
}
