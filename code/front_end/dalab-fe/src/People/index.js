import React,{Component} from 'react';
import { List,Avatar } from 'antd';
import './people.css'
const serverRoot = "http://dalab.se.sjtu.edu.cn:78/";
const fakeDataUrl = serverRoot + "people.json";
// const data = [
//     {
//         name: "Yang Xubo",
//         title: "Professor",
//         avatarURL: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
//         email:"yangxubo@sjtu.edu.cn"
//     },
//     {
//         name: "Yang Xubo",
//         title: "Professor",
//         avatarURL: ""
//     },
//     {
//         name: "Yang Xubo",
//         title: "Professor",
//         avatarURL: ""
//     },
//     {
//         name: "Yang Xubo",
//         title: "Professor",
//         avatarURL: ""
//     },
//     {
//         name: "Yang Xubo",
//         title: "Professor",
//         avatarURL: ""
//     },
//     {
//         name: "Yang Xubo",
//         title: "Professor",
//         avatarURL: ""
//     }
// ]


export default class People extends Component{
    constructor(props) {
        super(props);
        this.state = {data: undefined};
    }

    componentDidMount() {
        const that = this;
        fetch(new Request(fakeDataUrl, {
                mode: 'cors'
            }))
            .then(function (response) {
                // Convert to JSON
                return response.json();
            }).then(function (j) {
                that.setState({
                    data:j
                })
            }).catch(function (error) {
                console.log('Request failed', error)
            });
    }

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
                    dataSource={this.state.data}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <Avatar src={serverRoot+"img/"+ item.avatarURL} />
                                }
                                title={<a href={"Mailto:"+item.email}>{item.name}</a>}
                                description={item.title}
                            />
                        </List.Item>
                    )}
                />
            </div>

        )
    }
}
    