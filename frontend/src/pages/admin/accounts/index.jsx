import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import useUsersStore from '../../../store/users';
import { deleteUser, listUser } from '../../../api/users';
import AdminLayout from '../../../layout/admin-layout';
import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { USER_ROLES } from '../../../utils/constant';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/auth';

function Accounts() {
  const navigation = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [search, setSearch] = useState('');
  const { auth } = useAuthStore();
  const { users } = useUsersStore();

  const filteredUsers = useMemo(() => {
    if (!search) return users;

    return users.filter((user) => {
      const fields = ['fullName', 'email', 'role'];

      const lowered = search.toLowerCase();

      return fields.some((field) =>
        user[field].toLowerCase().includes(lowered)
      );
    });
  }, [users, search]);

  const onDeleteConfirm = useCallback(async () => {
    if (!deleteCandidate) return;

    try {
      setIsDeleting(true);

      await deleteUser(deleteCandidate.userId);
      await listUser({ limit: 'all' });
    } catch (e) {
      console.log(e);
    } finally {
      setIsDeleting(false);
      onClose();
    }
  }, [deleteCandidate, onClose]);

  const onDelete = useCallback(
    (user) => () => {
      setDeleteCandidate(user);
      onOpen();
    },
    [onOpen]
  );

  useEffect(() => {
    listUser({
      limit: 'all',
    })
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  return (
    <AdminLayout title={'Accounts'}>
      <DataTable
        data={filteredUsers}
        actions={
          <Flex gap={2}>
            <Flex position={'relative'}>
              <Input
                placeholder={'Cari akun'}
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                pr={search ? 6 : 4}
              />
              {search && (
                <Button
                  variant={'none'}
                  onClick={() => setSearch('')}
                  position={'absolute'}
                  right={0}
                  zIndex={999}
                  top={0}
                  p={1}
                >
                  <IoClose />
                </Button>
              )}
            </Flex>
            <Button fontSize={'xs'} onClick={() => navigation('add  ')}>
              Tambah Akun
            </Button>
          </Flex>
        }
        title={
          <Text fontWeight={'bold'} fontSize={'lg'}>
            Daftar Akun
          </Text>
        }
        fixedHeader
        pagination
        progressPending={isFetching}
        columns={[
          {
            name: (
              <Text fontSize={'sm'} fontWeight={'bold'}>
                Nama Lengkap
              </Text>
            ),
            selector: (row) => row.fullName,
          },
          {
            name: (
              <Text fontSize={'sm'} fontWeight={'bold'}>
                Email
              </Text>
            ),
            selector: (row) => row.email,
          },
          {
            name: (
              <Text fontSize={'sm'} fontWeight={'bold'}>
                Role
              </Text>
            ),
            cell: (row) =>
              USER_ROLES.find((role) => role.value === row.role)?.title ||
              row.role,
          },
          {
            name: 'Action',
            cell: (row) => (
              <Flex gap={2}>
                <Button
                  size={'xs'}
                  onClick={() => navigation(`edit/${row.userId}`)}
                >
                  Lihat
                </Button>
                {auth.userId !== row.userId && (
                  <Button size={'xs'} onClick={onDelete(row)}>
                    Hapus
                  </Button>
                )}
              </Flex>
            ),
          },
        ]}
      />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        closeOnOverlayClick={!isDeleting}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex justifyContent={'space-between'} alignItems={'center'}>
              <Text fontSize={'xl'} fontWeight={'bold'}>
                Hapus Akun
              </Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton disabled={isDeleting} />
          <ModalBody>
            <Text>
              Apakah anda yakin ingin menghapus akun {deleteCandidate?.fullName}
              ?
            </Text>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button
              color="white"
              bg={'red.500'}
              onClick={onDeleteConfirm}
              isLoading={isDeleting}
            >
              Yakin
            </Button>
            <Button onClick={onClose} isLoading={isDeleting}>
              Batal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AdminLayout>
  );
}

export default Accounts;
