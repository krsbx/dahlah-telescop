import React, { useCallback } from 'react';
import AdminLayout from '../../../layout/admin-layout';
import SignUpForm from '../../../components/form/sign-up';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from '../../../validations/auth';
import { z } from 'zod';
import { USER_ROLE, USER_ROLES } from '../../../utils/constant';
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
  Text,
} from '@chakra-ui/react';
import { createUser } from '../../../api/users';
import { useNavigate } from 'react-router-dom';

function AddAccount() {
  const navigation = useNavigate();
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      role: USER_ROLE.USER,
    },
    mode: 'onBlur',
    resolver: zodResolver(
      signUpSchema.extend({
        role: z.enum(USER_ROLES.map((role) => role.value)),
      })
    ),
  });

  const onSubmit = useCallback(
    async (data) => {
      const user = await createUser(data);

      if (user.userId) {
        navigation(`/admin/accounts/edit/${user.userId}`);
        return;
      }

      navigation(`/admin/accounts`);
    },
    [navigation]
  );

  return (
    <AdminLayout title={'Add Account'}>
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
          Tambah Akun
        </Text>

        <SignUpForm
          formState={formState}
          errors={formState.errors}
          register={register}
          onSubmit={handleSubmit(onSubmit)}
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

export default AddAccount;
