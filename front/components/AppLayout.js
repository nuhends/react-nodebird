import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { Router } from 'next/router';
import PropTypes from 'prop-types'; 
import { Menu, Input, Row, Col } from 'antd';

import UserProfile from '../components/UserProfile';
import LoginForm from '../components/LoginForm';

import styled, { createGlobalStyle } from 'styled-components';
import useInput from '../hooks/useInput';

const SearchInput = styled(Input.Search)`
  vertical-align: middle
`;

const Global = createGlobalStyle`
  .ant-row {
    margin-right: 0 !important;
    margin-left: 0 !important;
  }

  .ant-col:first-child {
    padding-left: 0 !important;
  }

  .ant-col:last-child {
    padding-right: 0 !important;
  }
`;

const AppLayout = ({ children }) => {
  const [searchInput, onChangeSearchInput] = useInput('');
  const { me } = useSelector((state) => state.user);

  const onSearch = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`);
  }, [searchInput]);

   return (
     <div>
      <Global />
      <Menu mode="horizontal">
        <Menu.Item key="index">
          <Link href="/">
            <a>노드버드</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="profile">
          <Link href="/profile">
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="search">
          <SearchInput 
            placeholder="검색어 입력"
            value={searchInput}
            enterButton
            onChange={onChangeSearchInput}
            onSearch={onSearch}
          />
        </Menu.Item>
        <Menu.Item key="signup">
          <Link href="/signup">
            <a>회원가입</a>
          </Link>
        </Menu.Item>
      </Menu>
      {/* xs: 모바일, sm: 태블릿, md: 작은 데스크탑 */}
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? (
            <UserProfile />
          ) : (
            <LoginForm />
          )}
          
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <a href="https://nuhends.tistory.com" target="_blank" rel="noreferrer noopener">Made by nuhends</a>
        </Col>
      </Row>
     </div>
   );
}

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AppLayout;
