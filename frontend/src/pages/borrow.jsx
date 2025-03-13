import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Select,
  Stack,
  Text,
} from '@chakra-ui/react';
import { IoClose } from 'react-icons/io5';
import React, { useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { borrowTelescopeSchema } from '../validations/borrow';
import MainLayout from '../layout/main-layout';
import {
  OBSERVATION_OBJECT,
  OCCUPATION,
  TELESCOPE_TYPE,
} from '../utils/constant';
import { uploadFile } from '../api/files';
import { createBorrowing } from '../api/borrowings';
import useAuthStore from '../store/auth';

function FileInput({ name, value, onFileChange, onRemove, disabled }) {
  const ref = useRef();

  const onClick = useCallback(() => {
    ref.current.click();
  }, []);

  return (
    <Box>
      <Input
        onChange={onFileChange}
        name={name}
        accept={'application/pdf,application/doc,application/docx'}
        type="file"
        hidden
        ref={ref}
      />
      {value ? (
        <Box
          px={3}
          py={2}
          borderRadius={'md'}
          border="1px"
          borderColor="gray.200"
          w={'100%'}
          position={'relative'}
        >
          {value.name}
          <Button
            variant={'ghost'}
            onClick={onRemove(name)}
            position={'absolute'}
            disabled={disabled}
            right={0}
            top={0}
            p={1}
          >
            <IoClose />
          </Button>
        </Box>
      ) : (
        <Button w={'100%'} onClick={onClick} disabled={disabled}>
          Upload
        </Button>
      )}
    </Box>
  );
}

function BorrowTelescope() {
  const { auth } = useAuthStore();
  const { register, handleSubmit, formState, setValue, watch } = useForm({
    defaultValues: {
      name: '',
      email: '',
      occupation: '',
      nimNip: '',
      rightAscescion: '',
      declination: '',
      magnitude: '',
      observationObject: '',
      objectType: '',
      telescopeType: '',
      proposal: '',
      introductory: '',
      borrowingTime: '',
      borrowingTimeUntil: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(borrowTelescopeSchema),
  });
  const values = watch();

  const onFileChange = useCallback(
    /** @param {React.ChangeEvent<HTMLInputElement>} e } */
    (e) => {
      const { name, files } = e.target;

      setValue(name, files);
    },
    [setValue]
  );

  const onRemove = useCallback(
    (name) => () => {
      setValue(name, '');
    },
    [setValue]
  );

  const onSubmit = useCallback(async (data) => {
    const [{ url: proposalUrl }, { url: introductoryUrl }] = await Promise.all([
      uploadFile(data.proposal[0]),
      uploadFile(data.introductory[0]),
    ]);

    data.proposalUrl = `${import.meta.env.VITE_API_BASE_URL}${proposalUrl}`;
    data.introductoryUrl = `${import.meta.env.VITE_API_BASE_URL}${introductoryUrl}`;

    return createBorrowing({
      ...data,
      userId: auth.userId,
      proposalUrl,
      introductoryUrl,
    });
  }, [auth?.userId]);

  return (
    <MainLayout isProtected>
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4} w={'100%'} px={2}>
            <FormControl isRequired>
              <FormLabel>Nama Peminjaman</FormLabel>
              <Input
                placeholder="Masukkan Nama Peminjam"
                {...register('name')}
                disabled={formState.isSubmitting}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="Masukkan Email"
                {...register('email')}
                disabled={formState.isSubmitting}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>NIM/NIP</FormLabel>
              <Input
                placeholder="Masukkan NIM/NIP"
                {...register('nimNip')}
                disabled={formState.isSubmitting}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Status/Pekerjaan</FormLabel>
              <Select
                {...register('occupation')}
                placeholder="Pilih Status/Pekerjaan"
                disabled={formState.isSubmitting}
              >
                {OCCUPATION.map((oc) => (
                  <option value={oc.value} key={`${oc.value}-${oc.title}`}>
                    {oc.title}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Objek Penelitian</FormLabel>
              <Select
                {...register('observationObject')}
                placeholder="Pilih Objek Penelitian"
                disabled={formState.isSubmitting}
              >
                {OBSERVATION_OBJECT.map((oo) => (
                  <option value={oo.value} key={`${oo.value}-${oo.title}`}>
                    {oo.title}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Asensio Rekta / Right Ascension</FormLabel>
              <Input
                {...register('rightAscescion')}
                placeholder="Masukkan Asensio Rekta"
                type="number"
                disabled={formState.isSubmitting}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Deklinasi / Declination</FormLabel>
              <Input
                {...register('declination')}
                placeholder="Masukkan Deklinasi / Declination"
                type="number"
                disabled={formState.isSubmitting}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Jenis Objek Pengamatan</FormLabel>
              <Input
                {...register('objectType')}
                placeholder="Masukkan Jenis Objek Pengamatan"
                disabled={formState.isSubmitting}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Magnitude</FormLabel>
              <Input
                {...register('magnitude')}
                placeholder="Masukkan Magnitude"
                type="number"
                disabled={formState.isSubmitting}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Teleskop / Telescope</FormLabel>
              <Select
                {...register('telescopeType')}
                placeholder="Pilih Teleskop / Telescope"
                disabled={formState.isSubmitting}
              >
                {TELESCOPE_TYPE.map((tt) => (
                  <option value={tt.value} key={`${tt.value}-${tt.title}`}>
                    {tt.title}
                  </option>
                ))}
              </Select>
            </FormControl>

            <Grid templateColumns={'repeat(2, 1fr)'} columnGap={4}>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel>Waktu Peminjaman</FormLabel>
                  <Input
                    {...register('borrowingTime')}
                    placeholder="Pilih Waktu Peminjaman"
                    type="datetime-local"
                    disabled={formState.isSubmitting}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isRequired>
                  <FormLabel>Waktu Selesai Peminjaman</FormLabel>
                  <Input
                    {...register('borrowingTimeUntil')}
                    placeholder="Pilih Waktu Peminjaman"
                    type="datetime-local"
                    disabled={formState.isSubmitting}
                  />
                </FormControl>
              </GridItem>
            </Grid>

            <Grid templateColumns={'repeat(2, 1fr)'} columnGap={4}>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel>Upload Proposal</FormLabel>
                  <FileInput
                    value={values.proposal?.[0]}
                    onFileChange={onFileChange}
                    onRemove={onRemove}
                    name="proposal"
                    disabled={formState.isSubmitting}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isRequired>
                  <FormLabel>Upload Surat Pengantar</FormLabel>
                  <FileInput
                    value={values.introductory?.[0]}
                    onFileChange={onFileChange}
                    onRemove={onRemove}
                    name="introductory"
                    disabled={formState.isSubmitting}
                  />
                </FormControl>
              </GridItem>
            </Grid>

            <Button w={'100%'} type="submit">
              Submit
            </Button>
          </Stack>
        </form>
      </Flex>
    </MainLayout>
  );
}

export default BorrowTelescope;
