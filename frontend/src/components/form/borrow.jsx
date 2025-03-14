import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Select,
  Stack,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import React from 'react';
import {
  OBSERVATION_OBJECT,
  OCCUPATION,
  TELESCOPE_TYPE,
} from '../../utils/constant';
import FileInput from '../file-input';

/** @param {Parameters<typeof Stack>[0] & { proposalRequired?: boolean; introductoryRequired?: boolean }} props */
function BorrowForm({
  onSubmit,
  errors,
  register,
  formState,
  children,
  values,
  onFileChange,
  onFileRemove,
  proposalRequired,
  introductoryRequired,
  ...props
}) {
  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={4} w={'100%'} px={2} {...props}>
        <FormControl isRequired isInvalid={!!errors.name}>
          <FormLabel>Nama Peminjam</FormLabel>
          <Input
            placeholder="Masukkan Nama Peminjam"
            {...register('name')}
            disabled={formState.isSubmitting}
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.email}>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Masukkan Email"
            {...register('email')}
            disabled={formState.isSubmitting}
          />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.nimNip}>
          <FormLabel>NIM/NIP</FormLabel>
          <Input
            placeholder="Masukkan NIM/NIP"
            {...register('nimNip')}
            disabled={formState.isSubmitting}
          />
          <FormErrorMessage>{errors.nimNip?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.occupation}>
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
          <FormErrorMessage>{errors.occupation?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.observationObject}>
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
          <FormErrorMessage>
            {errors.observationObject?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.rightAscescion}>
          <FormLabel>Asensio Rekta / Right Ascension</FormLabel>
          <Input
            {...register('rightAscescion')}
            placeholder="Masukkan Asensio Rekta"
            type="number"
            disabled={formState.isSubmitting}
          />
          <FormErrorMessage>{errors.rightAscescion?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.declination}>
          <FormLabel>Deklinasi / Declination</FormLabel>
          <Input
            {...register('declination')}
            placeholder="Masukkan Deklinasi / Declination"
            type="number"
            disabled={formState.isSubmitting}
          />
          <FormErrorMessage>{errors.declination?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.objectType}>
          <FormLabel>Jenis Objek Pengamatan</FormLabel>
          <Input
            {...register('objectType')}
            placeholder="Masukkan Jenis Objek Pengamatan"
            disabled={formState.isSubmitting}
          />
          <FormErrorMessage>{errors.objectType?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.magnitude}>
          <FormLabel>Magnitude</FormLabel>
          <Input
            {...register('magnitude')}
            placeholder="Masukkan Magnitude"
            type="number"
            disabled={formState.isSubmitting}
          />
          <FormErrorMessage>{errors.magnitude?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.telescopeType}>
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
          <FormErrorMessage>{errors.telescopeType?.message}</FormErrorMessage>
        </FormControl>

        <Grid templateColumns={'repeat(2, 1fr)'} columnGap={4}>
          <GridItem>
            <FormControl isRequired isInvalid={!!errors.borrowingTime}>
              <FormLabel>Waktu Peminjaman</FormLabel>
              <Input
                {...register('borrowingTime')}
                placeholder="Pilih Waktu Peminjaman"
                type="datetime-local"
                min={dayjs().format('YYYY-MM-DDTHH:mm')}
                disabled={formState.isSubmitting}
              />
              <FormErrorMessage>
                {errors.borrowingTime?.message}
              </FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired isInvalid={!!errors.borrowingTimeUntil}>
              <FormLabel>Waktu Selesai Peminjaman</FormLabel>
              <Input
                {...register('borrowingTimeUntil')}
                placeholder="Pilih Waktu Peminjaman"
                type="datetime-local"
                min={dayjs().format('YYYY-MM-DDTHH:mm')}
                disabled={formState.isSubmitting}
              />
              <FormErrorMessage>
                {errors.borrowingTimeUntil?.message}
              </FormErrorMessage>
            </FormControl>
          </GridItem>
        </Grid>

        <Grid templateColumns={'repeat(2, 1fr)'} columnGap={4}>
          <GridItem>
            <FormControl isRequired isInvalid={!!errors.proposal}>
              <FormLabel>Upload Proposal</FormLabel>
              <FileInput
                value={values.proposal?.[0]}
                onFileChange={onFileChange}
                onRemove={onFileRemove}
                name="proposal"
                disabled={formState.isSubmitting}
              />
              <FormErrorMessage>{errors.proposal?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired isInvalid={!!errors.introductory}>
              <FormLabel>Upload Surat Pengantar</FormLabel>
              <FileInput
                value={values.introductory?.[0]}
                onFileChange={onFileChange}
                onRemove={onFileRemove}
                name="introductory"
                disabled={formState.isSubmitting}
              />
              <FormErrorMessage>
                {errors.introductory?.message}
              </FormErrorMessage>
            </FormControl>
          </GridItem>
        </Grid>

        {children}

        <Button w={'100%'} type="submit">
          Submit
        </Button>
      </Stack>
    </form>
  );
}

export default BorrowForm;
