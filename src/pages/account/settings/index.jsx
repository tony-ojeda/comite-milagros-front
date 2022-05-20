import React, { useState, useRef, useLayoutEffect } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import BaseView from './components/base';
import BindingView from './components/binding';
import NotificationView from './components/notification';
import SecurityView from './components/security';
import styles from './style.less';
const { Item } = Menu;

const Settings = () => {
  const menuMap = {
    base: 'Basic Settings',
    security: 'Security Settings',
    binding: 'Cccount Binding',
    notification: 'New Message Notification',
  };
  const [initConfig, setInitConfig] = useState({
    mode: 'inline',
    selectKey: 'base',
  });
  const dom = useRef();

  const resize = () => {
    requestAnimationFrame(() => {
      if (!dom.current) {
        return;
      }

      let mode = 'inline';
      const { offsetWidth } = dom.current;

      if (dom.current.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }

      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }

      setInitConfig({ ...initConfig, mode: mode });
    });
  };

  useLayoutEffect(() => {
    if (dom.current) {
      window.addEventListener('resize', resize);
      resize();
    }

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [dom.current]);

  return (
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
          <div className={styles.title}>{menuMap[initConfig.selectKey]}</div>
            <BaseView />
        </div>
      </div>
    </GridContent>
  );
};

export default Settings;
