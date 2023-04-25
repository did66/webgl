import React from "react";
import './NButton.css'
import { SendOutlined, CloudUploadOutlined } from '@ant-design/icons';

export default function NButton(props) {

    let buttonText = props.buttonText;
    let addStyles = props.addStyles;
    if (addStyles === undefined) {
        addStyles = {};
    }

    let disabled = props.disabled;
    if (disabled === undefined) {
        disabled = false
    }
    if (disabled) {
        addStyles['backgroundColor'] = '#808080'
    }

    let onClick = props.onClick;
    if (onClick === undefined) {
        onClick = () => { };
    }

    let prefixIcon = props.prefixIcon;
    if (prefixIcon === undefined) {
        prefixIcon = '';
    }

    let suffixIcon = props.suffixIcon;
    if (suffixIcon === undefined) {
        suffixIcon = '';
    }

    return (
        <div className="NButton" style={addStyles} onClick={() => {if (!disabled) onClick()}}>
            {
                (suffixIcon === 'CloudUploadOutlined') && <CloudUploadOutlined className="NButton--suffixIcon"/>
            }
            <span className="NButton--text">{buttonText}</span>
            {
                (prefixIcon === 'SendOutlined') && <SendOutlined className="NButton--prefixIcon"/>
            }
        </div>
    )
}