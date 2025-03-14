import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Stack,
} from '@chakra-ui/react';
import React from 'react';
import { USER_ROLES } from '../../utils/constant';

function SignInForm({ onSubmit, errors, register, formState, children }) {
  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={4} w={'100%'} px={2}>
        <FormControl isRequired isInvalid={!!errors.email}>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Masukkan Email"
            {...register('email')}
            disabled={formState.isSubmitting}
          />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.password}>
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="Masukkan Password"
            {...register('password')}
            disabled={formState.isSubmitting}
            type="password"
          />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.role}>
          <FormLabel>Role</FormLabel>
          <Select
            placeholder="Masukkan Role"
            {...register('role')}
            disabled={formState.isSubmitting}
          >
            {USER_ROLES.map((ur) => (
              <option value={ur.value} key={`${ur.value}-${ur.title}`}>
                {ur.title}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.role?.message}</FormErrorMessage>
        </FormControl>

        {children}

        <Button w={'100%'} type="submit">
          Submit
        </Button>
      </Stack>
    </form>
  );
}

export default SignInForm;
