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
  return response.data
}

const deleteOne = async (id: string) => {
  const response = await axios.delete(`/api/delete/${id}`)
  return response.data
}

const deleteAll = async () => {
  const response = await axios.delete('api/deleteall')
  return response.data
}

const update = async (song: ISong) => {
  const response = await axios.put(`api/update/${song.id}`, {song})
  return response.data
}

const playlistServices = { getAll, getByName, addSong, deleteOne, deleteAll, update }

export default playlistServices