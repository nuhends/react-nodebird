;import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Avatar, Button, Card, Comment, List, Popover } from 'antd';
import { EllipsisOutlined, HeartOutlined, HeartTwoTone, RetweetOutlined, MessageOutlined } from '@ant-design/icons';

import { LIKE_POST_REQUEST, UNLIKE_POST_REQUEST, REMOVE_POST_REQUEST, RETWEET_REQUEST } from '../reducers/post';
import CommentForm from './CommentForm';
import PostImages from './PostImages';
import PostCardContent from './PostCardContent';
import FollowButton from './FollowButton';

// 한글 기본값 설정
moment.locale('ko');

const PostCard = ({ post }) => {
  const { me } = useSelector(state => state.user);
  const { removePostLoading } = useSelector(state => state.post);
  const dispatch = useDispatch();
  
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  
  const id = me?.id || '';
  const liked = post.Likers.find(v => v.id === id);

  const onLike = useCallback(() => {
    if(!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id,
    })
  }, [id]);

  const onUnLike = useCallback(() => {
    if(!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id,
    })
  }, [id]);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened(prev => !prev);
  }, []);

  const onRemovePost = useCallback(() => {
    if(!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id
    });
  }, [id]);

  const onRetweet = useCallback(() => {
    if(!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id
    })
  }, [id]);

  return (
    <div style={{ marginBottom: '20px' }}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" onClick={onRetweet} />,
          liked ? (
            <HeartTwoTone 
              key="like" 
              twoToneColor="#eb2f96"
              onClick={onUnLike}
            />
          ) : <HeartOutlined key="like" onClick={onLike} />,
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Popover 
            key="more" 
            content={(
              <Button.Group>
                {id && post.User.id === id ? (
                  <>
                    <Button>수정</Button>
                    <Button 
                      type="danger"
                      loading={removePostLoading}
                      onClick={onRemovePost}
                    >
                      삭제
                    </Button>
                  </>
                ) : <Button>신고</Button>}
              </Button.Group>
            )}
          >
            <EllipsisOutlined />
          </Popover>
        ]}
        extra={id && <FollowButton post={post} />}
        title={post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : null}
      >
        {post.RetweetId && post.Retweet ? (
          <Card 
            cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}
          >
            <div style={{ float: 'right' }}>{moment(post.createdAt).fromNow()}</div>
            <Card.Meta 
              avatar={(
                <Link href={`/user/${post.Retweet.User.id}`}>
                  <a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a>
                </Link>
              )}
              title={post.Retweet.User.nickname}
              description={<PostCardContent postData={post.Retweet.content} />}
            />
          </Card>
        ) : (
          <>
            <div style={{ float: 'right' }}>{moment(post.createdAt).fromNow()}</div>
            <Card.Meta 
              avatar={(
                <Link href={`/user/${post.User.id}`}> 
                  <a><Avatar>{post.User.nickname[0]}</Avatar></a>
                </Link>
              )}
              title={post.User.nickname}
              description={<PostCardContent postData={post.content} />}
            />
          </>
        )}
      </Card>
      {commentFormOpened && (
        <div>
        {/* 댓글을 작성할 때, 어떤 post item 인지 정보(post의 id)가 필요하기 때문에 post를 통째로 props로 전달 */}
        <CommentForm post={post} />
          <List 
            header={`${post.Comments.length}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <li>
                <Comment 
                  author={item.User.nickname}
                  avatar={(
                    <Link href={`/user/${item.User.id}`}> 
                      <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                    </Link>
                  )}
                  content={item.content}
                />
              </li>
            )}
          />
        </div>
      )}
    </div>
  )
}

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
}

export default PostCard;
