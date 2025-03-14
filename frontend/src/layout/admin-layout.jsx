import {
  Avatar,
  Box,
  Center,
  Flex,
  Spacer,
  Stack,
  Text,
  WrapItem,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import useAuthStore from '../store/auth';
import { useNavigate } from 'react-router-dom';

function AdminLayout({ children, title }) {
  const navigation = useNavigate();
  const { token, auth } = useAuthStore();

  useEffect(() => {
    if (token && auth) return;

    return navigation('/', {
      replace: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack h={'100vh'} w={'100vw'}>
      <Box position={'fixed'} w={'full'}>
        <Flex
          bg={'blue.700'}
          justifyContent={'flex-end'}
          alignItems={'center'}
          w={'full'}
          h={'4rem'}
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
        <Flex
          bg={'blue.700'}
          px={2}
          py={5}
          w={'12.5rem'}
          h={'100vh'}
          justifyContent={'center'}
        >
          <Avatar size={'2xl'} />
        </Flex>
      </Box>
      <Box
        pl={'12.5rem'}
        pt={'4rem'}
        h={'calc(100vh - 4rem)'}
        w={'100%'}
        overflow={'auto'}
      >
        {children}
      </Box>
    </Stack>
  );
}

export default AdminLayout;
