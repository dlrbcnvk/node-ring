import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Menu, Row, Col, Button } from 'antd';
import styled from 'styled-components';
import { SmileTwoTone, TeamOutlined, LockOutlined } from '@ant-design/icons';

import UserProfile from './UserProfile';
import LoginForm from './LoginForm';

const FooterWrapper = styled.footer`
  width: 100%;
  display: grid;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  border-top: solid 1px #d8d8d8;
  background-color: rgb(247, 247, 247);
  grid-template-columns: repeat(4, 1fr);
  height: 10%;
  .tab {
    font-family: "Noto Sans KR", sans-serif;
    font-size: 1.4rem;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    #text {
      color: black;
      font-size: 0.75rem;
      font-family: monospace;
    }
  }
`;

const MenuWrapper = styled(Menu)`
  width: 100%;
  align-items: center;
    .button {
      align-items: right;
      font-size: 10px;
    }
`;

const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user);
  return (
    <div>
      <MenuWrapper mode="horizontal">
        <Menu.Item className="menu">
          <Button className="button" href="https://open.kakao.com/o/s0nVpVYc" target="_blank" rel="noreferrer noopener">문의하기</Button>
        </Menu.Item>
        <Menu.Item className="menu">
          <Button className="button" href="/exit">탈퇴하기</Button>
        </Menu.Item>
        <Menu.Item className="menu">
          <Button className="button" href="/signup">회원가입</Button>
        </Menu.Item>
      </MenuWrapper>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6} />
      </Row>
      <FooterWrapper>
        <a className="tab" href="/men">
          <div><SmileTwoTone twoToneColor="orange" /></div>
          <div id="text">남자</div>
        </a>
        <a className="tab" href="/women">
          <div><SmileTwoTone twoToneColor="darkViolet" /></div>
          <div id="text">여자</div>
        </a>
        <a className="tab" href="/">
          <div><TeamOutlined style={{ color: 'deepskyblue' }} /></div>
          <div id="text">커뮤니티</div>
        </a>
        <a className="tab" href="/profile">
          <LockOutlined style={{ color: 'black' }} />
          <div id="text">내 프로필</div>
        </a>
      </FooterWrapper>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
