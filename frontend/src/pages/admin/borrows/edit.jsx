import {
  Select as ChakraSelect,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select } from 'chakra-react-select';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { findBorrowing, updateBorrowing } from '../../../api/borrowings';
import { getFile, uploadFile } from '../../../api/files';
import { listUser } from '../../../api/users';
import BorrowForm from '../../../components/form/borrow';
import AdminLayout from '../../../layout/admin-layout';
import useUsersStore from '../../../store/users';
import { BORROWING_STATUS, BORROWING_STATUSES } from '../../../utils/constant';
import { updateBorrowTelescopeSchema } from '../../../validations/borrow';

function EditBorrow() {
  const navigation = useNavigate();
  const [isFetching, setIsFetching] = useState(true);
  const { users } = useUsersStore();
  const borrowingId = useParams()?.borrowingId;
  const originalFileRef = useRef({
    proposal: null,
    introductory: null,
  });
  const usersOptions = useMemo(() => {
    return users.map((user) => ({
      label: user.fullName,
      value: user.userId,
    }));
  }, [users]);

  const { register, handleSubmit, formState, setValue, watch, control, reset } =
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
          label: '',
          value: '',
        },
        status: BORROWING_STATUS.PENDING,
      },
      mode: 'onBlur',
      resolver: zodResolver(updateBorrowTelescopeSchema),
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
      try {
        if (data.user && typeof data.user === 'object') {
          data.userId = data.user.value;
        }

        if (data.proposal[0] !== originalFileRef.current.proposal) {
          const { url: proposalUrl } = await uploadFile(data.proposal[0]);
          data.proposalUrl = `${import.meta.env.VITE_API_BASE_URL}${proposalUrl}`;
        }

        if (data.introductory[0] !== originalFileRef.current.introductory) {
          const { url: introductoryUrl } = await uploadFile(
            data.introductory[0]
          );
          data.introductoryUrl = `${import.meta.env.VITE_API_BASE_URL}${introductoryUrl}`;
        }

        await updateBorrowing(borrowingId, data);
      } catch (error) {
        console.error(error);
      } finally {
        navigation(`/admin/borrows`);
      }
    },
    [borrowingId, navigation]
  );

  useEffect(() => {
    findBorrowing(borrowingId)
      .then(async (borrowing) => {
        const users = await listUser();
        const user = users.find((user) => user.userId === borrowing.userId);

        if (!user) {
          navigation('/admin/borrows');
          return;
        }

        const [proposal, introductory] = await Promise.all([
          getFile(borrowing.proposalUrl),
          getFile(borrowing.introductoryUrl),
        ]);

        originalFileRef.current.proposal = proposal;
        originalFileRef.current.introductory = introductory;

        reset({
          ...borrowing,
          borrowingTime: dayjs(borrowing.borrowingTime).format(
            'YYYY-MM-DDTHH:mm'
          ),
          borrowingTimeUntil: dayjs(borrowing.borrowingTimeUntil).format(
            'YYYY-MM-DDTHH:mm'
          ),
          proposal: [proposal],
          introductory: [introductory],
          user: {
            label: user.fullName,
            value: user.userId,
          },
        });
      })
      .catch(() => navigation('/admin/borrows'))
      .finally(() => setIsFetching(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isFetching)
    return (
      <AdminLayout title={'Edit Peminjaman'}>
        <Flex
          alignItems={'center'}
          justifyContent={'center'}
          w={'full'}
          h={'full'}
        >
          Loading...
        </Flex>
      </AdminLayout>
    );

  return (
    <AdminLayout title={'Edit Peminjaman'}>
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
          introductoryRequired={false}
          proposalRequired={false}
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

export default EditBorrow;
