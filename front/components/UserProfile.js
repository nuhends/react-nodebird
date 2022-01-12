import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Avatar, Button } from 'antd';

import { logoutRequestAction } from '../reducers/user';
import Link from 'next/link';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { me, logOutLoading } = useSelector(state => state.user);
  
  const onLogOut = useCallback(() => {
    dispatch(logoutRequestAction());
  }, []);

  return (
    <Card
      actions={[
        <div key="twit">짹짹<br />{me.Posts.length}</div>,
        <div key="following">팔로잉<br />{me.Followings.length}</div>,
        <div key="follower">팔로워<br />{me.Followers.length}</div>,
      ]}
    >
      <Card.Meta
        avatar={(
          <Link href={`/user/${me.id}`}>
            <a><Avatar>{me.nickname[0]}</Avatar></a>
          </Link>
        )}
        title={me.nickname}
      />
        <Button
          loading={logOutLoading}
          onClick={onLogOut}
        >로그아웃</Button>
    </Card>
  );
}

export default UserProfile;
