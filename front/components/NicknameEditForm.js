import React, { useCallback, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import Router from 'next/router';
import useInput from '../hooks/useInput';
import { CHANGE_PROFILE_REQUEST } from '../reducers/user';

const EditFormWrapper = styled(Form)`
  margin-bottom: '20px';
  border: '1px solid #d9d9d9';
  padding: '20px';
`;

const NicknameEditForm = () => {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.user.me?.id);
  const { changeProfileLoading, changeProfileDone, me } = useSelector((state) => state.user);
  const [nickname, onChangeNickname] = useInput(me?.nickname || '');
  const [introduce, onChangeIntroduce] = useInput(me?.introduce || '');
  const [MBTI, onChangeMBTI] = useInput(me?.MBTI || '');
  const [age, onChangeAge] = useInput(me?.age || '');
  const [kakaolink, onChangeKakaolink] = useInput(me?.kakaolink || '');

  const onSubmit = useCallback(() => {
    dispatch({
      type: CHANGE_PROFILE_REQUEST,
      data: { id, nickname, introduce, MBTI, age, kakaolink },
    });
    console.log(id, nickname, introduce, MBTI, age, kakaolink);
  }, [id, nickname, introduce, MBTI, age, kakaolink]);

  useEffect(() => {
    if (changeProfileDone) {
      alert('변경 성공~!');
      Router.push('/');
    }
  }, [changeProfileDone]);

  return (
    <EditFormWrapper onFinish={onSubmit}>
      <div>
        <label htmlFor="user-nickname">닉네임</label>
        <br />
        <Input name="user-nickname" value={nickname} required onChange={onChangeNickname} />
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
        <label htmlFor="open-kakao-link">오카 링크</label>
        <br />
        <Input name="open-kakao-link" type="url" value={kakaolink} required onChange={onChangeKakaolink} />
      </div>
      <Button type="primary" htmlType="submit" loading={changeProfileLoading}>수정하기</Button>
    </EditFormWrapper>
  );
};

export default NicknameEditForm;
