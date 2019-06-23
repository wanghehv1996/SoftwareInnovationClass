import React,{Component} from 'react';
import { List,Avatar } from 'antd';
const axios = require('axios');
import './people.css'

const serverRoot = "";

const data = [
    {
        name: "Yang Xubo",
        title: "Professor",
        avatarURL: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
        email:"yangxubo@sjtu.edu.cn"
    },
    {
        name: "Yang Xubo",
        title: "Professor",
        avatarURL: ""
    },
    {
        name: "Yang Xubo",
        title: "Professor",
        avatarURL: ""
    },
    {
        name: "Yang Xubo",
        title: "Professor",
        avatarURL: ""
    },
    {
        name: "Yang Xubo",
        title: "Professor",
        avatarURL: ""
    },
    {
        name: "Yang Xubo",
        title: "Professor",
        avatarURL: ""
    }
]
const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';

export default class People extends Component{
    // state = {
    //     data: [],
    // };

    // componentDidMount() {
    //     this.fetchData(res => {
    //         this.setState({
    //             data: res.results,
    //         });
    //     });
    // }

    // fetchData = callback => {
    //    axios.get(fakeDataUrl).then(function (response) {
    //         console.log(response);
    //     }).catch(function (error) {
    //         console.log(error);
    //     });
    // };
    
    render(){
        return(
            <div id="card" className="Container">
                <List
                    grid={{
                        gutter: 100,
                        xs: 1,
                        sm: 2,
                        md: 2,
                        lg: 4,
                        xl: 4,
                        xxl: 6,
                    }}
                    dataSource={data}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <Avatar src={item.avatarURL} />
                                }
                                title={<a href={"Mailto:zouyue1024@163.com"}>{item.name}</a>}
                                description={item.title}
                            />
                        </List.Item>
                    )}
                />
            </div>

        )
    }
}
    