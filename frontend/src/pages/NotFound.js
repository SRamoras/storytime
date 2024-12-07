// src/pages/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f9fa;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 4rem;
  color: #343a40;
`;

const Message = styled.p`
  font-size: 1.5rem;
  color: #6c757d;
  margin-bottom: 2rem;
`;

const HomeButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 0.25rem;
  text-decoration: none;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const NotFound = () => {
  return (
    <Container>
      <Title>404</Title>
      <Message>Oops! A página que você está procurando não foi encontrada.</Message>
      <HomeButton to="/">Voltar para Home</HomeButton>
    </Container>
  );
};

export default NotFound;
