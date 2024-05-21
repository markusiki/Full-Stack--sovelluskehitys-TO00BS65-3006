import { ISong } from "@/interfaces";
import axios from "axios";


const getAll = async () => {
  const response = await axios.get('/api/getall')
  return response.data
}

const getByName = async (songName: string) => {
  const response = await axios.get(`api/getbyname/${songName}`)
  return response.data
  console.log(response)
}

const addSong = async (song: ISong) => {
  const response = await axios.post('api/add', song)
  console.log(response)
  return response
}

const playlistServices = { getAll, getByName, addSong }

export default playlistServices