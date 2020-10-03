import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';
import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, color, iconSpin } from '../..';
import { Icon } from '../icon';
import { message } from '../message';
import { Modal } from '../modal';
import { Progress } from '../progress';

type ProgressBarStatus = 'ready' | 'success' | 'failed' | 'upload';
interface ProgressBar {
  filename: string;
  percent: number;
  status: ProgressBarStatus;
  uid: string;
  size: number;
  raw: File | null;
  cancel: CancelTokenSource;
  img?: string | ArrayBuffer | null;
}
type onProgressType = ((p: number, f: File, i: number) => void) | undefined;
type UploadMode = 'default' | 'img';
export type UploadProps = {
  /** 上传字段名 */
  uploadFilename: string[] | string;
  /** 上传配置 参考axios */
  axiosConfig?: Partial<AxiosRequestConfig>;
  /** 获取进度 */
  onProgress?: onProgressType;
  /** 成功回调 */
  successCallback?: ((res: any, i: number) => void) | undefined;
  /** 失败回调 */
  failCallback?: ((res: any, i: number) => void) | undefined;
  /** 上传列表初始值 */
  defaultProgressBar?: ProgressBar[];
  /** 如果返回promise，需要提供file，否则同步需要返回boolean，如果为false，则不发送 */
  beforeUpload?: (f: File, i: number) => boolean | Promise<File>;
  /** 上传模式设置 */
  uploadMode?: UploadMode;
  /** 是否开启进度列表 */
  progress?: boolean;
  onRemoveCallback?: (f: ProgressBar) => void;
  /** 自定义删除行为，只有img与progress为true有效 */
  customRemove?: (
    file: ProgressBar,
    setFlist: React.Dispatch<React.SetStateAction<ProgressBar[]>>,
  ) => void;
  /* 允许上传最大容量 */
  max?: number;
  /** input的accept属性 */
  accept?: string;
  /** input的multiple属性   multiple为true和max冲突*/
  multiple?: boolean;
  /** 用户自定义按钮 */
  customBtn?: ReactNode;
  /** 开启图片裁剪 */
  slice?: boolean;
};
interface UploadListProps {
  fileList: ProgressBar[];
  onRemove: (item: ProgressBar) => void;
}

interface ImageListProps extends UploadListProps {
  setFileList: React.Dispatch<React.SetStateAction<ProgressBar[]>>;
}

type ModalContentType = {
  rotate: number;
  times: number;
  img: HTMLImageElement;
  left: number;
  top: number;
};

const ImgWrapper = styled.div`
  display: inline-block;
  position: relative;
  width: 104px;
  height: 104px;
  line-height: 104px;
  margin-right: 8px;
  margin-bottom: 8px;
  text-align: center;
  vertical-align: top;
  background: #fafafa;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  cursor: pointer;
  transition: border-color 0.3s ease;
  > img {
    width: 100%;
    height: 100%;
  }
  &:before {
    left: 0;
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: all 0.3s;
    content: '';
  }
  &:hover:before {
    opacity: 1;
  }
  &:hover > .closeBtn {
    display: block;
  }
`;
const ImgCloseBtn = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  display: none;
`;
const ProgressListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ProgressLi = styled.li`
  list-style: none;
  padding: 10px;
  box-shadow: 2px 2px 4px #d9d9d9d9;
`;
const ImgUpload = styled.div`
  display: inline-block;
  position: relative;
  width: 104px;
  height: 104px;
  margin-right: 8px;
  margin-bottom: 8px;
  text-align: center;
  vertical-align: top;
  background-color: #fafafa;
  border: 1px dashed #d9d9d9;
  border-radius: 2px;
  cursor: pointer;
  transition: border-color 0.3 ease;
  > svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

function chooseProcessListColor(status: ProgressBarStatus) {
  switch (status) {
    case 'failed':
      return color.negative;
    case 'ready':
      return color.warning;
    case 'success':
      return color.positive;
    case 'upload':
      return color.secondary;
  }
}

const ProcessListItemName = styled.div<{ status: ProgressBarStatus }>`
  color: ${(props) => chooseProcessListColor(props.status)};
`;

