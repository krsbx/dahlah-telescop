import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { signUpSchema } from '../../validations/auth';
import { register as registerUser } from '../../api/auth';
import $SignUpForm from '../form/sign-up';

function SignUpForm() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit, formState, reset } = useForm({
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

  useEffect(() => {
    if (!isOpen) return;

    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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
            <$SignUpForm
              errors={formState.errors}
              onSubmit={handleSubmit(onSubmit)}
              register={register}
              formState={formState}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
}

export default SignUpForm;
