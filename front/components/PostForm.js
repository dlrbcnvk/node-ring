import React, { useCallback, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { ADD_POST_REQUEST } from '../reducers/post';
import useInput from '../hooks/useInput';

const PostForm = () => {
  const { addPostLoading, addPostDone } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const [text, onChangeText, setText] = useInput('');

  useEffect(() => {
    if (addPostDone) {
      setText('');
    }
  }, [addPostDone]);

  const onSubmitForm = useCallback(() => {
    dispatch({
      type: ADD_POST_REQUEST,
      data: text,
    });
  }, [text]);
  return (
    <Form style={{ margin: '10px 10px 20px' }} encType="multipart/form-data" onFinish={onSubmitForm}>
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={800}
        placeholder="어떤 신기한 일이 있었나요?"
      />
      <Button type="primary" style={{ float: 'right', marginTop: 10 }} loading={addPostLoading} htmlType="submit">작성</Button>
      <br /><br /><br />
    </Form>
  );
};

export default PostForm;
