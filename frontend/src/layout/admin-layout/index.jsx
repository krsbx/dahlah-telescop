import { Avatar, Box, Button, Flex, Stack, Text } from '@chakra-ui/react';
import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth';
import AdminLink from './admin-link';

function AdminLayout({ children, title }) {
  const navigation = useNavigate();
  const { token, auth, removeToken } = useAuthStore();

  const onLogout = useCallback(() => {
    removeToken();
    navigation('/', {
      replace: true,
    });
  }, [removeToken, navigation]);

  useEffect(() => {
    if (token && auth) return;

    return navigation('/', {
      replace: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack h={'100vh'} w={'100vw'}>
      <Flex
        bg={'blue.700'}
        justifyContent={'flex-end'}
        alignItems={'center'}
        w={'calc(100vw - 12.5rem)'}
        right={0}
        h={'4rem'}
        position={'fixed'}
        zIndex={999}
        px={3}
      >
        <Text
          color={'white'}
          fontWeight={'bold'}
          fontSize={'xl'}
          textAlign={'right'}
        >
          {title}
        </Text>
      </Flex>
      <Box position={'fixed'} w={'full'}>
        <Flex
          alignItems={'center'}
          flexDirection={'column'}
          w={'12.5rem'}
          bg={'blue.700'}
          h={'100vh'}
          px={2}
          py={5}
          pt={16}
          gap={4}
        >
          <Avatar size={'2xl'} />
          <Flex alignItems={'center'} flexDirection={'column'} gap={2}>
            <AdminLink
              href={'/admin/accounts'}
              title={'Akun'}
              w={'100%'}
              textAlign={'center'}
            />
            <AdminLink
              href={'/admin/borrows'}
              title={'Peminjaman'}
              w={'100%'}
              textAlign={'center'}
            />
            <Button
              onClick={onLogout}
              colorScheme="red"
              fontSize={'xs'}
              mt={4}
              w={'100%'}
            >
              Keluar
            </Button>
          </Flex>
        </Flex>
      </Box>
      <Box pl={'12.5rem'} pt={'4rem'} h={'100%'} w={'100%'}>
        {children}
      </Box>
    </Stack>
  );
}

export default AdminLayout;
