import React, { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import { Form, Input, Button, Radio } from 'antd';
import styled from 'styled-components';
import Router from 'next/router';
import axios from 'axios';
import { END } from 'redux-saga';
import { useDispatch, useSelector } from 'react-redux';
import wrapper from '../store/configureStore';

import useInput from '../hooks/useInput';
import AppLayout from '../components/AppLayout';
import { SIGN_UP_REQUEST, LOAD_MY_INFO_REQUEST } from '../reducers/user';

const ErrorMessage = styled.div`
  color: red;
`;

const signup = () => {
  const dispatch = useDispatch();
  const { signUpLoading, signUpDone, signUpError, me } = useSelector((state) => state.user);

  useEffect(() => {
    if (me && me.id) {
      Router.replace('/');
    }
  }, [me && me.id]);

  useEffect(() => {
    if (signUpDone) {
      Router.replace('/');
    }
  }, [signUpDone]);

  useEffect(() => {
    if (signUpError) {
      alert(signUpError);
    }
  }, [signUpError]);

  const [email, onChangeEmail] = useInput('');

  const [password, onChangePassword] = useInput('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const onChangePasswordCheck = useCallback((e) => {
    setPasswordCheck(e.target.value);
    setPasswordError(e.target.value !== password);
  }, [password]);

  const [sex, setSex] = useState('남');
  const onChangeSex = useCallback((e) => {
    console.log('sex checked', e.target.value);
    if (e.target.value === '남') setSex('남');
    else setSex('여');
  }, []);

  const [introduce, onChangeIntroduce] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [age, onChangeAge] = useInput('');
  const [kakaolink, onChangeKakaolink] = useInput('');
  const [MBTI, onChangeMBTI] = useInput('');

  const onSubmit = useCallback(() => {
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    console.log(email, nickname, password, sex, age, MBTI, kakaolink);
    console.log(introduce);
    return dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, password, nickname, sex, age, MBTI, kakaolink, introduce },
    });
  }, [email, password, passwordCheck, sex, age, MBTI, kakaolink, introduce]);

  return (
    <AppLayout>
      <Head>
        <title>회원가입 | 노드링</title>
      </Head>
      <Form onFinish={onSubmit} style={{ padding: 10, margin: 30 }}>
        <div>
          <label htmlFor="user-email">이메일</label>
          <br />
          <Input name="user-email" type="email" value={email} required onChange={onChangeEmail} />
        </div>
        <br />
        <div>
          <label htmlFor="user-nickname">닉네임</label>
          <br />
          <Input name="user-nickname" value={nickname} required onChange={onChangeNickname} />
        </div>
        <br />
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <Input name="user-password" type="password" value={password} required onChange={onChangePassword} />
        </div>
        <br />
        <div>
          <label htmlFor="user-password-check">비밀번호 확인</label>
          <br />
          <Input
            name="user-password-check"
            type="password"
            value={passwordCheck}
            required
            onChange={onChangePasswordCheck}
          />
          {passwordError && <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>}
        </div>
        <br />
        <div>
          <label htmlFor="introduce">한 줄 소개</label>
          <br />
          <Input
            name="introduce"
            type="text"
            value={introduce}
            onChange={onChangeIntroduce}
            required
          />
        </div>
        <br />
        <div>
          <label htmlFor="sex">성별</label>
          <br />
          <Radio.Group onChange={onChangeSex} value={sex}>
            <Radio value="남">남자</Radio>
            <Radio value="여">여자</Radio>
          </Radio.Group>
        </div>
        <br />
        <div>
          <label htmlFor="age">나이</label>
          <br />
          <Input name="age" type="number" value={age} required onChange={onChangeAge} />
        </div>
        <br />
        <div>
          <label htmlFor="MBTI">MBTI</label>
          <br />
          <Input name="MBTI" value={MBTI} required onChange={onChangeMBTI} />
        </div>
        <br />
        <div>
          <label htmlFor="open-kakao-link">카카오톡 오픈 프로필 링크</label>
          <br />
          <Input name="open-kakao-link" type="url" value={kakaolink} required onChange={onChangeKakaolink} />
        </div>
        <div style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="submit" loading={signUpLoading}>가입하기</Button>
        </div>
      </Form>
      <br /><br /><br /><br /><br /><br />
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default signup;
