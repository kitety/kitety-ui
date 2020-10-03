import React from 'react';
import { Upload } from './index';
import { withKnobs, text, boolean, select, number } from '@storybook/addon-knobs';
import { AxiosRequestConfig, Method } from 'axios';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Upload',
  component: Upload,
  decorators: [withKnobs],
};
const methods: Method[] = [
  'get',
  'GET',
  'delete',
  'DELETE',
  'head',
  'HEAD',
  'options',
  'OPTIONS',
  'post',
  'POST',
  'put',
  'PUT',
  'patch',
  'PATCH',
  'purge',
  'PURGE',
  'link',
  'LINK',
  'unlink',
  'UNLINK',
];
export const knobsBtn = () => {
  const uploadMode = select('uploadMode', ['default', 'img'], 'default');
  const axiosConfig: Partial<AxiosRequestConfig> = {
    url: text('URL', 'http://localhost:51111/user/uploadAvatar/'),
    method: select('method', methods, 'POST'),
  };
  const uploadFilename = text('uploadFileName', 'avatar');

  return (
    <Upload
      multiple={boolean('multiple', false)}
      accept={text('accept', '')}
      slice={boolean('slice', false)}
      progress={boolean('progress', false)}
      max={number('max', 100)}
      onProgress={action('onProgress')}
      onRemoveCallback={action('onRemoveCallback')}
      uploadFilename={uploadFilename}
      axiosConfig={axiosConfig}
      uploadMode={uploadMode}
    />
  );
};
export const imgUpload = () => <Upload uploadMode="img"></Upload>;

export const progressUpload = () => <Upload progress={true}></Upload>;
