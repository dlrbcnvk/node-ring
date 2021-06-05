import React, { useEffect } from 'react';
import axios from 'axios';
import { END } from 'redux-saga';
import Router from 'next/router';

import { useDispatch, useSelector } from 'react-redux';
import wrapper from '../store/configureStore';
import AppLayout from '../components/AppLayout';
import PostCard from '../components/PostCard';
import Welcome from '../components/Welcome';
import { LOAD_WOMEN_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';

const women = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);

  useEffect(() => {
    function onScroll() {
      if (window.scrollY + document.documentElement.clientHeight
                > document.documentElement.scrollHeight - 300) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_WOMEN_POSTS_REQUEST,
            lastId,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  },
  [hasMorePosts, loadPostsLoading, mainPosts]);

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
      {me ? mainPosts.map((post) => <PostCard key={post.id} post={post} />) : <Welcome />}
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
      type: LOAD_WOMEN_POSTS_REQUEST,
    });
  }
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default women;
