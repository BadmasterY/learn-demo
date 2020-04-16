import React, { useState, useEffect } from 'react';
import { Drawer, Button, Form, Input, Modal, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import BraftEditor, { ControlType } from 'braft-editor';
import localforage from 'localforage';
import axios from 'axios';

import { reduxState } from '../../interfaces/state';
import { Response } from '../../interfaces/response';

import 'braft-editor/dist/index.css'
import './publish.css';

const { confirm } = Modal;
const controls: ControlType[] = [
    'font-size', 'separator',
    'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
    'superscript', 'subscript', 'separator',
    'link', 'separator',
    'headings', 'separator',
    'list-ul', 'list-ol', 'separator',
    'blockquote', 'code', 'separator',
    'media',
];

/**
 * get the local data
 */
async function getLocal(id: string) {
    let localContent = '<p></p>', localTitle = '';
    await localforage
        .getItem(`articleContent_${id}`)
        .then(value => {
            if (value !== null) {
                localContent = (value as string);
            }
        }).catch(err => console.log(err));

    await localforage
        .getItem(`articleTitle_${id}`)
        .then(value => {
            if (value !== null) {
                localTitle = (value as string);
            }
        }).catch(err => console.log(err));

    if (localContent === '<p></p>' && localTitle === '') return null;

    return {
        title: localTitle,
        content: BraftEditor.createEditorState(localContent),
    };
}

async function clearLocal(id: string) {
    await localforage.removeItem(`articleTitle_${id}`).then(() => {
        console.log('Cleared...');
    }).catch(err => console.log(err));
    await localforage.removeItem(`articleContent_${id}`).then(() => {
        console.log('Cleared...');
    }).catch(err => console.log(err));
}

function Publish(props: { visible: boolean, callback?: Function }) {
    const { callback, visible } = props;

    const { id } = useSelector((item: reduxState) => item.user);
    const [isPublish, setPublish] = useState(false);
    const [form] = Form.useForm();

    function initialForm() {
        form.setFieldsValue({
            title: '',
            content: BraftEditor.createEditorState('<p></p>'),
        });
    }

    function initialData() {
        initialForm();

        getLocal(id).then(result => {
            if (result !== null) {
                confirm({
                    title: 'Do you want to recover?',
                    icon: <QuestionCircleOutlined />,
                    content: 'You have some uncommitted content. Do you need to restore it?',
                    okText: 'Yes',
                    okType: 'primary',
                    cancelText: 'No',
                    onOk: () => { form.setFieldsValue(result) },
                    onCancel: () => {
                        clearLocal(id);
                    },
                });
            }
        }).catch(err => console.log(err));
    }

    function titleChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (visible) localforage.setItem(`articleTitle_${id}`, event.target.value);
    }

    function contentChange(editorState: any) {
        if (visible) localforage.setItem(`articleContent_${id}`, editorState.toHTML());
        console.log(editorState.toRAW(true));
    }

    async function publishArticle() {
        setPublish(true);
        await form.validateFields().then(async result => {
            const { title, content } = result;
            const contentString = content.toHTML();

            await axios.post('/article/publish', {
                authorId: id,
                title,
                content: contentString,
            }).then(result => {
                const data: Response = result.data;
                const { error, msg } = data;

                setPublish(false);

                if (error === 1) {
                    message.error(msg);
                    return;
                }

                message.success('Published!');
                if (callback) callback();
                initialForm();
                clearLocal(id);
            }).catch(err => {
                setPublish(false);
                message.error('Please check network!');
                console.log(err);
            })
        }).catch(err => {
            setPublish(false);
            message.error('Please check input!');
            console.log(err);
        });
    }

    useEffect(() => {
        if (visible) initialData();
    }, [visible]);

    return (
        <Drawer
            className="publish"
            visible={visible}
            placement="bottom"
            height="100%"
            closable={false}
            forceRender={true}
            onClose={() => {
                if (callback) callback();
            }}
            bodyStyle={{
                overflowX: 'hidden',
                overflowY: 'auto',
            }}
            footer={
                <div style={{
                    textAlign: 'right'
                }}>
                    <Button
                        style={{
                            marginRight: '8px',
                        }}
                        onClick={() => {
                            if (callback) callback();
                        }}
                    >Cancel</Button>
                    <Button loading={isPublish} type="primary" onClick={publishArticle}>Submit</Button>
                </div>
            }
        >
            <Form
                form={form}
                hideRequiredMark={true}
            >
                <Form.Item
                    name="title"
                    rules={[{ required: true, message: 'Please input title!' }]}
                >
                    <Input placeholder="Please input title..." onChange={titleChange} />
                </Form.Item>
                <Form.Item
                    name="content"
                    rules={[{
                        required: true,
                        message: 'Please input content!',
                        validator: (rule, value) => {
                            const checkValue = value.toHTML();
                            if (checkValue === '<p></p>') {
                                return Promise.reject('');
                            } else {
                                return Promise.resolve();
                            }
                        }
                    }]}
                >
                    <BraftEditor
                        controls={controls}
                        onChange={contentChange}
                        placeholder="Please input content..."
                    />
                </Form.Item>
            </Form>
        </Drawer>
    );
}

export default Publish;