import { Box, Flex, Select } from '@chakra-ui/react';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { getStats } from '../api/files';
import MainLayout from '../layout/main-layout';
import useStatsStore from '../store/stats';
import { avgStatsByHour, groupStatsByHour } from '../utils/charts';
import { CHARTS_OPTIONS } from '../utils/constant';
import dayjs from 'dayjs';
import DownloadAws from '../components/download-aws';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Home() {
  const [filter, setFilter] = useState();
  const usedFilter = useMemo(
    () => CHARTS_OPTIONS.find((o) => o.value === filter),
    [filter]
  );
  const [isChanged, setIsChanged] = useState(false);
  const stats = useStatsStore((state) => state.stats);
  const data = useMemo(() => {
    const group = groupStatsByHour(stats, dayjs().get('hour'));
    const avg = avgStatsByHour(group);

    return avg;
  }, [stats]);
  const labels = useMemo(() => Object.keys(data).map((k) => `${k}:00`), [data]);
  const dataSet = useMemo(() => {
    if (!usedFilter) return [];

    return Object.values(data).map((s) => s[usedFilter.value]);
  }, [data, usedFilter]);

  useEffect(() => {
    if (!isChanged) return;

    setTimeout(() => {
      setIsChanged(false);
    }, 300);
  }, [isChanged]);

  return (
    <Flex
      w={'full'}
      h={'full'}
      alignItems={'center'}
      gap={2}
      flexDirection={'column'}
      px={5}
    >
      <Select
        value={filter}
        onChange={(e) => {
          setFilter(e.target.value);
          setIsChanged(true);
        }}
        placeholder="Pilih Chart"
      >
        {CHARTS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.title}
          </option>
        ))}
      </Select>
      <Flex w={'75vw'}>
        {!isChanged && (
          <Line
            options={{
              responsive: true,
            }}
            data={{
              labels: labels,
              datasets: [
                {
                  label: usedFilter?.title,
                  data: dataSet,
                },
              ],
            }}
          />
        )}
      </Flex>
      <DownloadAws />
    </Flex>
  );
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
