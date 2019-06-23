import React from 'react';
import { Row, Col, Button } from 'antd';

function Footer() {
  return (
    <footer id="footer" className="dark">
      <Row className="bottom-bar">
        <Col lg={6} sm={24}>
          <div className="translate-button">
            <Button ghost size="small" >
              English
            </Button>
          </div>
        </Col>
        <Col lg={18} sm={24}>
          <span
            style={{
              lineHeight: '16px',
              paddingRight: 12,
              marginRight: 11,
              borderRight: '1px solid rgba(255, 255, 255, 0.55)',
            }}
          >
            <a
              href="https://www.sjtu.edu.cn/"
              rel="noopener noreferrer"
              target="_blank"
            >
              上海交通大学官网
            </a>
          </span>
          <span style={{ marginRight: 24 }}>
            <a
              href="http://www.se.sjtu.edu.cn/"
              rel="noopener noreferrer"
              target="_blank"
            >
              上海交通大学软件学院官网
            </a>
          </span>
        </Col>
      </Row>
    </footer>
  );
}


export default Footer;
