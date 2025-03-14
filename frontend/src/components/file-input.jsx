import { Box, Button, Input } from '@chakra-ui/react';
import { useCallback, useRef } from 'react';
import { IoClose } from 'react-icons/io5';

function FileInput({ name, value, onFileChange, onRemove, disabled }) {
  const ref = useRef();

  const onClick = useCallback(() => {
    ref.current.click();
  }, []);

  return (
    <Box>
      <Input
        onChange={onFileChange}
        name={name}
        accept={'application/pdf,application/doc,application/docx'}
        type="file"
        hidden
        ref={ref}
      />
      {value ? (
        <Box
          px={3}
          py={2}
          borderRadius={'md'}
          border="1px"
          borderColor="gray.200"
          w={'100%'}
          position={'relative'}
        >
          {value.name}
          <Button
            variant={'ghost'}
            onClick={onRemove(name)}
            position={'absolute'}
            disabled={disabled}
            right={0}
            top={0}
            p={1}
          >
            <IoClose />
          </Button>
        </Box>
      ) : (
        <Button w={'100%'} onClick={onClick} disabled={disabled}>
          Upload
        </Button>
      )}
    </Box>
  );
}

export default FileInput;
