import axios from "axios";


const getAll = async () => {
  const response = await axios.get('/api/getall')
  return response.data
}

const playlistServices = { getAll }

export default playlistServices