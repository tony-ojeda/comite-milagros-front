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

const Carriers = () => {
  const [modalAction, setModalAction] = useState('');
  const initialState = {
    firstName: '',
    lastName: '',
    identityNumber: '',
    phone: '',
    email: '',
    role: 'carrier',
    haveUser: false
  }
  const [carrier, setCarrier] = useState(initialState);
  const [carriers, setCarriers] = useState([]);
  const [showModalCarrier, setShowModalCarrier] = useState(false);
  const [confirmModalCarrierLoading, setConfirmModalCarrierLoading] = React.useState(false);
  const dom = useRef();
  const intl = useIntl();
  const [formCarrier] = Form.useForm();
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
          <EditFilled onClick={(e) => prepareEditCarrier(record) } style={{color: "#1d8efa", cursor: "pointer"}} />
          <Divider type="vertical" />
          <Popconfirm    
          title="Are you sure to delete this task?"
          onConfirm={(e) => deleteCarrier(record)}
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


  const prepareNewCarrier = () => {
    setCarrier(initialState);
    setModalAction(intl.formatMessage({id: 'component.Button.new', defaultMessage: 'New'}));
    setShowModalCarrier(true);
  };

  const prepareEditCarrier = (carrier) => {
    setCarrier(carrier);
    setModalAction(intl.formatMessage({id: 'component.Button.edit', defaultMessage: 'Edit'}));
    setShowModalCarrier(true);
    formCarrier.setFieldsValue(carrier)
  }

  const deleteCarrier = async (carrier) => {
    try {
      await UserRepository.delete( carrier._id );
      fetchCarriers();
    } catch(err) {
      console.error(err);
    }
  }

  const saveCarrier = () => {
    setConfirmModalCarrierLoading(true);
    formCarrier
      .validateFields()
      .then(async function(values) {
        formCarrier.resetFields();
        const newCarrier = { ...carrier, ...values };
        setCarrier( newCarrier )
        try {
          if ('_id' in newCarrier) await UserRepository.update( newCarrier );
          else await UserRepository.store(newCarrier)
          fetchCarriers();
        } catch(err) {
          console.error(err);
        }
        setShowModalCarrier(false);
        setConfirmModalCarrierLoading(false);
      })
      .catch((info) => {
        setConfirmModalCarrierLoading(false);
        console.log('validade failed: ', info)
      })
  }

  const fetchCarriers = async () => {
    try {
      const filter = { role: "carrier" };
      // if ( roles == 'instructor') filter.userData = { user: idUser };
      const { data } = await UserRepository.get( filter );
      setCarriers(data.users);
    } catch (err) {
      console.error('Error get blogs: ', err);
    }
  };

  useEffect(() => {
    fetchCarriers();
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
                {intl.formatMessage({id: "pages.managment.carriers.title", defaultMessage: 'Carriers'})}
              </div>
              <Button size="small" type="primary" onClick={ prepareNewCarrier }>
                {intl.formatMessage({id: "component.Button.new", defaultMessage: 'New'})}
              </Button>
            </div>
            <Divider />
            <Table size="small" pagination={{position: ['bottomCenter']}} columns={columns} dataSource={carriers} rowKey={(carrier) => carrier._id} />
          </div>
        </div>
      </GridContent>
      <Modal
        title={intl.formatMessage({id: "pages.managment.carriers.actionCarrier", defaultMessage: 'Carriers'}, { action: modalAction })}
        visible={showModalCarrier}
        onOk={saveCarrier}
        confirmLoading={confirmModalCarrierLoading}
        onCancel={() => setShowModalCarrier(false)}
      >
        <Form
          form={formCarrier}
          layout="vertical"
          name="formModalCarrier"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          initialValues={carrier}
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

export default Carriers;
