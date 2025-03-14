import { useEffect, useState } from 'react';
import MainLayout from '../layout/main-layout';
import { Flex } from '@chakra-ui/react';
import { getStats } from '../api/files';
import useStatsStore from '../store/stats';

function Home() {
  const { stats } = useStatsStore();
  /**
   * Update this later to show tables
   */
  return null;
}

function HomeWithLayout() {
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    getStats()
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  if (isFetching) {
    return (
      <MainLayout>
        <Flex
          alignItems={'center'}
          justifyContent={'center'}
          w={'full'}
          h={'full'}
        >
          Loading...
        </Flex>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Home />
    </MainLayout>
  );
}

export default HomeWithLayout;
