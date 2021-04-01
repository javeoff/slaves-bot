import { AxiosError } from 'axios';

export const isAxiosError = (error: unknown): error is AxiosError =>
  typeof error === 'object' &&
  error !== null &&
  'isAxiosError' in error &&
  'response' in error;
