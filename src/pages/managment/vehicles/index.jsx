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

const Vehicles = () => {
  const [modalAction, setModalAction] = useState('');
  const initialState = {
    firstName: '',
    lastName: '',
    identityNumber: '',
    phone: '',
    email: '',
    role: 'vehicle',
    haveUser: false
  }
  const [vehicle, setVehicle] = useState(initialState);
  const [vehicles, setVehicles] = useState([]);
  const [showModalVehicle, setShowModalVehicle] = useState(false);
  const [confirmModalVehicleLoading, setConfirmModalVehicleLoading] = React.useState(false);
  const dom = useRef();
  const intl = useIntl();
  const [formVehicle] = Form.useForm();
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
          <EditFilled onClick={(e) => prepareEditVehicle(record) } style={{color: "#1d8efa", cursor: "pointer"}} />
          <Divider type="vertical" />
          <Popconfirm    
          title="Are you sure to delete this task?"
          onConfirm={(e) => deleteVehicle(record)}
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


  const prepareNewVehicle = () => {
    setVehicle(initialState);
    setModalAction(intl.formatMessage({id: 'component.Button.new', defaultMessage: 'New'}));
    setShowModalVehicle(true);
  };

  const prepareEditVehicle = (vehicle) => {
    setVehicle(vehicle);
    setModalAction(intl.formatMessage({id: 'component.Button.edit', defaultMessage: 'Edit'}));
    setShowModalVehicle(true);
    formVehicle.setFieldsValue(vehicle)
  }

  const deleteVehicle = async (vehicle) => {
    try {
      await UserRepository.delete( vehicle._id );
      fetchVehicles();
    } catch(err) {
      console.error(err);
    }
  }

  const saveVehicle = () => {
    setConfirmModalVehicleLoading(true);
    formVehicle
      .validateFields()
      .then(async function(values) {
        formVehicle.resetFields();
        const newVehicle = { ...vehicle, ...values };
        setVehicle( newVehicle )
        try {
          if ('_id' in newVehicle) await UserRepository.update( newVehicle );
          else await UserRepository.store(newVehicle)
          fetchVehicles();
        } catch(err) {
          console.error(err);
        }
        setShowModalVehicle(false);
        setConfirmModalVehicleLoading(false);
      })
      .catch((info) => {
        setConfirmModalVehicleLoading(false);
        console.log('validade failed: ', info)
      })
  }

  const fetchVehicles = async () => {
    try {
      const filter = { role: "vehicle" };
      // if ( roles == 'instructor') filter.userData = { user: idUser };
      const { data } = await UserRepository.get( filter );
      setVehicles(data.users);
    } catch (err) {
      console.error('Error get blogs: ', err);
    }
  };

  useEffect(() => {
    fetchVehicles();
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
                {intl.formatMessage({id: "pages.managment.vehicles.title", defaultMessage: 'Vehicles'})}
              </div>
              <Button size="small" type="primary" onClick={ prepareNewVehicle }>
                {intl.formatMessage({id: "component.Button.new", defaultMessage: 'New'})}
              </Button>
            </div>
            <Divider />
            <Table size="small" pagination={{position: ['bottomCenter']}} columns={columns} dataSource={vehicles} rowKey={(vehicle) => vehicle._id} />
          </div>
        </div>
      </GridContent>
      <Modal
        title={intl.formatMessage({id: "pages.managment.vehicles.action", defaultMessage: 'Vehicles'}, { action: modalAction })}
        visible={showModalVehicle}
        onOk={saveVehicle}
        confirmLoading={confirmModalVehicleLoading}
        onCancel={() => setShowModalVehicle(false)}
      >
        <Form
          form={formVehicle}
          layout="vertical"
          name="formModalVehicle"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          initialValues={vehicle}
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

export default Vehicles;
