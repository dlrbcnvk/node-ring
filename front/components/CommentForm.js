import React, { useCallback, useEffect } from 'react';
import propTypes from 'prop-types';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';

import useInput from '../hooks/useInput';
import { ADD_COMMENT_REQUEST } from '../reducers/post';

const CommentForm = ({ post }) => {
  const dispatch = useDispatch();
  const me = useSelector((state) => state.user?.me);
  const { addCommentDone, addCommentLoading } = useSelector((state) => state.post);
  const [commentText, onChangeCommentText, setCommentText] = useInput('');

  useEffect(() => {
    if (addCommentDone) {
      setCommentText('');
    }
  }, [addCommentDone]);

  const onSubmitComment = useCallback(() => {
    console.log(post.id, commentText, me.id, me.nickname, me.school, me.MBTI, me.age, me.sex);
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: {
        content: commentText,
        postId: post.id,
        userId: me.id,
        userNickname: me.nickname,
        userMBTI: me.MBTI,
        userAge: me.age,
        userSex: me.sex,
      },
    });
  }, [commentText, me]);
  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item style={{ position: 'relative', marginTop: 20 }}>
        <Input.TextArea
          value={commentText}
          onChange={onChangeCommentText}
        />
        <Button
          style={{ position: 'absolute', right: 0, bottom: -40, zIndex: 1 }}
          type="primary"
          htmlType="submit"
          loading={addCommentLoading}
        >작성
        </Button>
      </Form.Item>
    </Form>
  );
};

CommentForm.propTypes = {
  post: propTypes.object.isRequired,
};

export default CommentForm;
