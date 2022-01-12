import React, { useCallback, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Button, Form, Input } from 'antd';
import { UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE, ADD_POST_REQUEST } from '../reducers/post'
import useInput from '../hooks/useInput';

const PostForm = () => {
  const dispatch = useDispatch();
  const { addPostDone, imagePaths } = useSelector(state => state.post)
  
  const [text, onChangeText, setText] = useInput('');
  const imageInput = useRef(null);

  const onClickImageUpload = useCallback(() => {
    if(imageInput.current) {
      imageInput.current.click();
    }
  },[imageInput.current])

  const onSubmit = useCallback(() => {
    if(!text || !text.trim()) {
      return alert('게시글을 작성하세요.');
    }
    const formData = new FormData();
    
    imagePaths.forEach(f => {
      // req.body.image
      formData.append('image', f)
    });
    // req.body.content
    formData.append('content', text);

    return dispatch({
      type: ADD_POST_REQUEST,
      data: formData
    });
  }, [text, imagePaths]);

  // input에 업로드한 이미지 파일 선택 후 발생
  const onChangeImages = useCallback((e) => {
    console.log('images :: ', e.target.files);
    const imageFormData = new FormData();
    
    // e.target.files는 유사배열 객체임
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append('image', f);
    });
    
    console.log('imageFormData ::: ', imageFormData.getAll('image'));

    return dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData
    });
  });

  const onRemoveImage = useCallback((index) => () => {
    dispatch({
      type: REMOVE_IMAGE,
      data: index
    });
  }, [])

  useEffect(() => {
    if(addPostDone) {
      setText('');
    }
  }, [addPostDone])

  return (
    <Form 
      style={{ margin: '10px 0 20px' }}
      // 이미지를 올리면 multipart/form-data로 올라감, 하지만 서버에서는 json, urlencoded 형식만 받게 설정됨
      // 이미지, 비디오 등을 보통 multipart 데이터로 처리
      encType="multipart/form-data"
      onFinish={onSubmit}
    >
      <Input.TextArea
        value={text}
        placeholder={'어떤 신기한 일이 있었나요?'}
        maxLength={140}
        onChange={onChangeText}
      >
      </Input.TextArea>
      <div>
        <input 
          type="file"
          name="image"
          multiple
          hidden
          ref={imageInput}
          onChange={onChangeImages}
        />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button 
          type="primary" 
          style={{ float: 'right' }}
          htmlType="submit"
        >
          짹짹
        </Button>
      </div>
      {/* 업로드 이미지 미리보기 */}
      <div>
        {imagePaths.map((v, i) => (
          <div key={v} style={{ display: 'inline-block' }}>
            <img 
              src={`http://localhost:3065/${v}`} 
              style={{ width: '200px' }} 
              alt={v} 
            />
            <div>
              <Button onClick={onRemoveImage(i)}>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  )
}

export default PostForm
