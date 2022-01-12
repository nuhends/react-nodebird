// 다이나믹 라우팅(동적 라우팅)
// post/[id].js
// post/3
import React from 'react'
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';
import { LOAD_POST_REQUEST } from '../../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import wrapper from '../../store/configureStore';
import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/PostCard';
import Head from 'next/head';

const Post = () => {
  const router = useRouter();
  const { id } = router.query;
  const { singlePost } = useSelector(state => state.post)

  return (
    <AppLayout>
      <Head>
        <title></title> 
        <meta name="description" content={singlePost.content} />
        <meta property="og:title" content={`${singlePost.User.nickname}`} />
        <meta property="og:description" content={`${singlePost.content}`} />
        <meta property="og:image" content={singlePost.Images[0] ? singlePost.Images[0].src : 'https://nodebird.com/favicon.ico' } />
        <meta property="og:url" content={`https://nodebird.com/post/${id}`} />
      </Head>
      <PostCard post={singlePost} />
    </AppLayout>      
  )
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';

  axios.defaults.headers.Cookie = '';

  if(context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  context.store.dispatch({ type: LOAD_MY_INFO_REQUEST });
  context.store.dispatch({ type: LOAD_POST_REQUEST, data: context.query.id });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Post;
