import { Flex, Text } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { borrowTelescopeSchema } from '../../validations/borrow';
import MainLayout from '../../layout/main-layout';
import { uploadFile } from '../../api/files';
import { createBorrowing } from '../../api/borrowings';
import useAuthStore from '../../store/auth';
import BorrowForm from '../../components/form/borrow';

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

  const onFileRemove = useCallback(
    (name) => () => {
      setValue(name, '');
    },
    [setValue]
  );

  const onSubmit = useCallback(
    async (data) => {
      const [{ url: proposalUrl }, { url: introductoryUrl }] =
        await Promise.all([
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
    },
    [auth?.userId]
  );

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
        <BorrowForm
          errors={formState.errors}
          formState={formState}
          onFileChange={onFileChange}
          onFileRemove={onFileRemove}
          onSubmit={handleSubmit(onSubmit)}
          register={register}
          values={values}
        />
      </Flex>
    </MainLayout>
  );
}

export default BorrowTelescope;
