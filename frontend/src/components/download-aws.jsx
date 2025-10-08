import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Text,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback } from 'react';
import { downloadAwsSchema } from '../validations/download';
import dayjs from 'dayjs';
import { getAws } from '../api/files';

function DownloadAws() {
  const {
    register,
    handleSubmit,
    formState: { errors, ...formState },
    reset,
  } = useForm({
    defaultValues: {},
    mode: 'onBlur',
    resolver: zodResolver(downloadAwsSchema),
  });

  const onSubmit = useCallback(
    async (data) => {
      const file = await getAws(data.startDate, data.endDate);

      // Download file
      const url = window.URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      reset();
    },
    [reset]
  );

  return (
    <Flex w={'full'} h={'full'} flexDirection={'column'} gap={2}>
      <Text fontWeight={'bold'}>
        Unduh Data Automatic Weather Station (AWS)
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex gap={2} flexDirection={'column'}>
          <Grid templateColumns={'repeat(2, 1fr)'} columnGap={4}>
            <GridItem>
              <FormControl isRequired isInvalid={!!errors.startDate}>
                <FormLabel>Tanggal Mulai AWS</FormLabel>
                <Input
                  {...register('startDate')}
                  placeholder="Pilih Waktu AWS"
                  type="date"
                  min={dayjs().subtract(7, 'days').format('YYYY-MM-DD')}
                  max={dayjs().format('YYYY-MM-DD')}
                  disabled={formState.isSubmitting}
                />
                <FormErrorMessage>{errors.startDate?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isInvalid={!!errors.endDate}>
                <FormLabel>Tanggal Selesai AWS</FormLabel>
                <Input
                  {...register('endDate')}
                  placeholder="Pilih Waktu AWS"
                  type="date"
                  min={dayjs().subtract(6, 'days').format('YYYY-MM-DD')}
                  max={dayjs().format('YYYY-MM-DD')}
                  disabled={formState.isSubmitting}
                />
                <FormErrorMessage>{errors.endDate?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
          </Grid>
          <Button
            type="submit"
            isLoading={formState.isSubmitting}
            disabled={formState.isSubmitting}
          >
            Unduh
          </Button>
        </Flex>
      </form>
    </Flex>
  );
}

export default DownloadAws;
