import React from 'react';
import { Link } from '../../components/link';
import { useLocation } from 'react-router-dom';

/** @param {Parameters<typeof Link>[0]} param0 */
function AdminLink({ href, title, ...props }) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(href);

  return (
    <Link
      to={href}
      {...props}
      bg={isActive ? 'gray.400' : 'white'}
      color={isActive ? 'white' : 'black'}
      _hover={{
        bg: isActive ? 'gray.300' : 'gray.200',
      }}
    >
      {title}
    </Link>
  );
}

export default AdminLink;
