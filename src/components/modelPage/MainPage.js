import { Layout, Space } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
const headerStyle = {
  textAlign: 'center',
  color: 'black',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#fff',
};
const contentStyle = {
  textAlign: 'center',
  minHeight:"120px",
  lineHeight: '120px',
  color: 'black',
  backgroundColor: '#fff',
};
const siderStyle = {
  textAlign: 'center',
  lineHeight: '120px',
  color: 'black',
  backgroundColor: '#fff',
};
const footerStyle = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: "#fff",
};
const layoutStyle = {
  backgroundColor: "rgb(242,242,242)",
}
const MainPage = () => (
  <Space
    direction="vertical"
    style={{
      width: '100%',
    }}
    size={[0, 48]}
  >
    
    <Layout style={layoutStyle} >
      <Header style={headerStyle}>
        
        Header
      </Header>
      <Layout>
        <Sider style={siderStyle}>Sider</Sider>
        <Content style={contentStyle}>Content</Content>
      </Layout>
      <Footer style={footerStyle}>Footer</Footer>
    </Layout>
    
  </Space>
);
export default MainPage;