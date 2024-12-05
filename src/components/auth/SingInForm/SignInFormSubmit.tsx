import React, { type FC } from 'react';

import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/index/index';

import { NAV_PATHS } from '@/enums/navPaths';

import styles from '@/components/auth/SingInForm/SignInForm.module.scss';

interface SignInFormSubmitProps {
  isSubmitting: boolean;
  isButtonDisabled: boolean;
}

export const SignInFormSubmit: FC<SignInFormSubmitProps> = ({ isSubmitting, isButtonDisabled }) => {
  return (
    <div className={styles['signInFormBlockSubmit']}>
      <Button
        type="submit"
        className={styles['signInFormBlockButton']}
        disabled={isButtonDisabled}
      >
        {isSubmitting ? 'Logging in...' : 'Log In'}

        <Image
          src={'/images/auth/icons/arrow-right.svg'}
          alt="Arrow Right Icon"
          width={24}
          height={24}
          priority
        />
      </Button>

      <Button
        type="button"
        className={styles['signInFormBlockAccount']}
      >
        <Link href={NAV_PATHS.MULTI_STEP_SIGN_IN}>Don’t have an account?</Link>
      </Button>
    </div>
  );
};
