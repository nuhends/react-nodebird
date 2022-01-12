import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Form, Input} from 'antd';

import { ADD_COMMENT_REQUEST } from '../reducers/post';
import useInput from '../hooks/useInput'

const CommentForm = ({ post }) => {
  const id = useSelector((state) => state.user.me?.id);
  const { addPostDone, addCommentLoading } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  const [commentText, onChangeCommentText, setCommentText] = useInput('');
  
  const onSubmitComment = useCallback(() => {
    console.log(post.id, commentText);

    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: {
        userId: id,
        postId: post.id,
        content: commentText
      }
    });
  }, [commentText, id],);

  useEffect(() => {
    if(addPostDone) {
      setCommentText('');
    }
  }, [addPostDone])

  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item style={{ position: 'relative', margin: '0' }}>
        <Input.TextArea 
          value={commentText}
          onChange={onChangeCommentText}
          rows={4}
        />
        <Button 
          type="primary" 
          htmlType="submit"
          style={{ position: 'absolute', right: '0', bottom: '-40px', zIndex: '1' }}
          loading={addCommentLoading}
        >
          삐약
        </Button>
      </Form.Item>
    </Form>
  )
}

CommentForm.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    Images: PropTypes.arrayOf(PropTypes.object),
    Comments: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
}

export default CommentForm
