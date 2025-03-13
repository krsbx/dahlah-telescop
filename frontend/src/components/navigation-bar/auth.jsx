import React from 'react';
import useAuthStore from '../../store/auth';
import { Stack } from '@chakra-ui/react';
import SignUpForm from './sign-up';
import SignInForm from './sign-in';

function Auth() {
  const { token, auth } = useAuthStore();

  if (token && auth) return null;

  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      alignItems={'center'}
      h={'100%'}
      gap={3}
    >
      <SignUpForm />
      <SignInForm />
    </Stack>
  );
}

export default Auth;
