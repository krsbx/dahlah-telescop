import axios from '../utils/axios';

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('files', file);

  const { data } = await axios.post('/files', formData);

  return data.data;
};

export const getStats = async () => {
  const { data } = await axios.get('/files/stats');

  return data;
};

/**
 * @param {string} url
 * @returns {Promise<File>}
 */
export const getFile = async (url) => {
  const { data } = await axios.get(url, {
    responseType: 'blob',
  });

  const file = new File([data], url.split('/').pop(), {
    type: data.type,
  });

  return file;
};
