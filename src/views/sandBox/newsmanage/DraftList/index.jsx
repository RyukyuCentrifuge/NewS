import { Table, Button, Modal, notification } from 'antd'
import React, { useState, useEffect } from 'react'
import { DeleteOutlined, EditOutlined, UpOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
import withRouter from '../../../../components/WithRouter'
import { useNavigate } from 'react-router-dom'
const { confirm } = Modal
function Rolelist (props) {
  const [dataSource, setDataSource] = useState([])
  const navgate = useNavigate()
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/newsSand/newsmanage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '分类',
      dataIndex: 'category',
      render: (category) => {
        return category.title
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => confirmMethod(item)}></Button>
            <Button shape='circle' icon={<EditOutlined />} onClick={() => {
              props.history.push(`/newsSand/newsmanage/update/${item.id}`)
            }}></Button>
            <Button type='primary' shape='circle' icon={<UpOutlined />} onClick={() => handleCheck(item.id)}></Button>
          </div>
        )
      }
    }
  ]

  const handleCheck = (id) => {
    axios.patch(`/news/${id}`, {
      auditState: 1
    }).then(res => {
      navgate('/newsSand/auditmanage/list')
      notification.info({
        message: '通知',
        description: `您可以到审核列表中查看您的新闻`,
        placement: "bottomRight"
      })
    })
  }

  const confirmMethod = (item) => {
    confirm({
      title: "您确定要删除？",
      icon: <ExclamationCircleOutlined />,
      onOk () {
        deleteMethod(item)
      },
      onCancel () {
        console.log('取消');
      }
    })
  }

  function deleteMethod (item) {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/news/${item.id}`)
  }
  const { username } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
      setDataSource(res.data)
    })
  }, [username])



  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}></Table>
    </div>
  )
}

export default withRouter(Rolelist)