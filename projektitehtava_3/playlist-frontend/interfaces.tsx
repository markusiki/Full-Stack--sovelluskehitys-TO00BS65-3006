export interface IPlaylist {
  title: string
  artist: string
  genre: string
  album: string
  year: number
}

export interface IPlaylistProps {
  playlist: IPlaylist[]
}
