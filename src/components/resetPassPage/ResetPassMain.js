import { React, useState } from "react";
import bg from "../../assets/blueBg.jpg";
import NButton from "../NButton/NButton";
import { SafetyCertificateOutlined, MailOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { jumpToLoginPage, backServer } from "../../utils/linkUtil";
import { Input, message } from 'antd';
import './ResetPassMain.css'

export default function ResetPassMain(props) {

    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [time, setTime] = useState(0);
    const [messageApi, contextHolder] = message.useMessage();

    let mainBgStyle = {
        'backgroundImage': `url(${bg})`,
        'backgroundSize': 'cover'
    };

    let inputStyle = {
        'width': '100%',
        'heigth': '70%',
        'fontSize': '1.55rem'
    }

    let verifyInputStyle = {
        'width': '67%',
        'heigth': '70%',
        'fontSize': '1.55rem',
        'marginRight': '3%'
    }

    let sendCodeFunc = function () {
        let formData = new FormData();
        formData.append('email', email);

        const requestOptions = {
            method: 'POST',
            body: formData,
        };
        fetch("http://10.15.88.38:5008/api/v1/sendemail", requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data['code'] == 200) {
                    messageApi.open({
                        type: 'success',
                        content: 'send validation code success',
                    });
                    setTime(60);
                } else {
                    messageApi.open({
                        type: 'error',
                        content: '发送验证码失败！请输入正确的邮箱',
                    });
                }
            });
    }

    let resetPassFunc = function() {
        let formData = new FormData();
        formData.append('email', email); 
        formData.append('validate_code', code); 
        formData.append('new_password', newPassword); 

        const requestOptions = {
            method: 'POST',
            body: formData,
        };
        fetch("http://10.15.88.38:5008/api/v1/resetpassword", requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data['code'] == 200) {
                    messageApi.open({
                        type: 'success',
                        content: '重置密码成功',
                      });
                      setInterval(
                        () => { jumpToLoginPage() }, 1200
                      )
                } 
                else if(data['code'] == 500) {
                    if(data['message'] == "same password") {
                        messageApi.open({
                            type: 'error',
                            content: "重置密码失败！新密码与旧密码相同，请重新设置密码",
                          }); 
                    }
                    else if(data['message'] == "wrong code") {
                        messageApi.open({
                            type: 'error',
                            content: "重置密码失败！验证码错误，请重新输入验证码",
                          }); 
                    }
                    else if(data['message'] == "reset fail") {
                        messageApi.open({
                            type: 'error',
                            content: "重置密码失败！",
                          }); 
                    }
                }
                else {
                    messageApi.open({
                        type: 'error',
                        content: "重置密码失败！",
                      });
                }
            });
    }

    return (
        <div className="resetPassMain" style={mainBgStyle}>
            {contextHolder}
            {/* <div className="resetPassMain--backArrow">
                <ArrowLeftOutlined />
            </div> */}

            <div className="resetPassMain--signUpForm">
                <div className="resetPassMain--signUpForm_signUpHint">
                    <span className="resetPassMain--signUpForm_signUpHint_title">设置新密码</span>
                    <p className="resetPassMain--signUpForm_signUpHint_detail">请在此处设置您的新密码，并填写发送到您电子邮箱的验证码进行提交。</p>
                </div>
                <div className="resetPassMain--signUpForm_email">
                    <Input value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="电子邮箱" prefix={<MailOutlined className="resetPassMain--signUpForm_inputPrefix" />} />
                </div>
                <div className="resetPassMain--signUpForm_password">
                    <Input.Password value={newPassword} onChange={e => setNewPassword(e.target.value)}  style={inputStyle} placeholder="新密码" prefix={<LockOutlined className="resetPassMain--signUpForm_inputPrefix" />} />
                </div>
                <div className="resetPassMain--signUpForm_verifyCode">
                    <Input value={code} onChange={e => setCode(e.target.value)} style={verifyInputStyle} placeholder="验证码" prefix={<SafetyCertificateOutlined className="resetPassMain--signUpForm_inputPrefix" />} />
                    <NButton onClick={() => sendCodeFunc()} prefixIcon="SendOutlined" buttonText="获取验证码" addStyles={{ 'height': '100%', 'width': '30%', 'borderRadius': '2.2rem', 'fontSize': '1.3rem', 'fontWeight': '400' }}></NButton>
                </div>
                <div className="resetPassMain--signUpForm_submit">
                    <NButton onClick={() => resetPassFunc()} buttonText="重置密码" addStyles={{ 'height': '4.5vh', 'borderRadius': '2.2rem', 'fontSize': '1.5rem', 'fontWeight': '500' }}></NButton>
                </div>
                <div className="resetPassMain--signUpForm_login">
                    <span onClick={() => jumpToLoginPage()}><u>登录</u></span>
                </div>
            </div>
        </div>
    )
}