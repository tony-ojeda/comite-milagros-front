import React, {  useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useIntl } from 'umi';
import { GridContent } from '@ant-design/pro-layout';
import { message, InputNumber, Popconfirm, Table, Space, Divider, Modal, Form, Input, Button, Row, Col } from 'antd';
import {
  EditFilled, 
  DeleteFilled,
} from '@ant-design/icons';
import styles from './style.less';
import Repository from '@/repositories/factory/RepositoryFactory';

const Services = () => {
  const [modalAction, setModalAction] = useState('');
  const initialState = {
    name: '',
    amount: 0.0,
  }
  const [service, setService] = useState(initialState);
  const [services, setServices] = useState([]);
  const [showModalService, setShowModalService] = useState(false);
  const [confirmModalServiceLoading, setConfirmModalServiceLoading] = React.useState(false);
  const dom = useRef();
  const intl = useIntl();
  const [formService] = Form.useForm();
  const ServiceRepository = Repository.get('service');

  const columns = [
    {
      title: 'Service name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
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
      await ServiceRepository.delete( service._id );
      message.success(`Service deleted!`);
      fetchServices();
    } catch(err) {
      console.error(err);
      message.error(`No se pudo procesar!!!`);
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
          if ('_id' in newService) await ServiceRepository.update( newService );
          else await ServiceRepository.store(newService)
          message.success(`Service ${ ('_id' in newService) ?'updated!' : 'created!'}`);
          fetchServices();
        } catch(err) {
          message.error(`No se pudo procesar!!!`);
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
      const filter = { };
      // if ( roles == 'instructor') filter.userData = { user: idService };
      const { data } = await ServiceRepository.get( filter );
      setServices(data);
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
            <Col span={19}>
              <Form.Item
                label="Service name"
                name="name"
                rules={[{ required: true, message: 'Please input your service name!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={4} offset={1} >
              <Form.Item
                label="Amount"
                name="amount"
                rules={[{ required: true, message: 'Please input your amount!' }]}
              >
                <InputNumber />
              </Form.Item>
            </Col>
          </Row>


        </Form>
      </Modal>
    </>
  );
}

export default Services;
