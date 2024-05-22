'use client'

import React, { useEffect, useState } from 'react'
import { DesktopOutlined, PieChartOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Layout, Menu, message, theme } from 'antd'
import Playlist from '@/pages/playlist'
import Search from '@/pages/search'
import AddSong from '@/pages/addSong'
import playlistServices from '@/services/playlist'
import { ISong } from '@/interfaces'

const { Header, Content, Footer, Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem
}

const items: MenuItem[] = [
  getItem('Playlist', 'playlist', <PieChartOutlined />),
  getItem('Search song', 'search', <PieChartOutlined />),
  getItem('Add song to playlist', 'add', <DesktopOutlined />),
]

const song = {
  title: '',
  artist: '',
  genre: '',
  album: '',
  year: NaN,
}

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const [currentItem, setCurrentItem] = useState('playlist')
  const [playlist, setPlaylist] = useState<ISong[]>([song])
  const [filteredPlaylist, setFilteredPlaylist] = useState<ISong[]>([])
  const [newSong, setNewSong] = useState<ISong>(song)

  const [messageApi, contextHolder] = message.useMessage()

  const success = (message: string) => {
    messageApi.open({
      type: 'success',
      content: message,
    })
  }

  const error = (message: string) => {
    messageApi.open({
      type: 'error',
      content: message,
    })
  }

  useEffect(() => {
    playlistServices.getAll().then((response) => {
      setPlaylist(response)
    })
  }, [])
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    console.log('click', e)
    setCurrentItem(e.key)
  }

  const getFilteredPlaylist = (songName: string) => {
    if (songName.length > 2) {
      playlistServices.getByName(songName).then((result) => {
        setFilteredPlaylist(result)
      })
    } else {
      setFilteredPlaylist([])
    }
  }

  const handleAddSong = async (song: ISong) => {
    try {
      const returnedSong = await playlistServices.addSong(song)
      setPlaylist([...playlist, returnedSong])
      success(`${returnedSong.title} added to playlist`)
      return true
    } catch (exeption: any) {
      error(exeption.response.data.message)
      return false
    }
  }

  const pageContent = () => {
    if (currentItem === 'playlist') {
      return <Playlist playlist={playlist} />
    }
    if (currentItem === 'search') {
      return (
        <Search
          filteredPlaylist={filteredPlaylist}
          setFilteredPlaylist={setFilteredPlaylist}
          getFilteredPlaylist={getFilteredPlaylist}
        />
      )
    }
    if (currentItem === 'add') {
      return <AddSong setNewSong={setNewSong} handleAddSong={handleAddSong} />
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          selectedKeys={[currentItem]}
          mode="inline"
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>{pageContent()}</Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
      {contextHolder}
    </Layout>
  )
}

export default App
