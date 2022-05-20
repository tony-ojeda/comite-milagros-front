import React, { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Upload, message } from 'antd';
import ProForm, {
  ProFormDependency,
  ProFormFieldSet,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { useRequest } from 'umi';
import Repository from '@/repositories/factory/RepositoryFactory';
import { queryProvince, queryCity } from '../service';
import styles from './BaseView.less';

const validatorPhone = (rule, value, callback) => {
  if (!value[0]) {
    callback('Please input your area code!');
  }

  if (!value[1]) {
    callback('Please input your phone number!');
  }

  callback();
};

const BaseView = () => {
  const UserRepository = Repository.get('user');
  const [img, setImg] = useState('');
  const { data: currentUser, loading } = useRequest(() => {
    return UserRepository.currentUser();
  });

  const getAvatarURL = () => {
    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }

      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }

    return '';
  };

  const handleFinish = async (data) => {
    const payload = { ...currentUser, ...data }
    try {
      await UserRepository.update(payload)
      message.success('Update basic information successfully');
    } catch(err) {
      message.error('Error Update basic information successfully');
    }
  };


  const onChangeUploadImage = (info) => {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        const { response } = info.file;
        currentUser.avatar = response.secure_url;
        setImg(`${response.secure_url}`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
  }



  const AvatarView = ({ avatar }) => (
    <>
      <div className={styles.avatar_title}>avatar</div>
      <div className={styles.avatar}>
        <img src={avatar} alt="avatar" />
      </div>
    <Upload name="singleFile" action={`${REACT_APP_API_URL}/api/v1/uploads/file`} onChange={onChangeUploadImage} headers={{ authorization: 'authorization-text' }}>
        <div className={styles.button_view}>
          <Button>
            <UploadOutlined />
            Change Avatar
          </Button>
        </div>
      </Upload>
    </>
  );


  return (
    <div className={styles.baseView}>
      {loading ? null : (
        <>
          <div className={styles.left}>
            <ProForm
              layout="vertical"
              onFinish={handleFinish}
              submitter={{
                submitButtonProps: {
                  submitText: 'submit',
                },
                resetButtonProps: {
                  style: {
                    display: 'none',
                  },
                },
                submitButtonProps: {
                  children: 'Update Basic Information',
                },
              }}
              initialValues={ currentUser }
              hideRequiredMark
            >
              <ProFormText
                width="md"
                name="email"
                label="Mail"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your email!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="name"
                label="Nick name"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your nickname!',
                  },
                ]}
              />
              <ProFormTextArea
                name="presentation"
                label="Personal profile"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your bio!',
                  },
                ]}
                placeholder="Personal profile"
              />

              <ProFormText
                name="phone"
                label="contact number"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your contact number!',
                  },
                ]}
              >
                <Input className={styles.phone_number} />
              </ProFormText>
            </ProForm>
          </div>
          <div className={styles.right}>
            <AvatarView key={ img } avatar={getAvatarURL()} />
          </div>
        </>
      )}
    </div>
  );
};

export default BaseView;
