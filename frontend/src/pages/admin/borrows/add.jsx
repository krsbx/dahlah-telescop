import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select as ChakraSelect,
  Text,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select } from 'chakra-react-select';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { createBorrowing } from '../../../api/borrowings';
import { listUser } from '../../../api/users';
import BorrowForm from '../../../components/form/borrow';
import AdminLayout from '../../../layout/admin-layout';
import useAuthStore from '../../../store/auth';
import useUsersStore from '../../../store/users';
import { borrowTelescopeSchema } from '../../../validations/borrow';
import { BORROWING_STATUS, BORROWING_STATUSES } from '../../../utils/constant';
import { uploadFile } from '../../../api/files';

function AddBorrow() {
  const navigation = useNavigate();
  const [isFetching, setIsFetching] = useState(true);
  const { auth } = useAuthStore();
  const { users } = useUsersStore();
  const usersOptions = useMemo(() => {
    return users.map((user) => ({
      label: user.fullName,
      value: user.userId,
    }));
  }, [users]);
  const { register, handleSubmit, formState, setValue, watch, control } =
    useForm({
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
        user: {
          label: auth.fullName,
          value: auth.userId,
        },
        status: BORROWING_STATUS.PENDING,
      },
      mode: 'onBlur',
      resolver: zodResolver(
        borrowTelescopeSchema.extend({
          user: z.object({
            label: z.string(),
            value: z.coerce.number(),
          }),
          status: z.enum(BORROWING_STATUSES.map((status) => status.value)),
        })
      ),
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

  const onFileRemove = useCallback(
    (name) => () => {
      setValue(name, '');
    },
    [setValue]
  );

  const onSubmit = useCallback(
    async (data) => {
      if (data.user && typeof data.user === 'object') {
        data.userId = data.user.value;
      }

      const [{ url: proposalUrl }, { url: introductoryUrl }] =
        await Promise.all([
          uploadFile(data.proposal[0]),
          uploadFile(data.introductory[0]),
        ]);

      data.proposalUrl = `${import.meta.env.VITE_API_BASE_URL}${proposalUrl}`;
      data.introductoryUrl = `${import.meta.env.VITE_API_BASE_URL}${introductoryUrl}`;

      const borrowing = await createBorrowing(data);

      if (borrowing.borrowingId) {
        navigation(`/admin/borrows/edit/${borrowing.borrowingId}`);
        return;
      }

      navigation(`/admin/borrows`);
    },
    [navigation]
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
    <AdminLayout title={'Tambah Peminjaman'}>
      <Flex
        alignItems={'center'}
        justifyContent={'center'}
        flexDir={'column'}
        gap={4}
        py={5}
      >
        <Text
          fontWeight={'bold'}
          textTransform={'uppercase'}
          fontSize={'xl'}
          textAlign={'center'}
        >
          Peminjaman Teleskop
        </Text>

        <BorrowForm
          errors={formState.errors}
          formState={formState}
          onFileChange={onFileChange}
          onFileRemove={onFileRemove}
          onSubmit={handleSubmit(onSubmit)}
          register={register}
          values={values}
        >
          <FormControl isRequired isInvalid={!!formState.errors.status}>
            <FormLabel>Status Peminjaman</FormLabel>
            <ChakraSelect
              placeholder="Pilih Status"
              {...register('status')}
              disabled={formState.isSubmitting}
            >
              {BORROWING_STATUSES.map((status) => (
                <option
                  key={`${status.value}-${status.title}`}
                  value={status.value}
                >
                  {status.title}
                </option>
              ))}
            </ChakraSelect>
            <FormErrorMessage>
              {formState.errors.status?.message}
            </FormErrorMessage>
          </FormControl>

          <Controller
            control={control}
            name="user"
            render={({ field, fieldState, formState }) => (
              <FormControl isRequired isInvalid={fieldState.invalid}>
                <FormLabel>Peminjaman Untuk</FormLabel>
                <Select
                  {...field}
                  placeholder="Pilih Peminjam"
                  isMulti={false}
                  isClearable
                  isSearchable
                  options={usersOptions}
                  isLoading={isFetching}
                  isDisabled={formState.isSubmitting}
                />
                <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
              </FormControl>
            )}
          />
        </BorrowForm>
      </Flex>
    </AdminLayout>
  );
}

export default AddBorrow;
