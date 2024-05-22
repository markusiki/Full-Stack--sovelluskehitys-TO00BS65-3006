'use client'

import React, { MouseEventHandler, useEffect, useState } from 'react'
import { DesktopOutlined, PieChartOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Layout, Menu, message, theme } from 'antd'
import Playlist from '@/pages/playlist'
import Search from '@/pages/search'
import AddSong from '@/pages/addSong'
import playlistServices from '@/services/playlist'
import { ISong } from '@/interfaces'
import axios, { AxiosError } from 'axios'
import UpdateSong from '@/pages/updateSong'

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
  id: '',
}

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const [currentItem, setCurrentItem] = useState('playlist')
  const [playlist, setPlaylist] = useState<ISong[]>([song])
  const [filteredPlaylist, setFilteredPlaylist] = useState<ISong[]>([])
  const [newSong, setNewSong] = useState<ISong>(song)
  const [songToUpdate, setSongToUpdate] = useState<ISong>(song)

  const [messageApi, contextHolder] = message.useMessage()

  const toast = (message: string, type: 'success' | 'error') => {
    messageApi.open({
      type: type,
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
      toast(`${returnedSong.title} added to playlist`, 'success')
      return true
    } catch (error: any) {
      toast(error.response.data.message, 'error')
      return false
    }
  }

  const handleDelete = async (song: ISong) => {
    console.log(song)
    try {
      const response = await playlistServices.deleteOne(song.id)
      console.log(response)
      setPlaylist(
        playlist.filter((songToRemove) => songToRemove.id !== song.id)
      )
      toast(`${song.title} deleted succesfully!`, 'success')
    } catch (error: any) {
      if (error.response.status === 404) {
        console.log(error)
        toast('Song already deleted', 'error')
        setPlaylist(
          playlist.filter((songToRemove) => songToRemove.id !== song.id)
        )
      }
    }
  }

  const handleEditClick = (song: ISong) => {
    setSongToUpdate(song)
    setCurrentItem('update')
  }

  const handleUpdateSong = async (id: string, song: ISong) => {
    try {
      console.log('songToUpdate: ', song, id)
      const returnedSong = await playlistServices.update(id, song)
      console.log('returnedSOng: ', returnedSong)
      setPlaylist(
        playlist.map((songToModify) =>
          songToModify.id !== returnedSong.id ? songToModify : returnedSong
        )
      )
      toast('Song updated succesfully!', 'success')
    } catch (error: any) {
      if (error.response.status === 404) {
        toast('Song already deleted', 'error')
      } else {
        toast(error.response.data.message, 'error')
      }
      setPlaylist(
        playlist.filter((songToRemove) => songToRemove.id !== song.id)
      )
    }
  }

  const pageContent = () => {
    if (currentItem === 'playlist') {
      return (
        <Playlist
          playlist={playlist}
          handleDelete={handleDelete}
          handleEditClick={handleEditClick}
        />
      )
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
    if (currentItem === 'update') {
      return (
        <UpdateSong song={songToUpdate} handleUpdateSong={handleUpdateSong} />
      )
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
