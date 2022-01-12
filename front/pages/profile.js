import React, { useCallback, useEffect, useState } from 'react';
import Router from "next/router";
import Head from 'next/head';
import { useSelector } from  'react-redux';
import useSWR from 'swr';

import AppLayout from '../components/AppLayout';
import NickNameEditForm from '../components/NickNameEditForm';
import FollowList from '../components/FollowList';
import axios from 'axios';

const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
  const { me } = useSelector(state => state.user);
  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);
  
  const { data: followersData, error: followerError } = useSWR(`http://localhost:3065/user/followers?limit=${followersLimit}`, fetcher);
  const { data: followingsData, error: followingError } = useSWR(`http://localhost:3065/user/followings?limit=${followingsLimit}`, fetcher);
  
  useEffect(() => {
    if(!(me && me.id)) {
      Router.push('/');
    }
  }, [me && me.id]);

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit(prev => prev + 3);
  }, []);

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit(prev => prev + 3);
  }, []);
  
  if(!me) return '내 정보 로딩중...';

  if(followerError || followingError) {
    console.error(followerError || followingError);
    return <div>'팔로잉/팔로워 로딩중 에러 발생'</div>;
  }
  

  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NickNameEditForm />
        <FollowList 
          header="팔로잉" 
          data={followersData} 
          onClickMore={loadMoreFollowers} 
          loading={!followersData && !followerError}
        />
        <FollowList 
          header="팔로워" 
          data={followingsData} 
          onClickMore={loadMoreFollowings} 
          loading={!followingsData && !followingError}
        />
      </AppLayout>
    </>
  );
}

export default Profile;