export const IconSpin = styled.span`
  & > svg {
    animation: ${iconSpin} 2s linear infinite;
  }
`;
export function UploadList(props: UploadListProps) {
  const { fileList, onRemove } = props;
  return (
    <ul>
      {fileList.map((item) => (
        <ProgressLi key={item.uid}>
          <ProgressListItem>
            <ProcessListItemName status={item.status}>{item.filename}</ProcessListItemName>
            <div>
              <Button
                style={{
                  padding: '0',
                  background: 'transparent',
                }}
                onClick={() => {
                  onRemove(item);
                }}
              >
                <Icon icon="close" color={chooseProcessListColor(item.status)} />
              </Button>
            </div>
          </ProgressListItem>
          {['upload', 'ready'].includes(item.status) && <Progress count={item.percent} />}
        </ProgressLi>
      ))}
    </ul>
  );
}
const btnStyle = {
  padding: '10px',
};
const rotateBtnStyle = {
  padding: '10px',
  transform: 'rotateY(180deg)',
};
export function ImageUploadList(props: ImageListProps) {
  const { onRemove, setFileList, fileList } = props;
  useEffect(() => {
    fileList?.map((item) => {
      if (item.raw && !item.img) {
        //如果有文件并且没有img地址，生成blob地址
        getBase64(item.raw, (e: string) => {
          updateFileList(setFileList, item, {
            img: e || 'error',
          });
        });
      }
    });
  }, [fileList, setFileList]);
  return (
    <div>
      {fileList.map((item) => (
        <span key={item.uid}>
          <ImgWrapper>
            {item.status === 'success' && <img src={item.img as string} alt="upload img"></img>}
            {(item.status === 'ready' || item.status === 'upload') && (
              <IconSpin>
                <Icon icon="sync" color={color.warning}></Icon>
              </IconSpin>
            )}
            {item.status === 'failed' && <Icon icon="photo" color={color.negative}></Icon>}

            <ImgCloseBtn className="closeBtn" onClick={() => onRemove(item)}>
              <Icon icon="trash" color={color.light}></Icon>
            </ImgCloseBtn>
          </ImgWrapper>
        </span>
      ))}
    </div>
  );
}
export const updateFileList = (
  setFileList: React.Dispatch<React.SetStateAction<ProgressBar[]>>,
  _file: ProgressBar,
  uploadPartial: Partial<ProgressBar>,
) => {
  setFileList((prevList) => {
    if (prevList) {
      return prevList.map((v) => {
        if (v.uid === _file.uid) {
          return { ...v, ...uploadPartial };
        } else {
          return v;
        }
      });
    } else {
      return prevList;
    }
  });
};

const postData = function (
  file: File,
  filename: string,
  config: Partial<AxiosRequestConfig>,
  i: number, // 多重上传的标记
  onProgress: onProgressType,
  setFileList: React.Dispatch<React.SetStateAction<ProgressBar[]>>,
  successCallback?: ((res: any, i: number) => void) | undefined,
  failCallback?: ((res: any, i: number) => void) | undefined,
) {
  const formData = new FormData();
  formData.append(filename, file);
  const source = axios.CancelToken.source();
  const _file: ProgressBar = {
    filename: file.name,
    percent: 0,
    status: 'ready',
    uid: Date.now() + 'upload',
    size: file.size,
    raw: file,
    cancel: source,
  };
  // 添加进队列
  setFileList((prevList) => [_file, ...prevList]);
  const defaultAxiosConfig: Partial<AxiosRequestConfig> = {
    method: 'post',
    url: 'http://localhost:51111/user/uploadAvatar/',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    cancelToken: source.token,
    onUploadProgress: (e) => {
      let percentage = Math.round((e.loaded * 1000) / e.total) || 0;
      updateFileList(setFileList, _file, {
        status: 'upload',
        percent: percentage,
      });
      if (onProgress) {
        onProgress(percentage, file, i);
      }
    },
  };
  const mergeConfig = { ...defaultAxiosConfig, ...config };
  return axios(mergeConfig)
    .then((res) => {
      updateFileList(setFileList, _file, { status: 'success', percent: 100 });
      successCallback?.(res, i);
    })
    .catch((r) => {
      updateFileList(setFileList, _file, { status: 'failed', percent: 0 });
      failCallback?.(r, i);
    });
};
const resolveFilename = function (uploadFilename: string[] | string, index: number) {
  if (Array.isArray(uploadFilename)) {
    return uploadFilename[index];
  }
  return uploadFilename;
};

