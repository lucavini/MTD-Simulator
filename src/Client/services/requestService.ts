import axios from 'axios';
import debug from '@Lib/Debug';

const serverPort = process.env.SERVER_PORT;

const getData = async () => {
  try {
    const response = await axios.get(`http://localhost:${serverPort}/proxy`);
    debug.data('getData', response.data);
  } catch (error) {
    debug.error('getData', `Error fetching data from Server: ${error}`);
  }
};

export default getData;
