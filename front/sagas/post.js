import { all, call, delay, fork, put, takeLatest, throttle } from "@redux-saga/core/effects";
import axios from "axios";
import {
  LOAD_USER_POSTS_REQUEST, LOAD_USER_POSTS_SUCCESS, LOAD_USER_POSTS_FAILURE,
  LOAD_HASHTAG_POSTS_REQUEST, LOAD_HASHTAG_POSTS_SUCCESS, LOAD_HASHTAG_POSTS_FAILURE,
  UPLOAD_IMAGES_FAILURE, UPLOAD_IMAGES_REQUEST, UPLOAD_IMAGES_SUCCESS,
  LIKE_POST_REQUEST, LIKE_POST_SUCCESS, LIKE_POST_FAILURE,
  UNLIKE_POST_REQUEST, UNLIKE_POST_SUCCESS, UNLIKE_POST_FAILURE,
  LOAD_POST_REQUEST, LOAD_POST_SUCCESS, LOAD_POST_FAILURE,
  LOAD_POSTS_REQUEST, LOAD_POSTS_SUCCESS, LOAD_POSTS_FAILURE,
  ADD_POST_REQUEST, ADD_POST_SUCCESS, ADD_POST_FAILURE,
  ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE,
  REMOVE_POST_REQUEST, REMOVE_POST_SUCCESS, REMOVE_POST_FAILURE,
  RETWEET_REQUEST, RETWEET_SUCCESS, RETWEET_FAILURE,
} from '../reducers/post';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from "../reducers/user";

// patch : 데이터의 일부분 수정
function uploadImagesAPI(data) {
  // form Data는 감싸지말고 그대로 넣어줘야함
  return axios.post('/post/images', data);
}

function likePostAPI(data) {
  return axios.patch(`/post/${data}/like`);
}

function unLikePostAPI(data) {
  return axios.delete(`/post/${data}/unlike`);
}

function addPostAPI(data) {
  return axios.post('/post', data);
}

function loadPostAPI(data) {
  return axios.get(`/post/${data}`);
}

function loadHashtagPostsAPI(data, lastId) {
  return axios.get(`/hashtag/${data}?lastId=${lastId || 0}`);
}

function loadUserPostsAPI(data, lastId) {
  return axios.get(`/user/${encodeURIComponent(data)}/posts?lastId=${lastId || 0}`);
}

function loadPostsAPI(lastId) {
  return axios.get(`/posts?lastId=${lastId || 0}`);
}

function removePostAPI(data) {
  return axios.delete(`/post/${data}`);
}

function addCommentAPI(data) {
  // POST /post/1/comment
  return axios.post(`/post/${data.postId}/comment`, data)
}

function retweetAPI(data) {
  return axios.post(`/post/${data}/retweet`);
}

function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesAPI, action.data);

    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: err.response.data,
    });
  }
}

function* likePost(action) {
  try {
    const result = yield call(likePostAPI, action.data);
    
    yield put({ 
      type: LIKE_POST_SUCCESS,
      data: result.data
    });
  } catch (err) {
    yield put({
      type: LIKE_POST_FAILURE,
      error: err.response.data
    });
  }
}

function* unLikePost(action) {
  try {
    const result = yield call(unLikePostAPI, action.data);

    yield put({ 
      type: UNLIKE_POST_SUCCESS,
      data: result.data
    });
  } catch (err) {
    yield put({
      type: UNLIKE_POST_FAILURE,
      error: err.response.data
    });
  }
}

function* loadPost(action) {
  try {
    const result = yield call(loadPostAPI, action.data);
    
    yield put({
      type: LOAD_POST_SUCCESS,
      data: result.data
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_POST_FAILURE,
      error: err.response.data
    });
  }
}

function* loadHashtagPosts(action) {
  try {
    const result = yield call(loadHashtagPostsAPI, action.data, action.lastId);
    
    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data: result.data
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_HASHTAG_POSTS_FAILURE,
      error: err.response.data
    });
  }
}

function* loadUserPosts(action) {
  try {
    const result = yield call(loadUserPostsAPI, action.data, action.lastId);
    
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: err.response.data
    });
  }
}

function* loadPosts(action) {
  try {
    const result = yield call(loadPostsAPI, action.lastId);
    
    yield put({
      type: LOAD_POSTS_SUCCESS,
      data: result.data
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_POSTS_FAILURE,
      error: err.response.data
    });
  }
}

function* addPost(action) {
  console.log('saga:: ADD_POST_REQUEST');
  try {
    const result = yield call(addPostAPI, action.data);

    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
    yield put({
      type: ADD_POST_TO_ME,
      data: result.data.id,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: ADD_POST_FAILURE,
      error: err.response.data
    });
  }
}

function* removePost(action) {
  console.log('saga:: REMOVE_POST_REQUEST');
  try {
    const result = yield call(removePostAPI, action.data);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: result.data // id정보
    });
    yield put({
      type: REMOVE_POST_OF_ME,
      data: result.data,
    })
  } catch (err) {
    console.error(err);
    yield put({
      type: REMOVE_POST_FAILURE,
      error: err.response.data
    });
  }
}

function* addComment(action) {
  try {
    const result = yield call(addCommentAPI, action.data);
    
    yield put({
      type: ADD_COMMENT_SUCCESS,
      // { postId, UserId }
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: err.response.data
    });
  }
}

function* retweet(action) {
  try {
    const result = yield call(retweetAPI, action.data);
    
    yield put({
      type: RETWEET_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: RETWEET_FAILURE,
      error: err.response.data
    });
  }
}

function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}
function* watchUnLikePost() {
  yield takeLatest(UNLIKE_POST_REQUEST, unLikePost);
}

function* watchLoadPost() {
  yield takeLatest(LOAD_POST_REQUEST, loadPost);
}

function* watchLoadUserPosts() {
  yield throttle(5000, LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

function* watchLoadHashtagPosts() {
  yield throttle(5000, LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}

function* watchLoadPosts() {
  yield throttle(5000, LOAD_POSTS_REQUEST, loadPosts);
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

function* watchRetweet() {
  yield takeLatest(RETWEET_REQUEST, retweet);
}

export default function* postSaga() {
  yield all([
    fork(watchUploadImages),
    fork(watchLikePost),
    fork(watchUnLikePost),
    fork(watchLoadPost),
    fork(watchLoadUserPosts),
    fork(watchLoadHashtagPosts),
    fork(watchLoadPosts),
    fork(watchAddPost),
    fork(watchRemovePost),
    fork(watchAddComment),
    fork(watchRetweet),
  ]);
}
