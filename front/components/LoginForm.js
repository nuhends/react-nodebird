import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { Form, Input, Button } from 'antd';
import styled from 'styled-components';

import { loginRequestAction } from '../reducers/user';

import useInput from '../hooks/useInput';

const ButtonWrapper = styled.div`
  margin-top: 10px;
`;

const FormWrapper = styled(Form)`
  padding: 10px;
`;

const LoginForm = () => {
  // store.dispatch 와 같음
  const { logInLoading, logInError } = useSelector(state => state.user)
  const dispatch = useDispatch();
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');

  // Antd의 Form에는 e.preventDefault() 할 필요 없음
  const onSubmitForm = useCallback(() => {
    dispatch(loginRequestAction({ email, password }));
  }, [ email, password ]);

  useEffect(() => {
    if(logInError) {
      alert(logInError);
    }
  }, [logInError]);

  return (
    <FormWrapper onFinish={onSubmitForm}>
      <div>
        <label htmlFor="user-email">이메일</label>
        <br />
        <Input 
          type="email" 
          name="user-email" 
          id="user-email"
          value={email}
          onChange={onChangeEmail}
          required
        />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input 
          type="password" 
          name="user-password" 
          id="user-password"
          value={password}
          onChange={onChangePassword}
          required
        />
      </div>
      <ButtonWrapper>
        <Button 
          type="primary" 
          htmlType="submit"
          loading={logInLoading}
        >
          로그인
        </Button>
        <Link href="/signup">
          <a>
            <Button>회원가입</Button>
          </a>
        </Link>
      </ButtonWrapper>
    </FormWrapper>
  );
};

export default LoginForm;
