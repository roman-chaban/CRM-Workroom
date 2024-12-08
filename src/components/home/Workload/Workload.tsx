import React, { type FC } from 'react';

import { NavView } from '@/components/home/NavView/NavView';

import { Div } from '@/index';

import styles from '@/components/home/Workload/Workload.module.scss';

export const Workload: FC = () => {
  return (
    <Div className={styles['workload']}>
      <Div className={styles['workloadContainer']}>
        <NavView
          href=""
          link={'View all'}
          title={'Workload'}
        />
      </Div>
    </Div>
  );
};
