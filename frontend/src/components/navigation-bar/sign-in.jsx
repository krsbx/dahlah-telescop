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
  Select,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema } from '../../validations/auth';
import { USER_ROLE, USER_ROLES } from '../../utils/constant';
import { login } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

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
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={4} w={'100%'} px={2}>
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

                <FormControl isRequired isInvalid={!!formState.errors.role}>
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
                  <FormErrorMessage>
                    {formState.errors.role?.message}
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

export default SignInForm;
