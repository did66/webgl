import { React, useState } from "react";
import bg from "../../assets/blueBg.jpg";
import NButton from "../NButton/NButton";
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { jumpToSignUpPage, jumpToForgetPassPage, jumpToModelPage, backServer } from "../../utils/linkUtil";
import { Input, message } from 'antd';
import './Login.css'
import User from "../../objs/User"
import CryptoJS from 'crypto-js';
 
export default function Login(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // vrlab123
    const key = CryptoJS.enc.Hex.parse('00112233445566778899aabbccddeeff');
    const iv = CryptoJS.enc.Hex.parse('0102030405060708');
    const [messageApi, contextHolder] = message.useMessage();
    
    const [getUser,setUser] = useState('')
    let mainBgStyle = {
        'backgroundImage': `url(${bg})`,
        'backgroundSize': 'cover'
    };

    let inputStyle = {
        'width': '100%',
        'heigth': '70%',
        'fontSize': '1.55rem',
        // "l7JvjBGFENxjfIySqVjb5g==":
        // "l7JvjBGFENxjfIySqVjb5g=="
    }

    function setUserObj(userObj){
        return new User(
        userObj["avatar"],
        userObj["email"],
        userObj["role"],
        userObj["token"],
        userObj["user_id"],
        userObj["username"]
        );
    }

    let loginSubmit = function() {
        let formData = new FormData();
        var myHeaders = new Headers();
        myHeaders.append("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36");
        myHeaders.append("Accept", "*/*");
        formData.append('email', email); 
        formData.append('password', CryptoJS.AES.encrypt(password, key, { iv: iv }).toString()); 

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formData,
        };
        fetch("http://10.15.88.38:5008/api/v1/login", requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data['code'] == 200) {
                    messageApi.open({
                        type: 'success',
                        content: '登录成功',
                      });
                    // 存储token
                    const loginUser = setUserObj(data['data'])
                    console.log(data['data']);
                    console.log(loginUser);
                    // return
                    localStorage.setItem('token', data['data']['token'])
                    sessionStorage.setItem('user',loginUser.email)
                    sessionStorage.setItem('user_id',loginUser.user_id)
                    setInterval(
                        () => { jumpToModelPage() },
                        1200
                    )
                } else {
                    messageApi.open({
                        type: 'error',
                        content: "登录失败 用户名或密码错误，请重新输入",
                      });
                }
            });
    }

    return (
        <div className="loginMain" style={mainBgStyle}>
            {/* <div className="loginMain--backArrow">
                <ArrowLeftOutlined />
            </div> */}
            {contextHolder}

            <div className="loginMain--loginForm">
                <div className="loginMain--loginForm_signUpHint">
                    <span className="loginMain--loginForm_signUpHint_title">登录</span>
                    <p className="loginMain--loginForm_signUpHint_detail">欢迎回到NeuDim!</p>
                </div>
                <div className="loginMain--loginForm_email">
                    <Input value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="电子邮箱" prefix={<MailOutlined className="loginMain--loginForm_inputPrefix" />} />
                </div>
                <div className="loginMain--loginForm_password">
                    <Input.Password value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} placeholder="密码" prefix={<LockOutlined className="loginMain--loginForm_inputPrefix" />} />
                </div>
                <div className="loginMain--loginForm_submit">
                    <NButton onClick={() => loginSubmit()} buttonText="登录" addStyles={{ 'height': '5.5vh', 'borderRadius': '2.2rem', 'fontSize': '1.5rem', 'fontWeight': '500' }}></NButton>
                </div>
                <div className="loginMain--loginForm_signUp_forgetPass">
                    <span className="loginMain--loginForm_signUp_link" onClick={() => jumpToSignUpPage()}><u>注册</u></span>
                    <span className="loginMain--loginForm_forgetPass_link" onClick={() => jumpToForgetPassPage()}><u>忘记密码?</u></span>
                </div>
            </div>
        </div>
    )
}