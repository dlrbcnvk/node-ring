import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import axios from 'axios';
import { END } from 'redux-saga';

import wrapper from '../store/configureStore';
import AppLayout from '../components/AppLayout';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import { LOAD_POSTS_REQUEST } from '../reducers/post';

const welcome = () => {
  const { me } = useSelector((state) => state.user);
  useEffect(() => {
    if (me && me.id) {
      Router.push('/');
    }
  }, [me && me.id]);

  if (me) {
    return '내 정보 로딩중...';
  }
  return (
    <AppLayout>
      <div style={{ marginTop: 20, marginLeft: 20 }}>
        회원가입 먼저 하세요~!
      </div>
    </AppLayout>

  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_POSTS_REQUEST,
    });
  }
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default welcome;
