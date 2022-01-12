import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input } from 'antd';
import useInput from '../hooks/useInput';
import { CHANGE_NICKNAME_REQUEST } from '../reducers/user';

const NickNameEditForm = () => {
  const { me } = useSelector(state => state.user);
  const [nickname, onChangeNickname] = useInput(me?.nickname || '')
  const dispatch = useDispatch();

  const formStyle = useMemo(() => ({
    marginBottom: '20px',
    border: '1px solid #d9d9d9',
    padding: '20px',
  }), []);

  const onSubmit = useCallback(() => {
    dispatch({
      type: CHANGE_NICKNAME_REQUEST,
      data: nickname
    });
  }, [nickname]);

  return (
    <Form style={formStyle}>
      <Input.Search
        value={nickname}
        placeholder="닉네임을 입력하세요."
        addonBefore="닉네임"
        enterButton="수정"
        onChange={onChangeNickname}
        onSearch={onSubmit}
       />
    </Form>
  );
}

export default NickNameEditForm;
