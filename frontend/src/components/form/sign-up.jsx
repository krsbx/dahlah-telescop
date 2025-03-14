import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/react';
import React from 'react';

function SignUpForm({ onSubmit, errors, register, formState, children }) {
  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={4} w={'100%'} px={2}>
        <FormControl isRequired isInvalid={!!errors.fullName}>
          <FormLabel>Nama Lengkap</FormLabel>
          <Input
            placeholder="Masukkan Nama Lengkap"
            {...register('fullName')}
            disabled={formState.isSubmitting}
          />
          <FormErrorMessage>{errors.fullName?.message}</FormErrorMessage>
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

        {children}

        <Button w={'100%'} type="submit">
          Submit
        </Button>
      </Stack>
    </form>
  );
}

export default SignUpForm;
