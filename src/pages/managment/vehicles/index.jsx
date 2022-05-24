import React, {  useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useIntl, useRequest } from 'umi';
import { GridContent } from '@ant-design/pro-layout';
import { message, Avatar, Upload, Popconfirm, Table, Tag, Space, Divider, Modal, Form, Input, Button, Row, Col } from 'antd';
import {
  EditFilled, 
  DeleteFilled,
  UploadOutlined,
} from '@ant-design/icons';
import styles from './style.less';
import Repository from '@/repositories/factory/RepositoryFactory';

const Vehicles = () => {
  const [modalAction, setModalAction] = useState('');
  const initialState = {
    licensePlate: '',
    aliasName: '',
    identityNumber: '',
    mark: '',
    model: '',
    urlImage: '',
  }
  const [vehicle, setVehicle] = useState(initialState);
  const [vehicles, setVehicles] = useState([]);
  const [showModalVehicle, setShowModalVehicle] = useState(false);
  const [img, setImg] = useState('');
  const [confirmModalVehicleLoading, setConfirmModalVehicleLoading] = React.useState(false);
  const dom = useRef();
  const intl = useIntl();
  const [formVehicle] = Form.useForm();
  const VehicleRepository = Repository.get('vehicle');

  const columns = [
    {
      title: 'Car',
      key: 'urlImage',
      render: (_, record) => (
        <Space>
          <Avatar src={ record.urlImage } />
        </Space>
      ),
    },
    {
      title: 'Alias Name',
      dataIndex: 'aliasName',
      key: 'aliasName',
    },
    {
      title: 'Mark',
      dataIndex: 'mark',
      key: 'mark',
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: 'License Plate',
      dataIndex: 'licensePlate',
      key: 'licensePlate',
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
    setImg('/img/car/car_example.png');
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
      await VehicleRepository.delete( vehicle._id );
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
        const newVehicle = { ...vehicle, ...values  };
        setVehicle( newVehicle )
        try {
          if ('_id' in newVehicle) await VehicleRepository.update( newVehicle );
          else await VehicleRepository.store(newVehicle)
          message.success(`Vehicle ${ ('_id' in newVehicle) ?'updated!' : 'created!'}`);
          fetchVehicles();
        } catch(err) {
          message.error(`No se pudo procesar!!!`);
          console.error(err);
        }
        setShowModalVehicle(false);
        setConfirmModalVehicleLoading(false);
      })
      .catch((info) => {
        setConfirmModalVehicleLoading(false);
        console.error('validade failed: ', info)
      })
  }

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

  const onChangeUploadImage = (info) => {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        const { response } = info.file;
        setImg(`${response.secure_url}`)
        setVehicle(vehicle => ({ ...vehicle, urlImage: response.secure_url }))
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
  }

  const getImgURL = () => {
    if (img) return img;
    const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    return url;
  };

  const AvatarView = ({ avatar }) => (
    <>
      <div className={styles.avatar_title}>Vehicle</div>
      <div className={styles.avatar}>
        <img src={avatar} width="100%" alt="avatar" />
      </div>
    <Upload name="singleFile" action={`${REACT_APP_API_URL}/api/v1/uploads/file`} onChange={onChangeUploadImage} headers={{ authorization: 'authorization-text' }}>
        <div className={styles.button_view}>
          <Button>
            <UploadOutlined />
            Change Image
          </Button>
        </div>
      </Upload>
    </>
  );

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
        width="720px"
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
            <Col span={8}>
              <Form.Item
                label="License plate"
                name="licensePlate"
                rules={[{ required: true, message: 'Please input your license plate' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Alias name"
                name="aliasName"
                rules={[{ required: true, message: 'Please input your alias name' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Mark"
                name="mark"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Model"
                name="model"
              >
                <Input />
              </Form.Item>

            </Col>
            <Col span={15} offset={1} >
              <div className={styles.right}>
                <AvatarView key={ img } avatar={getImgURL()} />
              </div>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default Vehicles;
