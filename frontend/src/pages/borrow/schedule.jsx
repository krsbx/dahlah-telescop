import dayjs from 'dayjs';
import 'dayjs/locale/id';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import React, { useEffect, useState } from 'react';
import MainLayout from '../../layout/main-layout';
import {
  Flex,
  Table,
  TableContainer,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import useBorrowingsStore from '../../store/borrowings';
import { listBorrowing } from '../../api/borrowings';
import { TELESCOPE_TYPE } from '../../utils/constant';

dayjs.extend(localizedFormat);

function BorrowTelescopeSchedule() {
  const [isFetching, setIsFetching] = useState(true);
  const { borrowings } = useBorrowingsStore();

  useEffect(() => {
    listBorrowing()
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  return (
    <MainLayout>
      <Flex
        alignItems={'center'}
        justifyContent={'center'}
        flexDir={'column'}
        gap={4}
        py={5}
      >
        <Text fontWeight={'bold'} textTransform={'uppercase'} fontSize={'xl'}>
          Peminjaman Teleskop
        </Text>
        <TableContainer py={10}>
          <Table variant="striped" colorScheme="black">
            <Thead>
              <Tr
                color={'black'}
                fontWeight={'bold'}
                fontSize={'20'}
                textAlign={'center'}
              >
                <Th
                  color={'black'}
                  te
                  fontWeight={'bold'}
                  fontSize={'15'}
                  textAlign={'center'}
                >
                  Nama Peminjam
                </Th>
                <Th
                  color={'black'}
                  fontWeight={'bold'}
                  fontSize={'15'}
                  textAlign={'center'}
                >
                  Teleskop
                </Th>
                <Th
                  color={'black'}
                  fontWeight={'bold'}
                  fontSize={'15'}
                  textAlign={'center'}
                >
                  Waktu
                </Th>
              </Tr>
            </Thead>
            {isFetching ? (
              <Tr>
                <Th colSpan={3} textAlign={'center'}>
                  Loading...
                </Th>
              </Tr>
            ) : (
              borrowings.map((borrowing) => (
                <Tr key={`${borrowing.borrowingId}`}>
                  <Th textAlign={'center'}>{borrowing.name}</Th>
                  <Th textAlign={'center'}>
                    {TELESCOPE_TYPE.find(
                      (tt) => tt.value === borrowing.telescopeType
                    )?.title || borrowing.telescopeType}
                  </Th>
                  <Th textAlign={'center'}>
                    {dayjs(borrowing.borrowingDate)
                      .locale('id')
                      .format('dddd, DD MMMM YYYY HH:mm')}
                  </Th>
                </Tr>
              ))
            )}
          </Table>
        </TableContainer>
      </Flex>
    </MainLayout>
  );
}

export default BorrowTelescopeSchedule;
