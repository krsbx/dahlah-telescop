import {
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
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { deleteBorrowing, listBorrowing } from '../../../api/borrowings';
import AdminLayout from '../../../layout/admin-layout';
import useBorrowingsStore from '../../../store/borrowings';
import { TELESCOPE_TYPE } from '../../../utils/constant';

dayjs.extend(localizedFormat);

function Borrows() {
  const navigation = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [search, setSearch] = useState('');
  const { borrowings } = useBorrowingsStore();

  const filteredBorrowings = useMemo(() => {
    if (!search) return borrowings;

    return borrowings.filter((borrow) => {
      const fields = [
        'name',
        'email',
        'nimNip',
        'occupation',
        'telescopeType',
        'objectType',
        'observationObject',
      ];

      const lowered = search.toLowerCase();

      return fields.some((field) =>
        borrow[field].toLowerCase().includes(lowered)
      );
    });
  }, [borrowings, search]);

  const onDeleteConfirm = useCallback(async () => {
    if (!deleteCandidate) return;

    try {
      setIsDeleting(true);

      await deleteBorrowing(deleteCandidate.borrowingId);
      await listBorrowing({ limit: 'all' });
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
    listBorrowing({
      limit: 'all',
    })
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  return (
    <AdminLayout title={'Peminjaman'}>
      <DataTable
        data={filteredBorrowings}
        actions={
          <Flex gap={2}>
            <Flex position={'relative'}>
              <Input
                placeholder={'Cari Peminjam'}
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
            <Button fontSize={'xs'} onClick={() => navigation('add')}>
              Tambah Peminjaman
            </Button>
          </Flex>
        }
        title={
          <Text fontWeight={'bold'} fontSize={'lg'}>
            Daftar Peminjaman
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
            selector: (row) => row.name,
          },
          {
            name: (
              <Text fontSize={'sm'} fontWeight={'bold'}>
                Teleskop
              </Text>
            ),
            selector: (row) =>
              TELESCOPE_TYPE.find((tt) => tt.value === row.telescopeType)
                ?.title || row.telescopeType,
          },
          {
            name: (
              <Text fontSize={'sm'} fontWeight={'bold'}>
                Waktu
              </Text>
            ),
            selector: (row) =>
              dayjs(row.borrowingDate)
                .locale('id')
                .format('dddd, DD MMMM YYYY HH:mm'),
          },
          {
            name: (
              <Text fontSize={'sm'} fontWeight={'bold'}>
                Action
              </Text>
            ),
            cell: (row) => (
              <Flex gap={2}>
                <Button
                  size={'xs'}
                  onClick={() => navigation(`edit/${row.borrowingId}`)}
                >
                  Lihat
                </Button>
                <Button size={'xs'} onClick={onDelete(row)}>
                  Hapus
                </Button>
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
                Hapus Peminjaman
              </Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton disabled={isDeleting} />
          <ModalBody>
            <Text>
              Apakah anda yakin ingin menghapus peminjaman{' '}
              {deleteCandidate?.name}?
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

export default Borrows;
