import React, {  useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useIntl } from 'umi';
import { GridContent } from '@ant-design/pro-layout';
import { message, DatePicker, InputNumber, DatePickerProps, Popconfirm, Table, Select, Space, Divider, Modal, Form, Input, Button, Row, Col } from 'antd';
import moment from 'moment';
import {
  EditFilled, 
  DeleteFilled,
  DeleteOutlined,
  CheckSquareTwoTone,
} from '@ant-design/icons';
import styles from './style.less';
import Repository from '@/repositories/factory/RepositoryFactory';
import * as $ from 'jquery';

const Transaction = () => {
  const [modalAction, setModalAction] = useState('');
  const initialStateTransaction = {
    carrierId: '',
    userId: null,
    dateAt: moment().format('DD/MM/YYYY HH:mm'),
    total: null,
  }
  const [transaction, setTransaction] = useState(initialStateTransaction);
  const [transactions, setTransactions] = useState([]);
  const [vehicleExitsByCarrier, setVehicleExitsByCarrier] = useState([]);
  const [carriers, setCarriers] = useState([]);
  const [transactionDetails, setTransactionDetails] = useState([]);
  const [showModalTransaction, setShowModalTransaction] = useState(false);
  const [confirmModalTransactionLoading, setConfirmModalTransactionLoading] = React.useState(false);
  const dom = useRef();
  const intl = useIntl();
  const [formTransaction] = Form.useForm();
  const UserRepository = Repository.get('user');
  const TransactionRepository = Repository.get('transaction');
  const VehicleExitRepository = Repository.get('vehicleExit');
  const { Option } = Select;
  const [data, setData] = useState([]);
  const [value, setValue] = useState()
  let timeout;
  let currentValue;


  //link: https://css-tricks.com/the-javascript-behind-touch-friendly-sliders/
  // const slider = {
  //   
  //   el: {
  //     slider: document.getElementById("#slider"),
  //     allSlides: document.getElementByClassName(".slide")
  //   },
  // 
  //   init: function() {
  //     // manual scrolling
  //     this.el.slider.on("scroll", function(event) {
  //       slider.moveSlidePosition(event);
  //     });
  //   },
  //   
  //   moveSlidePosition: function(event) {
  //     // Magic Numbers
  //     this.el.allSlides.css({
  //       "background-position": $(event.target).scrollLeft()/6-100+ "px 0"
  //     });  
  //   }
  //   
  // };

  const handleFooterTransaction = (record) => (
    <div className="table-footer-modal" >
      <div key={ transaction.total }><b style={{marginRight: '30px'}}>Total:</b> S/{parseFloat(transaction.total).toFixed(2)}</div>
    </div>
  );
  

  const columnsPay = [
    {
      title: 'No.',
      key: 'numeration',
      render: (_, record, index) => (
        <Space>
          <span>{index + 1}</span>
        </Space>
      ),
    },
    {
      title: 'Service',
      dataIndex: 'detail',
      key: 'detail',
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (_, record) => (
        <Space>
          <span>S/{ `${parseFloat(record.amount).toFixed(2)}` }</span>
        </Space>
      ),
    },
    {
      title: '-',
      key: 'action',
      align: 'center',
      render: (_, record, index) => (
        <Space>
          <DeleteOutlined style={{color: "#1d8efa", cursor: "pointer"}} />
        </Space>
      ),
    },
  ];
  const columnsVehicleExits = [
    {
      title: 'Service',
      dataIndex: 'serviceName',
      key: 'serviceName',
    },
    {
      title: 'Car',
      key: 'mark',
      render: (_, record) => (
        <Space>
          <span>{`${record.vehicle.mark}`}</span>
        </Space>
      ),
    },
    {
      title: 'Date',
      key: 'dateExit',
      render: (_, record) => (
        <Space>
          <span>{`${moment(record.dateExit).format('DD/MM/YYYY HH:MM')}`}</span>
        </Space>
      ),
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (_, record) => (
        <Space>
          <span>S/{ `${parseFloat(record.amount).toFixed(2)}` }</span>
        </Space>
      ),
    },
  ];
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
          <EditFilled onClick={(e) => prepareEditTransaction(record) } style={{color: "#1d8efa", cursor: "pointer"}} />
          <Divider type="vertical" />
          <Popconfirm    
          title="Are you sure to delete this task?"
          onConfirm={(e) => deleteTransaction(record)}
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


  const prepareNewTransaction = () => {
    formTransaction.resetFields();
    setTransaction(initialStateTransaction);
    setTransactionDetails([]);
    setVehicleExitsByCarrier([]);
    setValue('');

    formTransaction.setFieldsValue({ dateAt: moment() })

    setModalAction(intl.formatMessage({id: 'component.Button.register', defaultMessage: 'Register'}));
    setShowModalTransaction(true);
  };

  const prepareEditTransaction = (transaction) => {
    setTransaction(transaction);
    setTransactionDetails([]);
    setVehicleExitsByCarrier([]);
    setModalAction(intl.formatMessage({id: 'component.Button.edit', defaultMessage: 'Edit'}));
    setShowModalTransaction(true);
    formTransaction.setFieldsValue(transaction)
  }

  const deleteTransaction = async (transaction) => {
    try {
      await UserRepository.delete( transaction._id );
      fetchTransactions();
    } catch(err) {
      console.error(err);
    }
  }

  const saveTransaction = () => {
    setConfirmModalTransactionLoading(true);
    formTransaction
      .validateFields()
      .then(async function(values) {
        const newTransaction = { ...transaction, ...values };
        const newTransactionDetails = [ ...transactionDetails ]
        console.log('transaction', newTransaction)
        console.log('transactionDetails', newTransactionDetails)
        setTransaction( newTransaction )
        setTransactionDetails( newTransactionDetails )
        try {
          if ('_id' in newTransaction) await TransactionRepository.update( newTransaction );
          else await TransactionRepository.store({transaction: newTransaction, transactionDetails: newTransactionDetails})
          fetchTransactions();
        } catch(err) {
          console.error(err);
        }
        setShowModalTransaction(false);
        setConfirmModalTransactionLoading(false);
        formTransaction.resetFields();
      })
      .catch((info) => {
        setConfirmModalTransactionLoading(false);
        console.log('validade failed: ', info)
      })
  }

  const fetchTransactions = async () => {
    try {
      const filter = { role: "transaction" };
      // if ( roles == 'instructor') filter.userData = { user: idUser };
      const { data } = await UserRepository.get( filter );
      setTransactions(data);
    } catch (err) {
      console.error('Error get blogs: ', err);
    }
  };

  const fetchCarriers = async () => {
    try {
      const filter = { role: "carrier" };
      const { data } = await UserRepository.get( filter );
      console.log('data', data)
      setCarriers(data);
    } catch (err) {
      console.error('Error get blogs: ', err);
    }
  };
  
  const handleSearchCarriers = () => {

  }

  const handleChangeCarrier = (value, type, callback) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;
    console.log('valie', value)
    console.log('type', type)
  	async function fake() {
    // Observación, la busqueda del stand se hace por id, puede funcionar mejor por dni
      const filter = { carrierId: currentValue };
      const {data} = await VehicleExitRepository.get( filter );
      if (currentValue === value) {
        const result = data;
        console.log('data data debts', data)
        const tmp_data = [];
        setVehicleExitsByCarrier(result);
        console.log('exits', vehicleExitsByCarrier)
        result.forEach(item => {
          tmp_data.push({value: item.id+' '+item.stand_id,text: `${item.market_code?item.market_code+' | ':''} ${item.sector_name?item.sector_name+' | ':''} ${item.stand_code?item.stand_code+' | ':''} ${item.stand_name?item.stand_name+' | ':''} ${item.name} ${item.lastname?item.lastname:''}`,photo:item.photo,stand_id:item.stand_id});
        });
        
        // callback(tmp_data);
		}

  	}
	timeout = setTimeout(fake, 300);
}


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

  const customRowVehicleExitClassName = (record, index) => {
			return record.por_pagar ? 'selected-row' : 'deselected-row';
  }

  const customRowVehicleExit = (record, rowIndex) => {
    return {
      // click row
      onClick: event => {
        const vehicleExit = {};
        vehicleExit.detail = record.serviceName;
        vehicleExit.vehicleExitId = record._id;
        vehicleExit.vehicle = record.vehicle;
        vehicleExit.amount = record.amount;
        vehicleExit.total = record.amount;  // payment

        let is_added_debt = (transactionDetails.findIndex(detail => detail._id == record._id) > -1) ? true : false;
        if(is_added_debt) { message.error(`Vehicle exit ${vehicleExit.serviceName} ${vehicleExit.amount} ya agregada!!!`); return;}
        record.por_pagar=1;
        const tmpTransactionDetails = transactionDetails;
        tmpTransactionDetails.push(vehicleExit);
        const total = transactionDetails.reduce((accum,item) => accum += Number.parseFloat( item.amount) ,0 ).toFixed(2)
        setTransaction(item => ({...item, total }));
        setTransactionDetails(tmpTransactionDetails);
      }, 
      onDoubleClick: event => {}, // double click row
      onContextMenu: event => {}, // right button click row
      onMouseEnter: event => {}, // mouse enter row
      onMouseLeave: event => {}, // mouse leave row
    };
  }

  useEffect(() => {
    fetchTransactions();
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
                {intl.formatMessage({id: "pages.paymentRecord.title", defaultMessage: 'Payment Record'})}
              </div>
              <Button size="small" type="primary" onClick={ prepareNewTransaction }>
                {intl.formatMessage({id: "component.Button.exitRegister", defaultMessage: 'Register Exit'})}
              </Button>
            </div>
            <Divider />
            <Table size="small" pagination={{position: ['bottomCenter']}} columns={columns} dataSource={transactions} rowKey={(transaction) => transaction._id} />
          </div>
        </div>
      </GridContent>
      <Modal
        title={intl.formatMessage({id: "pages.paymentRecord.action", defaultMessage: 'Payment record'}, { action: modalAction })}
        visible={showModalTransaction}
        onOk={saveTransaction}
        width="100"
        style={{ 'top': '20px' }}
        confirmLoading={confirmModalTransactionLoading}
        onCancel={() => setShowModalTransaction(false)}
      >
        <Row gutter={16}>
          <Col className="gutter-row" span={10}>
            <Form
              form={formTransaction}
              layout="vertical"
              name="formModalTransaction"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              initialValues={transaction}
              autoComplete="off"
            >
              <Row>
                <Col xs={24} lg={17} >
                  <Form.Item
                    label="Carriers"
                    name="carrierId"
                    style={{marginBottom: '5px'}}
                    rules={[{ required: true, message: 'Please select carrier!' }]}
                  >
                    <Select
                      showSearch
                      value={value}
                      placeholder={'Select service'}
                      defaultActiveFirstOption={false}
                      filterOption={(input, option) => option.children.includes(input)}
                      onFocus={fetchCarriers}
                      onSearch={handleSearchCarriers}
                      onChange={handleChangeCarrier}
                      notFoundContent={null}
                    >
                      {carriers.map((d) => <Option key={d._id}>{d.firstName} {d.lastName}</Option>)}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={9} lg={{span: 6, offset: 1}} >
                  <Form.Item
                    label="Date"
                    name={ 'dateAt' }
                    style={{marginBottom: '5px'}}
                    rules={[{ required: true, message: 'Please input your date!' }]}
                  >
                    <DatePicker value={moment().format('DD/MM/YYYY')} format={'DD/MM/YYYY'} disabled={ true } style={{width: '100%'}}  onChange={onChange} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Table 
            size="small" 
            pagination={false} 
            columns={columnsPay} 
            footer={handleFooterTransaction}
            dataSource={[...transactionDetails]} 
            rowKey={(data) => data.vehicleExitId+'_detail'} />
          </Col>
          <Col className="gutter-row" span={14}>
            <div className={styles.listDebts}>
              <p className={styles.tableOperationsTitle}>List debts</p>
              <div className={styles.tableOperations}>
                <InputNumber style={{width: '200px'}} size="small" placeholder="Buscar..." />
                <Button size="small" type="primary">
                  {intl.formatMessage({id: "component.Button.search", defaultMessage: 'Search'})}
                </Button>
                <Divider type='vertical' style={{background: 'white'}} />
                <span className={styles.tableOperationsMessage}><CheckSquareTwoTone /> Click. </span>
              </div>
              <Table 
              size="small" 
              pagination={true} 
              columns={columnsVehicleExits} 
              dataSource={[...vehicleExitsByCarrier]} 
              onRow={customRowVehicleExit}
              scroll={{x:'100%',y:300}}
              rowClassName={ customRowVehicleExitClassName }
              rowKey={(transaction) => transaction._id} />
            </div>
          </Col>
        </Row>
      </Modal>
    </>
  );
}

export default Transaction;
