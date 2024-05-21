export interface ISong {
  title: string
  artist: string
  genre: string
  album: string
  year: number
}

export interface IPlaylistProps {
  playlist: ISong[]
}

export interface ISearchProps {
  filteredPlaylist: ISong[]
  setFilteredPlaylist: React.Dispatch<React.SetStateAction<ISong[]>>
  getFilteredPlaylist: (songName: string) => void
}

export interface IAddSongProps {
  setNewSong: React.Dispatch<React.SetStateAction<ISong>>
  handleAddSong: (song: ISong) => boolean | {}
}
