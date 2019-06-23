import React from 'react';
import { Row, Col, Icon, Menu, Button, Popover } from 'antd';
import { enquireScreen } from 'enquire-js';
import logo from './../logo.svg';
import {Link} from "react-router-dom";

class Header extends React.Component {
  state = {
    menuVisible: false,
    menuMode: 'horizontal',
  };

  componentDidMount() {
    enquireScreen((b) => {
      this.setState({ menuMode: b ? 'inline' : 'horizontal' });
    });
  }

  render() {
    const { menuMode, menuVisible } = this.state;

    const menu = (
      <Menu mode={menuMode} id="nav" key="nav">
        <Menu.Item key="home">
          <Link
            href={this.props.dataSource.menu.children[0].a.href}
            to={this.props.dataSource.menu.children[0].a.href}>
            Home
          </Link>
        </Menu.Item>
        <Menu.Item key="about">
          <Link
            href={this.props.dataSource.menu.children[1].a.href}
            to={this.props.dataSource.menu.children[1].a.href}>
              About
          </Link>
        </Menu.Item>
        <Menu.Item key="people">
          <Link
            href={this.props.dataSource.menu.children[2].a.href}
            to={this.props.dataSource.menu.children[2].a.href}>
            People
          </Link>
        </Menu.Item>
        <Menu.Item key="pubs">
          <Link
            href={this.props.dataSource.menu.children[3].a.href}
            to={this.props.dataSource.menu.children[3].a.href}>
            Publications
          </Link>
        </Menu.Item>
        <Menu.Item key="news">
          <Link
            href={this.props.dataSource.menu.children[4].a.href}
            to={this.props.dataSource.menu.children[4].a.href}>
            News
          </Link>
        </Menu.Item>
      </Menu>
    );

    return (
      <div id="header" className="header">
        {menuMode === 'inline' ? (
          <Popover
            overlayClassName="popover-menu"
            placement="bottomRight"
            content={menu}
            trigger="click"
            visible={menuVisible}
            arrowPointAtCenter
            onVisibleChange={this.onMenuVisibleChange}
          >
            <Icon
              className="nav-phone-icon"
              type="menu"
              onClick={this.handleShowMenu}
            />
          </Popover>
        ) : null}
        <Row>
          <Col xxl={4} xl={5} lg={8} md={8} sm={24} xs={24}>
            <div id="logo" to="/">
              <img src={logo} alt="logo" />
              <span>Digital ART Laboratory</span>
            </div>
          </Col>
          <Col xxl={20} xl={19} lg={16} md={16} sm={0} xs={0}>
            <div className="header-meta">
              {menuMode === 'horizontal' ? <div id="menu">{menu}</div> : null}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Header;
