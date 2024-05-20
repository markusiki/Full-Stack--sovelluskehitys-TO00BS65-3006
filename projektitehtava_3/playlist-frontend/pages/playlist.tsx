import { IPlaylist, IPlaylistProps } from '@/interfaces'
import { Input, List, theme } from 'antd'

const Playlist: React.FC<IPlaylistProps> = ({ playlist }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const handleEdit = () => {}

  return (
    <div
      style={{
        padding: 24,
        minHeight: 360,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <List
        itemLayout="horizontal"
        header={<b>Playlist</b>}
        dataSource={playlist}
        renderItem={(item) => (
          <List.Item
            actions={[
              <button key="list-loadmore-edit" onClick={handleEdit}>
                edit
              </button>,
            ]}
          >
            <List.Item.Meta
              title={<b>{item.title}</b>}
              description={
                <ul>
                  <li>Artist: {item.artist}</li>
                  <li>Album: {item.album}</li>
                  <li>Year: {item.year}</li>
                  <li>Genre: {item.genre}</li>
                </ul>
              }
            ></List.Item.Meta>
          </List.Item>
        )}
      ></List>
    </div>
  )
}

export default Playlist
