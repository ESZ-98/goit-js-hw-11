import axios from 'axios';

const apiKey = '35303248-67ec5a4fab42eff68b9e675f4';
const URL = 'https://pixabay.com/api/';

export const fetchImages = async (trimmedValue, pageNumber) => {
  const response = await axios.get(
    `${URL}?key=${apiKey}&q=${trimmedValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageNumber}`
  );
  return response.data;
};
