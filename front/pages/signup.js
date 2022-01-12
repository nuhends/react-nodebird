import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import Head from 'next/head';
import { Form, Input, Checkbox, Button } from 'antd'
import styled from 'styled-components';

import { LOAD_MY_INFO_REQUEST, SIGN_UP_REQUEST } from '../reducers/user';
import useInput from '../hooks/useInput';
import AppLayout from '../components/AppLayout';
import wrapper from '../store/configureStore';
import axios from 'axios';
import { END } from 'redux-saga';


const ErrorMessage = styled.div`
  color: red
`;

const Signup = () => {
  const dispatch = useDispatch();
  const { signUpLoading, signUpDone, signUpError, me } = useSelector(state => state.user);

  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, onChangePassword] = useInput('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const [term, setTerm] = useState('');
  const [termError, setTermError] = useState(false);

  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
    
    if(e.target.checked) {
      setTermError(false);
    }
  }, []);

  const onChangePasswordCheck = useCallback((e) => {
    setPasswordCheck(e.target.value);
    setPasswordError(e.target.value !== password)
  }, [password]);

  const onSubmit = useCallback(() => {
    if(password !== passwordCheck) {
      return setPasswordError(true);
    }

    if(!term) {
      return setTermError(true);
    }
    console.log(email, nickname, password);
    dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, nickname, password }
    });
  }, [email, password, passwordCheck, term, setTermError]);
  
  useEffect(() => {
    if(me && me.id) {
      Router.replace('/');
    }
  }, [me && me.id]);

  useEffect(() => {
    if(signUpDone){
      Router.push('/');
    };
  }, [signUpDone]);

  useEffect(() => {
    if(signUpError){
      alert(signUpError);
    };
  }, [signUpError]);
  
  if(me) return null;

  return (
    <>
      <Head>
        <title>회원가입 | NodeBird</title>
      </Head>
      
      <AppLayout>
        <Form onFinish={onSubmit}>
          <div>
            <label htmlFor="user-email">이메일</label>
            <br />
            <Input 
              name="user-email" 
              type="email"
              value={email} 
              required 
              onChange={onChangeEmail} 
            />
          </div>
          <div>
            <label htmlFor="user-nickname">닉네임</label>
            <br />
            <Input 
              name="user-nickname"
              type="text"
              value={nickname} 
              required 
              onChange={onChangeNickname} 
            />
          </div>
          <div>
            <label htmlFor="user-password">비밀번호</label>
            <br />
            <Input 
              name="user-password"
              type="password"
              value={password} 
              required 
              onChange={onChangePassword} 
            />
          </div>
          <div>
            <label htmlFor="user-password-check">비밀번호 체크</label>
            <br />
            <Input 
              name="user-password-check"
              type="password"
              value={passwordCheck} 
              required 
              onChange={onChangePasswordCheck} 
            />
            {passwordError && <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>}
            <div>
              <Checkbox
                name="user-term"
                checked={term}
                onChange={onChangeTerm}
              >
                Nuhends의 말을 잘 들을 것을 동의합니다.
              </Checkbox>
              {termError && (
                <ErrorMessage>약관에 동의하셔야 합니다.</ErrorMessage>
              )}
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={signUpLoading}
            >
              가입하기
            </Button>
          </div>
        </Form>
      </AppLayout>
    </>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';

  axios.defaults.headers.Cookie = '';

  if(context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  context.store.dispatch({ type: LOAD_MY_INFO_REQUEST });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Signup;
