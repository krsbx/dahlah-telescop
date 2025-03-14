import React, { useCallback, useState } from 'react';
import useAuthStore from '../store/auth';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoClose } from 'react-icons/io5';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
} from '@chakra-ui/react';
import { Link } from './link';
import Auth from './navigation-bar/auth';
import { USER_ROLE } from '../utils/constant';

function AvatarProfile() {
  const { token, auth, removeToken } = useAuthStore();

  const navigation = useNavigate();
  const onLogout = useCallback(() => {
    removeToken();
    navigation('/', {
      replace: true,
    });
  }, [removeToken, navigation]);

  if (!token || !auth) return null;

  return (
    <Menu>
      <MenuButton
        as={Button}
        _hover={{ bg: 'gray.400' }}
        _focus={{ boxShadow: 'md' }}
        rounded={'full'}
        variant={'link'}
        cursor={'pointer'}
        minW={0}
      >
        <Avatar size="md" width={10} height={10}></Avatar>
      </MenuButton>
      <MenuList alignItems={'center'} p="3" direction="ltr">
        {auth?.role === USER_ROLE.ADMIN ? (
          <>
            <RouterLink to="/admin">
              <MenuItem color={'black'}>Admin Panel</MenuItem>
            </RouterLink>
            <MenuDivider />
          </>
        ) : null}
        <RouterLink to="/" onClick={onLogout}>
          <MenuItem
            _hover={{ bg: 'red.600' }}
            variant={'solid'}
            boxShadow="md"
            borderRadius={'lg'}
            bg="red.500"
            color={'white'}
            minW="full"
          >
            Keluar
          </MenuItem>
        </RouterLink>
      </MenuList>
    </Menu>
  );
}

/**
 * @param {Parameters<typeof Stack>[0]} props
 */
function RightSide({ children, ...props }) {
  const { token, auth } = useAuthStore();

  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      alignItems={'center'}
      h={'100%'}
      gap={3}
      {...props}
    >
      <Link to="/">Beranda</Link>
      {token && auth ? <Link to="/borrows">Peminjaman</Link> : null}
      <Link to="/borrows/schedule">Jadwal</Link>
      {children}
      <AvatarProfile />
    </Stack>
  );
}

function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);

  const onToggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <Box>
      <Flex
        justifyContent={'space-between'}
        alignItems={'center'}
        bg={'gray.500'}
        p={4}
      >
        <Image w={12} src="/itera.svg" />
        <RightSide display={{ base: 'none', md: 'flex' }}>
          <Auth />
        </RightSide>
        <Button
          onClick={onToggle}
          display={{ base: 'flex', md: 'none' }}
          variant={'ghost'}
          color={'white'}
          p={0}
        >
          {isOpen ? <IoClose /> : <GiHamburgerMenu />}
        </Button>
      </Flex>
      <RightSide
        display={{ base: 'flex', md: 'none' }}
        alignItems={'center'}
        bg={'gray.500'}
        h={isOpen ? 'calc(100vh - 91px)' : 0}
        overflow={isOpen ? 'visible' : 'hidden'}
      >
        <Auth />
      </RightSide>
    </Box>
  );
}

export default NavigationBar;
