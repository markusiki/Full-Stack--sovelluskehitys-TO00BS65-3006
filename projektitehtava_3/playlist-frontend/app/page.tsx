'use client'

import React, { useEffect, useState } from 'react'
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Breadcrumb, Input, Layout, Menu, theme } from 'antd'
import Playlist from '@/pages/playlist'
import Search from '@/pages/search'
import getAll from '@/services/playlist'
import playlistServices from '@/services/playlist'
import { IPlaylist } from '@/interfaces'

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

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const [currentItem, setCurrentItem] = useState('playlist')
  const [playlist, setPlaylist] = useState<IPlaylist[]>([
    {
      title: '',
      artist: '',
      genre: '',
      album: '',
      year: NaN,
    },
  ])

  useEffect(() => {
    playlistServices.getAll().then((response) => {
      setPlaylist(response)
    })
  }, [])
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    console.log('click', e)
    setCurrentItem(e.key)
  }

  const pageContent = () => {
    if (currentItem === 'playlist') return <Playlist playlist={playlist} />
    if (currentItem === 'search') return <Search />
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
    </Layout>
  )
}

export default App