// canvasDraw方法就是通过保存的变量以及canvas进行画图：
function canvasDraw(modalContent: ModalContentType, canvas: HTMLCanvasElement) {
  const image = modalContent.img;
  const ctx = canvas.getContext('2d');
  // 清屏
  // eslint-disable-next-line no-self-assign
  canvas.height = canvas.height;
  let imgWidth = image.width;
  let imgHeight = image.height;
  //canvas宽高300,判断图片长宽谁长，取长的
  let times = modalContent.times;
  if (imgWidth > imgHeight) {
    // 宽比高度更大
    let rate = canvas.width / imgWidth;
    imgWidth = canvas.width * times;
    imgHeight = imgHeight * rate * times;
  } else {
    // 宽比高度更大
    let rate = canvas.height / imgHeight;
    imgHeight = canvas.height * times;
    imgWidth = imgWidth * rate * times;
  }
  // 此时 宽高等比例缩放，算起始点的偏移，起始高度就是canvas高-图片的高再除以2
  const startX = (canvas.width - imgWidth) / 2;
  const startY = (canvas.height - imgHeight) / 2;
  // 旋转操作
  //旋转首先移动原点到图片中心，这里中心是canvas中心,然后再移动回来
  const midX = canvas.width / 2;
  const midY = canvas.height / 2;
  ctx?.translate(midX, midY);
  ctx?.rotate(modalContent.rotate);
  ctx?.drawImage(image, startX - midX, startY - midY, imgWidth, imgHeight);
  ctx?.translate(0, 0);
}
const getBase64 = (raw: File, callback: Function) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    callback(reader.result);
  });
  reader.readAsDataURL(raw);
};
export function Upload(props: UploadProps) {
  const {
    uploadMode,
    axiosConfig,
    onProgress,
    defaultProgressBar,
    uploadFilename,
    successCallback,
    failCallback,
    beforeUpload,
    customRemove,
    progress,
    onRemoveCallback,
    max,
    accept,
    multiple,
    customBtn,
    slice,
  } = props;
  const [fileList, setFileList] = useState<ProgressBar[]>(defaultProgressBar || []);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContentType>({
    rotate: 0,
    times: 1,
    img: new Image(),
    left: 0,
    top: 0,
  });
  const [mouseActive, setMouseActive] = useState(false);
  const [startXY, setStartXY] = useState({ X: 0, Y: 0 });
  const [resCallback, setResCallback] = useState<{ resetFn: Function }>({
    resetFn: () => {},
  });

  const showModalToSlice = function (
    f: File,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    modalContent: ModalContentType,
  ) {
    getBase64(f, (s: string) => {
      const canvas = canvasRef.current;
      if (canvas) {
        modalContent.img.src = s;
        modalContent.img.onload = () => {
          canvasDraw(modalContent, canvas);
        };
      }
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    } else if (e.target.files.length <= 0) {
      return;
    }
    let fileList = Array.from(e.target.files);
    fileList.forEach((f, i) => {
      const resetFn = (f: File) => {
        if (beforeUpload) {
          const p = beforeUpload(f, i);
          if (p instanceof Promise) {
            p.then((res: File) => {
              postData(
                res,
                resolveFilename(uploadFilename, i),
                axiosConfig!,
                i,
                onProgress,
                setFileList,
                successCallback,
                failCallback,
              );
            });
          } else if (p) {
            postData(
              f,
              resolveFilename(uploadFilename, i),
              axiosConfig!,
              i,
              onProgress,
              setFileList,
              successCallback,
              failCallback,
            );
          }
        } else {
          postData(
            f,
            resolveFilename(uploadFilename, i),
            axiosConfig!,
            i,
            onProgress,
            setFileList,
            successCallback,
            failCallback,
          );
        }
      };
      setResCallback({ resetFn });
      if (showSlice) {
        setModalOpen(true);
        showModalToSlice(f, canvasRef, modalContent);
      } else {
        resetFn(f);
      }
    });
  };
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setMouseActive(true);
    setStartXY({
      X: e.clientX - modalContent.left,
      Y: e.clientY - modalContent.top,
    });
  };
  const handleMouseUp = () => {
    setMouseActive(false);
  };
  const handleMouseLeave = () => {
    setMouseActive(false);
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (mouseActive) {
      let diffX = e.clientX - startXY.X;
      let diffY = e.clientY - startXY.Y;
      let newContent = { ...modalContent, left: diffX, top: diffY };
      setModalContent(newContent);
      canvasDraw(newContent, canvasRef.current!);
    }
  };
  const handleClick = () => {
    inputRef.current?.click();
  };

  const showSlice = useMemo(() => {
    if (!multiple && uploadMode === 'img' && slice) {
      return true;
    }
    return false;
  }, [multiple, uploadMode, slice]);
  const shouldShow = useMemo(() => {
    if (max !== undefined) {
      return fileList.length < max;
    }
    return true;
  }, [max, fileList]);
  const onRemove = useCallback(
    (file: ProgressBar) => {
      if (customRemove) {
        customRemove(file, setFileList);
      } else {
        setFileList((prev) => {
          return prev.filter((item) => {
            if (item.uid === file.uid && item.status === 'upload' && item.cancel) {
              item.cancel.cancel();
            }
            return item.uid !== file.uid;
          });
        });
      }
      onRemoveCallback?.(file);
    },
    [customRemove, onRemoveCallback],
  );
  const resolveBtnLoading = function (fileList: ProgressBar[]) {
    return fileList.some((v) => v.status === 'upload');
  };
  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        onChange={handleChange}
        style={{ display: 'none' }}
        value=""
        multiple={multiple}
        accept={accept}
      />
      {shouldShow && uploadMode === 'default' && (
        <span onClick={handleClick}>
          {customBtn || (
            <Button isLoading={resolveBtnLoading(fileList)} loadingText="上传中...">
              upload
            </Button>
          )}
        </span>
      )}
      {shouldShow && uploadMode === 'img' && (
        <ImgUpload onClick={handleClick}>
          <Icon icon="plus" />
        </ImgUpload>
      )}
      {uploadMode === 'default' && progress && (
        <UploadList fileList={fileList} onRemove={onRemove} />
      )}
      {uploadMode === 'img' && (
        <ImageUploadList fileList={fileList} setFileList={setFileList} onRemove={onRemove} />
      )}
      <Modal
        title="图片裁剪"
        maskClose={false}
        closeButton={false}
        visible={modalOpen}
        parentSetState={setModalOpen}
        callback={(v: boolean) => {
          if (v) {
            // 如果取消，不执行后续上传
            canvasRef.current!.toBlob((blob) => {
              resCallback?.resetFn?.(blob);
            });
          }
          setModalContent({ ...modalContent, rotate: 0, times: 1 });
        }}
      >
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <canvas
            style={{
              width: '100%',
              height: '100%',
              border: '1px dashed #ff4785',
            }}
            width="300"
            height="340"
            ref={canvasRef}
          >
            您的浏览器不支持Canvas
          </canvas>
        </div>
        <div>
          <Button
            style={btnStyle}
            appearance="primary"
            onClick={() => {
              let newContent = { ...modalContent, ...{ times: modalContent.times + 0.1 } };
              setModalContent(newContent);
              canvasDraw(newContent, canvasRef.current!);
            }}
          >
            <Icon icon="zoom" color={color.light}></Icon>
          </Button>
          <Button
            style={btnStyle}
            appearance="primary"
            onClick={() => {
              let newContent = { ...modalContent, ...{ times: modalContent.times - 0.1 } };
              setModalContent(newContent);
              canvasDraw(newContent, canvasRef.current!);
            }}
          >
            <Icon icon="zoomout" color={color.light}></Icon>
          </Button>
          <Button
            style={btnStyle}
            appearance="primary"
            onClick={() => {
              let newContent = { ...modalContent, ...{ rotate: modalContent.rotate - 0.1 } };
              setModalContent(newContent);
              canvasDraw(newContent, canvasRef.current!);
            }}
          >
            <Icon icon="undo" color={color.light}></Icon>
          </Button>
          <Button
            style={rotateBtnStyle}
            appearance="primary"
            onClick={() => {
              let newContent = { ...modalContent, ...{ rotate: modalContent.rotate + 0.1 } };
              setModalContent(newContent);
              canvasDraw(newContent, canvasRef.current!);
            }}
          >
            <Icon icon="undo" color={color.light}></Icon>
          </Button>
          <Button
            style={btnStyle}
            appearance="primary"
            onClick={() => {
              let newContent = { ...modalContent, rotate: 0, times: 1, left: 0, top: 0 };
              setModalContent(newContent);
              canvasDraw(newContent, canvasRef.current!);
            }}
          >
            <Icon icon="zoomreset" color={color.light}></Icon>
          </Button>
        </div>
      </Modal>
    </div>
  );
}
Upload.defaultProps = {
  axiosConfig: {},
  uploadMode: 'default',
  uploadFilename: 'avatar',
  successCallback: () => message.success('上传成功'),
  failCallback: () => message.error('上传失败'),
};
