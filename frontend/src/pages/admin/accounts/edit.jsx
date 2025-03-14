import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
  Text,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { findUser, updateUser, updateUserPassword } from '../../../api/users';
import SignUpForm from '../../../components/form/sign-up';
import AdminLayout from '../../../layout/admin-layout';
import { USER_ROLES } from '../../../utils/constant';
import { updateUserSchema } from '../../../validations/user';

function EditAccount() {
  const navigation = useNavigate();
  const userId = useParams()?.userId;
  const [isFetching, setIsFetching] = useState(true);
  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      role: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(updateUserSchema),
  });

  useEffect(() => {
    findUser(userId)
      .then((user) => {
        reset(user);
      })
      .catch(() => navigation('/admin/accounts'))
      .finally(() => setIsFetching(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = useCallback(
    async (data) => {
      try {
        await updateUser(userId, data);

        if (!data.password) return;

        await updateUserPassword(userId, data);
      } catch (error) {
        console.error(error);
      } finally {
        navigation(`/admin/accounts`);
      }
    },
    [navigation, userId]
  );

  if (isFetching)
    return (
      <AdminLayout title={'Edit Akun'}>
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
    <AdminLayout title={'Edit Akun'}>
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
          Edit Akun
        </Text>

        <SignUpForm
          formState={formState}
          errors={formState.errors}
          register={register}
          onSubmit={handleSubmit(onSubmit)}
          isPasswordOptional
          w={'md'}
        >
          <FormControl isRequired isInvalid={!!formState.errors.role}>
            <FormLabel>Role</FormLabel>
            <Select
              {...register('role')}
              placeholder="Pilih Role"
              disabled={formState.isSubmitting}
            >
              {USER_ROLES.map((role) => (
                <option key={`${role.value}-${role.title}`} value={role.value}>
                  {role.title}
                </option>
              ))}
            </Select>
            <FormErrorMessage>
              {formState.errors.role?.message}
            </FormErrorMessage>
          </FormControl>
        </SignUpForm>
      </Flex>
    </AdminLayout>
  );
}

export default EditAccount;
