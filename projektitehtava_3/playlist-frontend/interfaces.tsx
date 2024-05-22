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
  handleDelete: (item: ISong) => Promise<any>
  handleEdit: (item: ISong) => Promise<any>
}

export interface ISearchProps {
  filteredPlaylist: ISong[]
  setFilteredPlaylist: React.Dispatch<React.SetStateAction<ISong[]>>
  getFilteredPlaylist: (songName: string) => void
}

export interface IAddSongProps {
  setNewSong: React.Dispatch<React.SetStateAction<ISong>>
  handleAddSong: (song: ISong) => Promise<any>
}
