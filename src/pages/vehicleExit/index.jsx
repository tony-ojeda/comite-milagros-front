import React, {  useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useIntl } from 'umi';
import { GridContent } from '@ant-design/pro-layout';
import { DatePicker, InputNumber, DatePickerProps, Popconfirm, Table, Select, Space, Divider, Modal, Form, Input, Button, Row, Col } from 'antd';
import moment from 'moment';
import {
  EditFilled, 
  DeleteFilled,
} from '@ant-design/icons';
import styles from './style.less';
import Repository from '@/repositories/factory/RepositoryFactory';

const VehicleExit = () => {
  const [modalAction, setModalAction] = useState('');
  const initialState = {
    carrierId: '',
    vehicleId: '',
    serviceId: '',
    serviceName: '',
    amount: 0,
    dateExit: moment().format('DD/MM/YYYY HH:mm')
  }
  const [vehicleExit, setVehicleExit] = useState(initialState);
  const [vehicleExits, setVehicleExits] = useState([]);
  const [showModalVehicleExit, setShowModalVehicleExit] = useState(false);
  const [confirmModalVehicleExitLoading, setConfirmModalVehicleExitLoading] = React.useState(false);
  const [tableVehicleExitLoading, setTableVehicleExitLoading] = React.useState(true);
  const dom = useRef();
  const intl = useIntl();
  const [formVehicleExit] = Form.useForm();
  const VehicleExitRepository = Repository.get('vehicleExit');
  const UserRepository = Repository.get('user');
  const VehicleRepository = Repository.get('vehicle');
  const ServiceRepository = Repository.get('service');
  const { Option } = Select;
  const [carriers, setCarriers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);

  const columns = [
    {
      title: 'Carrier',
      key: 'name',
      render: (_, record) => (
        <Space>
          <span>{ `${record.carrier.firstName} ${record.carrier.lastName}` }</span>
        </Space>
      ),
    },
    {
      title: 'Vehicle',
      key: 'mark',
      render: (_, record) => (
        <Space>
          <span>{ `${record.vehicle.mark}` }</span>
        </Space>
      ),
    },
    {
      title: 'Service name',
      dataIndex: 'serviceName',
      key: 'serviceName',
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
          <EditFilled onClick={(e) => prepareEditVehicleExit(record) } style={{color: "#1d8efa", cursor: "pointer"}} />
          <Divider type="vertical" />
          <Popconfirm    
          title="Are you sure to delete this task?"
          onConfirm={(e) => deleteVehicleExit(record)}
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


  const prepareNewVehicleExit = () => {
    setVehicleExit(initialState);
    if ( services.length == 1 ) {
      const { _id, name, amount } = services[0];
      formVehicleExit.setFieldsValue({
      serviceId: _id,
      serviceName: name,
      amount,
      dateExit: moment()})

    } else formVehicleExit.setFieldsValue({dateExit: moment()});

    setModalAction(intl.formatMessage({id: 'component.Button.register', defaultMessage: 'Register'}));
    setShowModalVehicleExit(true);
  };

  const prepareEditVehicleExit = (vehicleExit) => {
    const parseVehicleExit = {...vehicleExit, dateExit: moment(vehicleExit.dateExit)};
    setVehicleExit(parseVehicleExit);
    formVehicleExit.setFieldsValue(parseVehicleExit)
    setModalAction(intl.formatMessage({id: 'component.Button.edit', defaultMessage: 'Edit'}));
    setShowModalVehicleExit(true);
  }

  const deleteVehicleExit = async (vehicleExit) => {
    try {
      await VehicleExitRepository.delete( vehicleExit._id );
      fetchVehicleExits();
    } catch(err) {
      console.error(err);
    }
  }

  const saveVehicleExit = () => {
    setConfirmModalVehicleExitLoading(true);
    formVehicleExit
      .validateFields()
      .then(async function(values) {
        formVehicleExit.resetFields();
        const newVehicleExit = { ...vehicleExit, ...values };
        setVehicleExit( newVehicleExit )
        try {
          if ('_id' in newVehicleExit) await VehicleExitRepository.update( newVehicleExit );
          else await VehicleExitRepository.store(newVehicleExit)
          fetchVehicleExits();
        } catch(err) {
          console.error(err);
        }
        setShowModalVehicleExit(false);
        setConfirmModalVehicleExitLoading(false);
      })
      .catch((info) => {
        setConfirmModalVehicleExitLoading(false);
        console.log('validade failed: ', info)
      })
  }

  const handleSearch = (newValue) => {
    if (newValue) {
      fetch(newValue, setData);
    } else {
      setData([]);
    }
  };

  const handleChange = (newValue) => {
    console.log(newValue)
  };

  const handleSelectServices = (_id) => {
    const service = services.find(item => item._id == _id)
    if (service) {
      formVehicleExit.setFieldsValue({amount: service.amount})
      formVehicleExit.setFieldsValue({serviceName: service.name})
    } else {
      setVehicleExit(item => ({...item, serviceName: '', amount: 0}));
    }
  };

  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };

  useEffect(() => {
    fetchVehicleExits();
    fetchCarriers();
    fetchVehicles();
    fetchServices();
    // if( roles == 'user') setIsEdit(false)
    // else setIsEdit(true)
  }, []);

  const fetchVehicleExits = async () => {
    setTableVehicleExitLoading(true);
    try {
      const filter = {};
      // if ( roles == 'instructor') filter.userData = { user: idUser };
      const { data } = await VehicleExitRepository.get( filter );
      setVehicleExits(data);
    } catch (err) {
      console.error('Error get blogs: ', err);
    }
    setTableVehicleExitLoading(false);
  };

  const fetchCarriers = async () => {
    try {
      const filter = { role: "carrier" };
      const { data } = await UserRepository.get( filter );
      setCarriers(data);
    } catch (err) {
      console.error('Error get blogs: ', err);
    }
  };

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

  const fetchVehicles = async () => {
    try {
      const filter = {};
      // if ( roles == 'instructor') filter.userData = { user: idUser };
      const { data } = await VehicleRepository.get( filter );
      setVehicles(data);
    } catch (err) {
      console.error('Error get blogs: ', err);
    }
  };

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
                {intl.formatMessage({id: "pages.vehicleExit.title", defaultMessage: 'VehicleExit'})}
              </div>
              <Button size="small" type="primary" onClick={ prepareNewVehicleExit }>
                {intl.formatMessage({id: "component.Button.exitRegister", defaultMessage: 'Register Exit'})}
              </Button>
            </div>
            <Divider />
            <Table size="small" loading={tableVehicleExitLoading} pagination={{position: ['bottomCenter']}} columns={columns} dataSource={vehicleExits} rowKey={(vehicleExit) => vehicleExit._id} />
          </div>
        </div>
      </GridContent>
      <Modal
        title={intl.formatMessage({id: "pages.vehicleExit.action", defaultMessage: 'Vehicle Exit'}, { action: modalAction })}
        visible={showModalVehicleExit}
        onOk={saveVehicleExit}
        confirmLoading={confirmModalVehicleExitLoading}
        onCancel={() => setShowModalVehicleExit(false)}
      >
        <Form
          form={formVehicleExit}
          layout="vertical"
          name="formModalVehicleExit"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          initialValues={vehicleExit}
          autoComplete="off"
        >

          <Form.Item
            label="Carriers"
            name="carrierId"
            rules={[{ required: true, message: 'Please select carrier!' }]}
          >
            <Select
              showSearch={false}
              placeholder={'Select carrier'}
              defaultActiveFirstOption={false}
              onChange={handleChange}
              notFoundContent={null}
            >
              {
                carriers.map((carrier) => <Option value={carrier._id} key={carrier._id}>{carrier.firstName} {carrier.lastName}</Option>)
              }
            </Select>
          </Form.Item>

          <Form.Item
            label="Vehicles"
            name="vehicleId"
            rules={[{ required: true, message: 'Please select vehicle!' }]}
          >
            <Select
              showSearch={false}
              placeholder={'Select vehiclec'}
              defaultActiveFirstOption={false}
              onChange={handleChange}
              notFoundContent={null}
            >
              {
                vehicles.map((vehicle) => <Option value={vehicle._id} key={vehicle._id}>{vehicle.mark} - alias: { vehicle.aliasName }</Option>)
              }
            </Select>
          </Form.Item>

          <Form.Item
            label="Services"
            name="serviceId"
            rules={[{ required: true, message: 'Please select service!' }]}
          >
            <Select
              showSearch={false}
              placeholder={'Select service'}
              onChange={handleSelectServices}
            >
              {
                services.map((service) => <Option value={service._id} key={service._id}>{service.name}</Option>)
              }
            </Select>
          </Form.Item>

          <Form.Item
            label="Service Description"
            name="serviceName"
            rules={[{ required: true, message: 'Please input your service description!' }]}
          >
            <Input />
          </Form.Item>

          <Row>
            <Col span={11}>
              <Form.Item
                label="Amount"
                name="amount"
                rules={[{ required: true, message: 'Please input your amount!' }]}
              >
                <InputNumber />
              </Form.Item>
            </Col>
            <Col span={12} offset={1} >
              <Form.Item
                label="Date exit"
                name="dateExit"
                rules={[{ required: true, message: 'Please input your date exit!' }]}
              >
                <DatePicker showTime={{ format: 'HH:mm' }} format={'DD/MM/YYYY HH:mm'} style={{width: '100%'}} onChange={onChange} />
              </Form.Item>
            </Col>
          </Row>

        </Form>
      </Modal>
    </>
  );
}

export default VehicleExit;
