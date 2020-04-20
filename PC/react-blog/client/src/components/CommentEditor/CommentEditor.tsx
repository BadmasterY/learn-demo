import React from 'react';
import { Form, Button, Input } from 'antd';
import { FormInstance } from 'antd/lib/form';

import './commenteditor.css';

interface Props {
    isSubmitting: boolean;
    onSubmit: (form: FormInstance) => void;
}

const { TextArea } = Input;

function CommentEditor(props: Props) {
    const { isSubmitting, onSubmit } = props;

    const [form] = Form.useForm();

    return (
        <Form
            className="comment-editor"
            form={form}
            hideRequiredMark={true}
        >
            <Form.Item
                name="commentContent"
                rules={[{ required: true, message: 'Please input comment!' }]}
            >
                <TextArea
                    rows={4}
                />
            </Form.Item>
            <Form.Item
                style={{
                    textAlign: 'right',
                }}
            >
                <Button
                    onClick={event => { onSubmit(form) }}
                    type="primary"
                    loading={isSubmitting}
                >Add Comment</Button>
            </Form.Item>
        </Form>
    );
}

export default CommentEditor;