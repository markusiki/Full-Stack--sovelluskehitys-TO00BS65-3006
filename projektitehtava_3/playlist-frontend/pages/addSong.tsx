import { IAddSongProps } from '@/interfaces'
import { Button, Form, Input, InputNumber, theme, Typography } from 'antd'

const { Title } = Typography

const AddSong: React.FC<IAddSongProps> = ({ setNewSong, handleAddSong }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const [form] = Form.useForm()

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }

  /* eslint-disable no-template-curly-in-string */
  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  }
  /* eslint-enable no-template-curly-in-string */

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
      <Form
        {...layout}
        form={form}
        name="nest-messages"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
        validateMessages={validateMessages}
      >
        <Form.Item
          name={['title']}
          label="Song title"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={['artist']}
          label="Artist"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name={['album']} label="Album" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name={['year']}
          label="Year"
          rules={[{ type: 'number', required: true }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item name={['genre']} label="Genre" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default AddSong
