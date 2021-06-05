import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Card, Popover, Button, List, Comment } from 'antd';
import { HeartOutlined, MessageOutlined, EllipsisOutlined, HeartTwoTone, UserOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';

import CommentForm from './CommentForm';
import { REMOVE_POST_REQUEST, LIKE_POST_REQUEST, UNLIKE_POST_REQUEST } from '../reducers/post';

moment.locale('ko');

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { removePostLoading } = useSelector((state) => state.post);
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const id = useSelector((state) => state.user.me?.id);

  const onLike = useCallback(() => {
    dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id, // 사용자 id는 벡엔드의 req.user 안에 들어있으므로 넣어줄 필요 없다.
    });
  }, []);
  const onUnlike = useCallback(() => {
    dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id,
    });
  }, []);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);
  const onRemovePost = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  const liked = post.Likers.find((v) => v.id === id);
  return (
    <div style={{ marginBottom: 30, margin: 10 }}>

      <Card
        actions={[
          liked
            ? <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onUnlike} />
            : <HeartOutlined key="heart" onClick={onLike} />,
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Popover
            key="more"
            content={(
              <Button.Group>
                {id && post.User.id === id
                  ? (
                    <>
                      <Button>수정</Button>
                      <Button type="danger" onClick={onRemovePost} loading={removePostLoading}>삭제</Button>
                    </>
                  )
                  : <Button href="https://open.kakao.com/o/s0nVpVYc" target="_blank" rel="noreferrer noopener">신고</Button>}
              </Button.Group>
          )}
          >
            <EllipsisOutlined />
          </Popover>,
          <Button shape="circle" icon={<SearchOutlined />} onClick={() => window.open(`${post.User.kakaolink}`, '_target').focus()} rel="noreferrer noopener" />,
        ]}
      >
        <div style={{ float: 'right' }}>{moment(post.createdAt).format('YYYY-MM-DD')}</div>
        <Card.Meta
          avatar={<UserOutlined />}
          title={`${post.User.nickname} / ${post.User.MBTI} / ${post.User.age}살 / ${post.User.sex}`}
          description={post.content}
        />

      </Card>
      {commentFormOpened && (
        <>
          <CommentForm post={post} />
          <List
            header={`${post.Comments.length}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <li>
                <Comment
                  author={`${item.User.nickname} / ${item.User.MBTI} / ${item.User.age}살 / ${item.User.sex}`}
                  avatar={<UserOutlined />}
                  content={item.content}
                />
              </li>
            )}
          />
        </>
      )}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default PostCard;
