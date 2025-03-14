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
import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema } from '../../validations/auth';
import { USER_ROLE } from '../../utils/constant';
import { login } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import $SignInForm from '../form/sign-in';

function SignInForm() {
  const navigation = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: {
      email: '',
      password: '',
      role: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = useCallback(
    async (data) => {
      await login(data);

      switch (data.role) {
        case USER_ROLE.ADMIN:
          navigation('/admin', {
            replace: true,
          });
          break;

        case USER_ROLE.USER:
          navigation('/', {
            replace: true,
          });
          break;

        default:
          break;
      }

      onClose();
    },
    [navigation, onClose]
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
        Masuk
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
              Masuk
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <$SignInForm
              onSubmit={handleSubmit(onSubmit)}
              errors={formState.errors}
              register={register}
              formState={formState}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
}

export default SignInForm;
