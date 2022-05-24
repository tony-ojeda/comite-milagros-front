import React, {  useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useIntl } from 'umi';
import { GridContent } from '@ant-design/pro-layout';
import { Popconfirm, Table, Tag, Space, Divider, Modal, Form, Input, Button, Row, Col } from 'antd';
import {
  EditFilled, 
  DeleteFilled,
} from '@ant-design/icons';
import styles from './style.less';
import Repository from '@/repositories/factory/RepositoryFactory';

const Services = () => {
  const [modalAction, setModalAction] = useState('');
  const initialState = {
    firstName: '',
    lastName: '',
    identityNumber: '',
    phone: '',
    email: '',
    role: 'service',
    haveUser: false
  }
  const [service, setService] = useState(initialState);
  const [services, setServices] = useState([]);
  const [showModalService, setShowModalService] = useState(false);
  const [confirmModalServiceLoading, setConfirmModalServiceLoading] = React.useState(false);
  const dom = useRef();
  const intl = useIntl();
  const [formService] = Form.useForm();
  const UserRepository = Repository.get('user');

  const columns = [
    {
      title: 'Names',
      key: 'name',
      render: (_, record) => (
        <Space>
          <span>{ `${record.firstName} ${record.lastName}` }</span>
        </Space>
      ),
    },
    {
      title: 'DNI',
      dataIndex: 'identityNumber',
      key: 'identityNumber',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Contact',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Action',
      align: 'center',
      key: 'action',
      render: (text, record, index) => (
        <Space size="middle">
          <Divider type="vertical" />
          <EditFilled onClick={(e) => prepareEditService(record) } style={{color: "#1d8efa", cursor: "pointer"}} />
          <Divider type="vertical" />
          <Popconfirm    
          title="Are you sure to delete this task?"
          onConfirm={(e) => deleteService(record)}
          okText="Yes"
          cancelText="No"
          >
            <DeleteFilled style={{color: "#1d8efa", cursor: "pointer"}} />
          </Popconfirm>
          <Divider type="vertical" />
        </Space>
      ),
    },
  ];


  const prepareNewService = () => {
    setService(initialState);
    setModalAction(intl.formatMessage({id: 'component.Button.new', defaultMessage: 'New'}));
    setShowModalService(true);
  };

  const prepareEditService = (service) => {
    setService(service);
    setModalAction(intl.formatMessage({id: 'component.Button.edit', defaultMessage: 'Edit'}));
    setShowModalService(true);
    formService.setFieldsValue(service)
  }

  const deleteService = async (service) => {
    try {
      await UserRepository.delete( service._id );
      fetchServices();
    } catch(err) {
      console.error(err);
    }
  }

  const saveService = () => {
    setConfirmModalServiceLoading(true);
    formService
      .validateFields()
      .then(async function(values) {
        formService.resetFields();
        const newService = { ...service, ...values };
        setService( newService )
        try {
          if ('_id' in newService) await UserRepository.update( newService );
          else await UserRepository.store(newService)
          fetchServices();
        } catch(err) {
          console.error(err);
        }
        setShowModalService(false);
        setConfirmModalServiceLoading(false);
      })
      .catch((info) => {
        setConfirmModalServiceLoading(false);
        console.log('validade failed: ', info)
      })
  }

  const fetchServices = async () => {
    try {
      const filter = { role: "service" };
      // if ( roles == 'instructor') filter.userData = { user: idUser };
      const { data } = await UserRepository.get( filter );
      setServices(data.users);
    } catch (err) {
      console.error('Error get blogs: ', err);
    }
  };

  useEffect(() => {
    fetchServices();
    // if( roles == 'user') setIsEdit(false)
    // else setIsEdit(true)
  }, []);

  return (
    <>
      <GridContent>
        <div
          className={styles.main}
          ref={(ref) => {
            if (ref) {
              dom.current = ref;
            }
          }}
        >
          <div className={styles.right}>
            <div className={styles.head}>
              <div className={styles.title}>
                {intl.formatMessage({id: "pages.managment.services.title", defaultMessage: 'Services'})}
              </div>
              <Button size="small" type="primary" onClick={ prepareNewService }>
                {intl.formatMessage({id: "component.Button.new", defaultMessage: 'New'})}
              </Button>
            </div>
            <Divider />
            <Table size="small" pagination={{position: ['bottomCenter']}} columns={columns} dataSource={services} rowKey={(service) => service._id} />
          </div>
        </div>
      </GridContent>
      <Modal
        title={intl.formatMessage({id: "pages.managment.services.action", defaultMessage: 'Services'}, { action: modalAction })}
        visible={showModalService}
        onOk={saveService}
        confirmLoading={confirmModalServiceLoading}
        onCancel={() => setShowModalService(false)}
      >
        <Form
          form={formService}
          layout="vertical"
          name="formModalService"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          initialValues={service}
          autoComplete="off"
        >

          <Row>
            <Col span={11}>
              <Form.Item
                label="Name"
                name="firstName"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12} offset={1} >
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: 'Please input your lastname' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={11}>
              <Form.Item
                label="DNI"
                name="identityNumber"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12} offset={1} >
              <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: 'Please input your phone' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Address"
            name="address"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
          >
            <Input />
          </Form.Item>

        </Form>
      </Modal>
    </>
  );
}

export default Services;
