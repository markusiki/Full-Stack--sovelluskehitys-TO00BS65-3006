import { FormInstance } from 'antd'
import { MouseEventHandler } from 'react'

export interface ISong {
  title: string
  artist: string
  genre: string
  album: string
  year: number
  id: string
}

export interface IPlaylistProps {
  playlist: ISong[]
  handleDeleteSong: (item: ISong) => Promise<any>
  handleEditClick: (song: ISong) => void
  confirmDeleteAll: () => void
}

export interface ISearchProps {
  filteredPlaylist: ISong[]
  getFilteredPlaylist: (songName: string) => void
  handleDeleteSong: (item: ISong) => Promise<any>
  handleEditClick: (song: ISong) => void
}

export interface IAddSongProps {
  handleAddSong: (song: ISong) => Promise<any>
}

export interface IUpdateSongProps {
  handleUpdateSong: (id: string, song: ISong) => Promise<any>
  song: ISong
}

export interface ISongFormProps {
  onFinish: (values: any) => Promise<void>
  form: FormInstance<any>
  song?: ISong
}
