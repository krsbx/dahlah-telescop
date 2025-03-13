import { Link as RouterLink } from 'react-router-dom';
import { Link as ChakraLink } from '@chakra-ui/react';

/**
 * @param {Parameters<typeof ChakraLink>[0]} param0
 */
export function Link({ as: _, ...props }) {
  return (
    <ChakraLink
      borderRadius={'md'}
      as={RouterLink}
      bg={'white'}
      fontSize={'sm'}
      _hover={{
        textDecoration: 'none',
        bg: 'gray.200',
      }}
      px={3}
      py={2}
      {...props}
    />
  );
}
