import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
  useModal,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { signUpSchema } from '../../validations/auth';
import { register as registerUser } from '../../api/auth';

function SignUpForm() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = useCallback(
    async (data) => {
      await registerUser(data);

      onClose();
    },
    [onClose]
  );

  return (
    <React.Fragment>
      <Button
        onClick={onOpen}
        borderRadius={'md'}
        bg={'white'}
        fontSize={'xs'}
        _hover={{
          textDecoration: 'none',
          bg: 'gray.200',
        }}
        px={4}
        py={2}
      >
        Daftar
      </Button>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent p={5}>
          <ModalHeader>
            <Heading fontSize={'2xl'} color={'black'}>
              Buat Akun
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={4} w={'100%'} px={2}>
                <FormControl isRequired isInvalid={!!formState.errors.fullName}>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <Input
                    placeholder="Masukkan Nama Lengkap"
                    {...register('fullName')}
                    disabled={formState.isSubmitting}
                  />
                  <FormErrorMessage>
                    {formState.errors.fullName?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!formState.errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    placeholder="Masukkan Email"
                    {...register('email')}
                    disabled={formState.isSubmitting}
                  />
                  <FormErrorMessage>
                    {formState.errors.email?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!formState.errors.password}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    placeholder="Masukkan Password"
                    {...register('password')}
                    disabled={formState.isSubmitting}
                    type="password"
                  />
                  <FormErrorMessage>
                    {formState.errors.password?.message}
                  </FormErrorMessage>
                </FormControl>

                <Button w={'100%'} type="submit">
                  Submit
                </Button>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
}

export default SignUpForm;
