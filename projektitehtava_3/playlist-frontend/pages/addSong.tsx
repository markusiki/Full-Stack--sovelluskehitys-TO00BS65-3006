import SongForm from '@/components/songForm'
import { IAddSongProps } from '@/interfaces'
import { Button, Form, Input, InputNumber, theme, Typography } from 'antd'

const { Title } = Typography

const AddSong: React.FC<IAddSongProps> = ({ setNewSong, handleAddSong }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }

  const [form] = Form.useForm()

  const onFinish = async (values: any) => {
    const succes = await handleAddSong(values)
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
      <Title level={2}>Add song to playlist</Title>
      <SongForm onFinish={onFinish} form={form} />
    </div>
  )
}

export default AddSong
