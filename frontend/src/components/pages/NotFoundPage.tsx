import React from 'react';
import styled from 'styled-components';
import Layout from '../commons/layout/Layout';
import NotFoundImage from '../../assets/icon/404.svg';

export default function NotFoundPage() {
  return (
    <Layout>
      <NotFoundImg src={NotFoundImage} />
    </Layout>
  );
}

const NotFoundImg = styled.img`
  width: 100%;
  padding-top: 20rem;
`;
