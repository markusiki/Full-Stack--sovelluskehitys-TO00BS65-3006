import { Input, theme } from 'antd'

const Search: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  return (
    <>
      <Input
        type="text"
        name="search"
        placeholder="Type song name or artist to search"
      ></Input>
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        Bill is a cat.
      </div>
    </>
  )
}

export default Search
