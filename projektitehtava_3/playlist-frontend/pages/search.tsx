import { ISearchProps } from '@/interfaces'
import { Input, List, theme } from 'antd'
import { ChangeEvent } from 'react'

const Search: React.FC<ISearchProps> = ({
  filteredPlaylist,
  setFilteredPlaylist,
  getFilteredPlaylist,
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
    <>
      <Input
        type="text"
        name="search"
        placeholder="Type song name to search"
        onChange={handleSearch}
      ></Input>
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
          header={<b>Song(s)</b>}
          dataSource={filteredPlaylist}
          renderItem={(item) => (
            <List.Item
            /*      actions={[
            <button key="list-loadmore-edit" onClick={handleEdit}>
              edit
            </button>,
          ]} */
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
    </>
  )
}

export default Search
