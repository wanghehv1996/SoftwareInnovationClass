import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Card } from 'antd';

const { Meta } = Card;

export default class People extends Component{
    render(){
        return(
            <Card
                hoverable
                style={{ width: 140 }}
                cover={<img alt="Yang Xubo" src="http://www.se.sjtu.edu.cn/upload/201611/07/201611072032216063.jpg" />}
            >
                <Meta title="Professor" description="Yang Xubo" />
            </Card>
        )
    }
}
    