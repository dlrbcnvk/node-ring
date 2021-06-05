import React, { useEffect } from 'react';
import axios from 'axios';
import { END } from 'redux-saga';
import Router from 'next/router';
import { useSelector } from 'react-redux';

import wrapper from '../store/configureStore';
import AppLayout from '../components/AppLayout';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';

const exit = () => {
  const { me } = useSelector((state) => state.user);

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/welcome');
    }
  }, [me && me.id]);

  if (!me) {
    return '메인 페이지로 돌아갑니다...';
  }
  return (
    <AppLayout>
      <div style={{ marginTop: 20, marginLeft: 20 }}>
        탈퇴...?! ㅠ.ㅠ
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

export default exit;
