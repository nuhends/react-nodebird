import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';

import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';
import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector(state => state.user);
  const { mainPosts, retweetError, hasMorePosts, loadPostsLoading } = useSelector(state => state.post);
  
  useEffect(() => {
    if(retweetError) {
      return alert(retweetError);
    }
  }, [retweetError]);

  // 화면이 처음 로딩 될 때는 사용자정보, 게시글 정보 없다, 마운트된 후에 요청후 데이터 맵핑
  // useEffect(() => {
  //   // 사용자 정보 불러오기
  //   dispatch({ type: LOAD_MY_INFO_REQUEST });
  //   // 포스트 목록 불러오기
  //   dispatch({ type: LOAD_POSTS_REQUEST });
  // }, []);

  useEffect(() => {
    function onScroll() {
      // console.log({
      //   'scrollY': window.scrollY, // Y축으로 얼마나 스크롤 내렸는지
      //   'clientHeight': document.documentElement.clientHeight, // 뷰포트 height
      //   'scrollHeight': document.documentElement.scrollHeight, // 총 길이
      // });
      if(window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
        if(hasMorePosts && !loadPostsLoading) {
          // mainPosts.length === 0일 수 있음
          const lastId = mainPosts[mainPosts.length - 1]?.id;

          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      }
    }

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    }
  }, [hasMorePosts, loadPostsLoading, mainPosts])

  return (
    <AppLayout>
      <h1>Hello Next!! INDEX PAGE</h1>
      {me && <PostForm />}
      {mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
    </AppLayout>
  );
};

// ** 이 부분은 FRONT서버에서 실행되는 부분임 **
// Home이 실행되기 전에 getServerSideProps를 먼저 실행
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';

  axios.defaults.headers.Cookie = '';
  
  if(context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  // 사용자 정보 불러오기
  // FRONT SERVER -> BACKEND SERVER 로의 요청 발생 (기존에는 브라우저에서 보냄/ 브라우저가 쿠키를 헤더에 실어서 보냄)
  context.store.dispatch({ type: LOAD_MY_INFO_REQUEST });
  // 포스트 목록 불러오기
  context.store.dispatch({ type: LOAD_POSTS_REQUEST });

  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Home;
