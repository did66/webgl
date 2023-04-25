import { React, useState, useRef, useEffect } from "react";
import bg from "../../assets/blueBg.jpg";
import NButton from "../NButton/NButton";
import { SafetyCertificateOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { message, Input } from 'antd';
import { jumpToLoginPage, jumpToModelPage, backServer } from "../../utils/linkUtil";
import './SignUp.css'
import CryptoJS from 'crypto-js';
export default function SignUp(props) {

    const [messageApi, contextHolder] = message.useMessage();
    const key = CryptoJS.enc.Hex.parse('00112233445566778899aabbccddeeff');
    const iv = CryptoJS.enc.Hex.parse('0102030405060708');
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

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [time, setTime] = useState(0)
    const timer = useRef(null)
    useEffect(() => {
        timer.current && clearInterval(timer.current);
        return () => timer.current && clearInterval(timer.current);
    }, []);

    useEffect(() => {
        if (time === 60) timer.current = setInterval(() => setTime(time => --time), 1000)
        else if (time === 0) timer.current && clearInterval(timer.current)
    }, [time])

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
                        content: '验证码发送成功',
                    });
                    setTime(60);
                } else {
                    messageApi.open({
                        type: 'error',
                        content: '验证码发送失败 ',
                    });
                }
            });
    }

    let registerSubmit = function () {
        let formData = new FormData();
        formData.append('email', email);
        formData.append('password', CryptoJS.AES.encrypt(password, key, { iv: iv }).toString());
        formData.append('valid_code', code);

        const requestOptions = {
            method: 'POST',
            body: formData,
        };
        fetch("http://10.15.88.38:5008/api/v1/checkvalid", requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data['code'] == 200) {
                    messageApi.open({
                        type: 'success',
                        content: '注册成功',
                    });
                    // 存储token
                    console.log("注册成功");
                    // jumpToLoginPage()
                    // localStorage.setItem('token', data['data']['token']);
                    
                    setInterval(
                        () => { jumpToLoginPage() },
                        1200
                    )
                } else if (data['code'] == 500) {
                    if(data['message'] == "wrong code") {
                        messageApi.open({
                            type: 'error',
                            content: '验证码错误',
                        });
                    }
                    else if(data['message'] == "activate fail") {
                        messageApi.open({
                            type: 'error',
                            content: '注册失败',
                        });
                    }
                } else {
                    messageApi.open({
                        type: 'error',
                        content: '注册失败',
                    });
                }
            });
    }

    let sendCodeButtonText = "Send";
    if (time != 0) {
        sendCodeButtonText = "Resend(" + time + ")"
    }
    let prefixIcon = "SendOutlined"
    if (time != 0) {
        prefixIcon = ""
    }

    return (
        <div className="signUpMain" style={mainBgStyle}>
            {contextHolder}
            {/* <div className="signUpMain--backArrow">
                <ArrowLeftOutlined />
            </div> */}

            <div className="signUpMain--signUpForm">
                <div className="signUpMain--signUpForm_signUpHint">
                    <span className="signUpMain--signUpForm_signUpHint_title">注册</span>
                    <p className="signUpMain--signUpForm_signUpHint_detail">欢迎！注册成功后，你可以体验Neudim的各种功能。</p>
                    {/* <p className="signUpMain--signUpForm_signUpHint_detail">A verification code will be sent to your email after you click the send button.</p> */}
                </div>
                <div className="signUpMain--signUpForm_email">
                    <Input value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="电子邮箱" prefix={<MailOutlined className="signUpMain--signUpForm_inputPrefix" />} />
                </div>
                <div className="signUpMain--signUpForm_password">
                    <Input.Password value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} placeholder="密码" prefix={<LockOutlined className="signUpMain--signUpForm_inputPrefix" />} />
                </div>
                <div className="signUpMain--signUpForm_verifyCode">
                    <Input value={code} onChange={e => setCode(e.target.value)} style={verifyInputStyle} placeholder="验证码" prefix={<SafetyCertificateOutlined className="signUpMain--signUpForm_inputPrefix" />} />
                    <NButton disabled={time > 0} onClick={() => sendCodeFunc()} prefixIcon={prefixIcon} buttonText="获取验证码" addStyles={{ 'height': '100%', 'margin-top': '0%', 'width': '30%', 'borderRadius': '2.2rem', 'fontSize': '1.25rem', 'fontWeight': '400' }}></NButton>
                </div>
                <div className="signUpMain--signUpForm_submit">
                    <NButton onClick={() => registerSubmit()} buttonText="注册" addStyles={{ 'height': '5.5vh', 'borderRadius': '2.2rem', 'fontSize': '1.5rem', 'fontWeight': '500' }}></NButton>
                </div>
                <div className="signUpMain--signUpForm_login">
                    <span onClick={() => jumpToLoginPage()}><u>登录</u></span>
                </div>
            </div>
        </div>
    )
}