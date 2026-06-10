import { test as setup } from '@playwright/test';
import { multiAuthLogin } from '../helpers/login/multiAuthLogin';
setup('authenticate', async ({ page, baseURL }) => {
  await multiAuthLogin(page, baseURL);
});