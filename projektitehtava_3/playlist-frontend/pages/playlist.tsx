import { IPlaylistProps } from '@/interfaces'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, List, theme } from 'antd'
import React from 'react'
import { Typography } from 'antd'

const { Title } = Typography

const Playlist: React.FC<IPlaylistProps> = ({
  playlist,
  handleDeleteSong,
  handleEditClick,
  confirmDeleteAll,
}) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  return (
    <div
      style={{
        padding: 24,
        minHeight: 360,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <Title>Playlist</Title>
      <List
        itemLayout="horizontal"
        header={
          <>
            <b>Playlist</b>
            <Button
              className="float-right bg-red-500 text-white"
              onClick={confirmDeleteAll}
            >
              Delete All
            </Button>
          </>
        }
        dataSource={playlist}
        renderItem={(item) => (
          <List.Item
            actions={[
              <button
                key="list-loadmore-edit"
                onClick={() => handleEditClick(item)}
              >
                <EditOutlined />
              </button>,
              <button
                key="list-loadmore-delete"
                onClick={() => handleDeleteSong(item)}
              >
                <DeleteOutlined />
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
