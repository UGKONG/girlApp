export interface iSuccessResponseData {
  status: 200;
  result: boolean;
  current: any;
  message: 'success';
}
export interface iFailResponseData {
  status: 404 | 500;
  result: boolean;
  current: null;
  message: string;
}
export interface iAxiosResponse {
  data: iSuccessResponseData | iFailResponseData;
}

export const fail = (message: string = 'Error'): iFailResponseData => {
  return {
    status: 404,
    result: false,
    message: message,
    current: null,
  };
};

export const success = (data: any = {}): iSuccessResponseData => {
  return {
    status: 200,
    result: true,
    message: 'success',
    current: data,
  };
};

export default {success, fail};
