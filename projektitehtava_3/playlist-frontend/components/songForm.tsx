import { ISongFormProps } from '@/interfaces'
import { Button, Form, Input, InputNumber, theme } from 'antd'

const SongForm: React.FC<ISongFormProps> = ({ onFinish, form, song }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

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

  return (
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
        initialValue={song?.title}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={['artist']}
        label="Artist"
        initialValue={song?.artist}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={['album']}
        label="Album"
        initialValue={song?.album}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={['year']}
        label="Year"
        initialValue={song?.year}
        rules={[{ type: 'number', required: true }]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        name={['genre']}
        label="Genre"
        initialValue={song?.genre}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default SongForm
