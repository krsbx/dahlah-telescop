import { Stack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import NavigationBar from '../components/navigation-bar';
import useAuthStore from '../store/auth';
import { useNavigate } from 'react-router-dom';

function MainLayout({ children, isProtected }) {
  const navigation = useNavigate();
  const { token, auth } = useAuthStore();

  useEffect(() => {
    if (!isProtected) return;
    if (token && auth) return;

    return navigation('/', {
      replace: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack h={'100vh'} w={'100vw'}>
      <NavigationBar />
      {children}
    </Stack>
  );
}

export default MainLayout;
