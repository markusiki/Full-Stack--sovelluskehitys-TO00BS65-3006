'use client'

import React, { useEffect, useState } from 'react'
import { DesktopOutlined, PieChartOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Button, Layout, Menu, Space, message, notification, theme } from 'antd'
import Playlist from '@/pages/playlist'
import Search from '@/pages/search'
import AddSong from '@/pages/addSong'
import playlistServices from '@/services/playlist'
import { ISong } from '@/interfaces'
import UpdateSong from '@/pages/updateSong'

const { Content, Sider } = Layout

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
  const [songToUpdate, setSongToUpdate] = useState<ISong>(song)

  const [messageApi, contextHolder] = message.useMessage()
  const [note, setNote] = notification.useNotification()

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
    setCurrentItem(e.key)
    setFilteredPlaylist([])
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
      setCurrentItem('playlist')
      return true
    } catch (error: any) {
      toast(error.response.data.message, 'error')
      return false
    }
  }

  const handleDeleteSong = async (song: ISong) => {
    try {
      const response = await playlistServices.deleteOne(song.id)
      setPlaylist(
        playlist.filter((songToRemove) => songToRemove.id !== song.id)
      )
      setFilteredPlaylist(
        filteredPlaylist.filter((songToRemove) => songToRemove.id !== song.id)
      )
      toast(`${song.title} deleted successfully!`, 'success')
    } catch (error: any) {
      if (error.response.status === 404) {
        toast('Song already deleted', 'error')
        setPlaylist(
          playlist.filter((songToRemove) => songToRemove.id !== song.id)
        )
      }
    }
  }

  const handleDeleteAll = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await playlistServices.deleteAll()
      setPlaylist([])
      setFilteredPlaylist([])
    } catch (error) {
      toast('Server side error', 'error')
    }
  }

  const handleEditClick = (song: ISong) => {
    setSongToUpdate(song)
    setCurrentItem('update')
  }

  const handleUpdateSong = async (id: string, song: ISong) => {
    try {
      const returnedSong = await playlistServices.update(id, song)
      setPlaylist(
        playlist.map((songToModify) =>
          songToModify.id !== returnedSong.id ? songToModify : returnedSong
        )
      )
      setFilteredPlaylist(
        filteredPlaylist.map((songToModify) =>
          songToModify.id !== returnedSong.id ? songToModify : returnedSong
        )
      )
      setCurrentItem('search')
      toast('Song updated successfully!', 'success')
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

  const confirmDeleteAll = () => {
    const key = `open${Date.now()}`
    const btn = (
      <Space>
        <Button
          type="link"
          size="small"
          onClick={(e) => {
            note.destroy()
            handleDeleteAll(e)
          }}
        >
          Confirm
        </Button>
        <Button type="primary" size="small" onClick={() => note.destroy()}>
          Cancel
        </Button>
      </Space>
    )
    note.open({
      message: 'Confirm action',
      description: 'Are you sure you want to delete all songs from playlist?',
      btn,
      key,
      onClose: close,
    })
  }

  const pageContent = () => {
    if (currentItem === 'playlist') {
      return (
        <Playlist
          playlist={playlist}
          handleDeleteSong={handleDeleteSong}
          handleEditClick={handleEditClick}
          confirmDeleteAll={confirmDeleteAll}
        />
      )
    }
    if (currentItem === 'search') {
      return (
        <Search
          filteredPlaylist={filteredPlaylist}
          getFilteredPlaylist={getFilteredPlaylist}
          handleEditClick={handleEditClick}
          handleDeleteSong={handleDeleteSong}
        />
      )
    }
    if (currentItem === 'add') {
      return <AddSong handleAddSong={handleAddSong} />
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
        <Content>{pageContent()}</Content>
      </Layout>
      {contextHolder}
      {setNote}
    </Layout>
  )
}

export default App
