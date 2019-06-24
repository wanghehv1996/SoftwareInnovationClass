
import React, {Component} from 'react';
import 'antd/dist/antd.css';
import { Card , List} from 'antd';

const data_17= [
        'Jieyu Chu, Nafees Bin Zafar, Xubo Yang. A Schur Complement Preconditioner for Scalable Parallel Fluid Simulation. ACM Transactions on Graphics, Volume 36 Issue 5, July 2017 (Presented at Siggraph 2017).',
        'Lele Feng, Xubo Yang, Shuangjiu Xiao. MagicToon: A 2D-to-3D Creative Cartoon Modeling System with Mobile AR. Proceedings of the IEEE Virtual Reality, March 17-22, Los Angeles, USA, 2017.',
        'Xiangyun Xiao*, Shuai Zhang*, Xubo Yang. Real-time high-quality surface rendering for large scale particle-based fluids. In Proceedings of the 21st ACM SIGGRAPH Symposium on Interactive 3D Graphics and Games, ACM, 2017. (*equally contributed authors)',
    ];
const data_16 = [
    'Lihui Tian, Shuangjiu Xiao. Facial Feature Exaggeration According to Social Psychology of Face Perception. Pacific Graphics, Oct 11-14, Japan, 2016.',
    'Yi Zhou, Shuangjiu Xiao, Ning Tang, Zhiyong Wei, Xu Chen. Pmomo: Projection Mapping on Movable 3D Object.  Proceedings of the ACM SIGCHI Conference on Human Factors in Computing Systems, 2016.',
    'Yang Yang, Xubo Yang, Shuangcai Yang. A Fast Iterated Orthogonal Projection Framework for Smoke Simulation. In IEEE Transactions on Visualization and Computer Graphics, 2016;22(5):1492-1502.',
    'Cheng Yang, Xubo Yang, Xiangyun Xiao. Data-driven Projection Method in Fluid Simulation. Computer Animation and Virtual Worlds 27.3-4 (2016): 415-424. (Special Issue of the 29th International Conference on Computer Animation and Social Agents, CASA 2016).'
];
const data_15 = [
    'Shuai Zhang, Xubo Yang, Ziqi Wu, Haibo Liu. Position-based Fluid control.  ACM SIGGRAPH Symposium on Interactive 3D Graphics and Games(i3D) 2015 (San Francisco, USA, Feb 27-Mar 1, 2015). ',
    'Ning Tang, ShuangJiu Xiao. “Real-time human vision rendering using blur distribution function.” In Proceedings of the 14th ACM SIGGRAPH International Conference on Virtual Reality Continuum and its Applications in Industry,  ACM, 2015.',
    'Fan, Jiaqi, and Shuangjiu Xiao. “The study of real-time animation of forest scene in wind projection.” In Proceedings of the 14th ACM SIGGRAPH International Conference on Virtual Reality Continuum and its Applications in Industry, ACM, 2015.'
];
export default class Pubs extends Component{
    render(){
        return(
            <div style={{
                    fontSize: 14,
                    color: 'rgba(0, 0, 0, 0.85)',
                    margin:64,
                    fontWeight: 400,
                    paddingBottom: 100
                    }}>
                <Card type="inner" title="2017">
                    <List
                        size="large"
                        bordered={false}
                        dataSource={data_17}
                        renderItem={item => <List.Item>{item}</List.Item>}
                    />
                </Card>
                <Card
                    style={{ marginTop: 16 }}
                    type="inner"
                    title="2016"
                >
                    <List
                        size="large"
                        bordered={false}
                        dataSource={data_16}
                        renderItem={item => <List.Item>{item}</List.Item>}
                    />
                </Card>
                <Card
                    style={{ marginTop: 16 }}
                    type="inner"
                    title="2015"
                >
                    <List
                        size="large"
                        bordered={false}
                        dataSource={data_15}
                        renderItem={item => <List.Item>{item}</List.Item>}
                    />
                </Card>
            </div>

        )
    }
}
