import React, {  useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useIntl } from 'umi';
import { GridContent } from '@ant-design/pro-layout';
import { DatePicker, DatePickerProps, Popconfirm, Table, Select, Space, Divider, Modal, Form, Input, Button, Row, Col } from 'antd';
import {
  EditFilled, 
  DeleteFilled,
} from '@ant-design/icons';
import styles from './style.less';
import Repository from '@/repositories/factory/RepositoryFactory';

const VehicleExit = () => {
  const [modalAction, setModalAction] = useState('');
  const initialState = {
    firstName: '',
    lastName: '',
    identityNumber: '',
    phone: '',
    email: '',
    role: 'vehicleExit',
    haveUser: false
  }
  const [vehicleExit, setVehicleExit] = useState(initialState);
  const [vehicleExits, setVehicleExits] = useState([]);
  const [showModalVehicleExit, setShowModalVehicleExit] = useState(false);
  const [confirmModalVehicleExitLoading, setConfirmModalVehicleExitLoading] = React.useState(false);
  const dom = useRef();
  const intl = useIntl();
  const [formVehicleExit] = Form.useForm();
  const UserRepository = Repository.get('user');
  const { Option } = Select;
  const [data, setData] = useState([]);
  const [value, setValue] = useState()

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
    setModalAction(intl.formatMessage({id: 'component.Button.register', defaultMessage: 'Register'}));
    setShowModalVehicleExit(true);
  };

  const prepareEditVehicleExit = (vehicleExit) => {
    setVehicleExit(vehicleExit);
    setModalAction(intl.formatMessage({id: 'component.Button.edit', defaultMessage: 'Edit'}));
    setShowModalVehicleExit(true);
    formVehicleExit.setFieldsValue(vehicleExit)
  }

  const deleteVehicleExit = async (vehicleExit) => {
    try {
      await UserRepository.delete( vehicleExit._id );
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
          if ('_id' in newVehicleExit) await UserRepository.update( newVehicleExit );
          else await UserRepository.store(newVehicleExit)
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

  const fetchVehicleExits = async () => {
    try {
      const filter = { role: "vehicleExit" };
      // if ( roles == 'instructor') filter.userData = { user: idUser };
      const { data } = await UserRepository.get( filter );
      setVehicleExits(data.users);
    } catch (err) {
      console.error('Error get blogs: ', err);
    }
  };

  const handleSearch = (newValue) => {
    if (newValue) {
      fetch(newValue, setData);
    } else {
      setData([]);
    }
  };

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };

  const options = data.map((d) => <Option key={d.value}>{d.text}</Option>);

  useEffect(() => {
    fetchVehicleExits();
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
                {intl.formatMessage({id: "pages.vehicleExit.title", defaultMessage: 'VehicleExit'})}
              </div>
              <Button size="small" type="primary" onClick={ prepareNewVehicleExit }>
                {intl.formatMessage({id: "component.Button.exitRegister", defaultMessage: 'Register Exit'})}
              </Button>
            </div>
            <Divider />
            <Table size="small" pagination={{position: ['bottomCenter']}} columns={columns} dataSource={vehicleExits} rowKey={(vehicleExit) => vehicleExit._id} />
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
              showSearch
              value={value}
              placeholder={'Select carrier'}
              defaultActiveFirstOption={false}
              filterOption={(input, option) => option.children.includes(input)}
              onSearch={handleSearch}
              onChange={handleChange}
              notFoundContent={null}
            >
              {options}
            </Select>
          </Form.Item>

          <Form.Item
            label="Vehicles"
            name="carrierId"
            rules={[{ required: true, message: 'Please select vehicle!' }]}
          >
            <Select
              showSearch
              value={value}
              placeholder={'Select vehiclec'}
              defaultActiveFirstOption={false}
              filterOption={(input, option) => option.children.includes(input)}
              onSearch={handleSearch}
              onChange={handleChange}
              notFoundContent={null}
            >
              {options}
            </Select>
          </Form.Item>

          <Form.Item
            label="Services"
            name="carrierId"
            rules={[{ required: true, message: 'Please select service!' }]}
          >
            <Select
              showSearch
              value={value}
              placeholder={'Select service'}
              defaultActiveFirstOption={false}
              filterOption={(input, option) => option.children.includes(input)}
              onSearch={handleSearch}
              onChange={handleChange}
              notFoundContent={null}
            >
              {options}
            </Select>
          </Form.Item>

          <Row>
            <Col span={11}>
              <Form.Item
                label="Amount"
                name="amount"
                rules={[{ required: true, message: 'Please input your amount!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12} offset={1} >
              <Form.Item
                label="Date exit"
                name="dateExit"
                rules={[{ required: true, message: 'Please input your date exit!' }]}
              >
                <DatePicker style={{width: '100%'}} onChange={onChange} />
              </Form.Item>
            </Col>
          </Row>

        </Form>
      </Modal>
    </>
  );
}

export default VehicleExit;
