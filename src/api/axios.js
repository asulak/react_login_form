# Axios imported from other components will come from this file

import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:3500'
});
