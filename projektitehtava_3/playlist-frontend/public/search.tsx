import { ISearchProps } from '@/interfaces'
import { Input, List, theme } from 'antd'
import { ChangeEvent } from 'react'
import { Typography } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

const { Title } = Typography

const Search: React.FC<ISearchProps> = ({
  filteredPlaylist,

  getFilteredPlaylist,
  handleEditClick,
  handleDeleteSong,
}) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const handleSearch = (e: ChangeEvent<HTMLInputElement> | undefined) => {
    e!.preventDefault()
    getFilteredPlaylist(e!.target.value)
    return
  }

  return (
    <div
      style={{
        padding: 24,
        minHeight: 360,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <Title>Search song</Title>
      <Input
        type="text"
        name="search"
        placeholder="Type song name to search"
        onChange={handleSearch}
      ></Input>
      <List
        itemLayout="horizontal"
        header={<b>Song(s)</b>}
        dataSource={filteredPlaylist}
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

export default Search
