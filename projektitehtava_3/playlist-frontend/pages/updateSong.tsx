import SongForm from '@/components/songForm'
import { IUpdateSongProps } from '@/interfaces'
import { Form, theme, Typography } from 'antd'

const { Title } = Typography

const UpdateSong: React.FC<IUpdateSongProps> = ({ handleUpdateSong, song }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }

  const [form] = Form.useForm()

  const onFinish = async (values: any) => {
    const succes = await handleUpdateSong(song.id, values)
    if (succes) {
      form.resetFields()
    }
  }
  return (
    <div
      style={{
        padding: 30,
        minHeight: 360,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <Title level={2}>Edit song</Title>
      <SongForm onFinish={onFinish} form={form} song={song} />
    </div>
  )
}

export default UpdateSong
