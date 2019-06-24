import React from 'react';
import { OverPack } from 'rc-scroll-anim';
import QueueAnim from 'rc-queue-anim';

function About() {
  return (
    <div className="home-page page2">
      <div className="home-page-wrapper">
        <div className="title-line-wrapper page2-line">
          <div className="title-line" />
        </div>
        <h2>Welcome to <span>DA Lab</span></h2>
        <OverPack>
          <QueueAnim key="queue" type="bottom" leaveReverse className="page2-content">
            <p key="p" className="page-content">
              Digital ART Laboratory of Shanghai Jiao Tong University
            </p>
            <div key="code1" className="home-code">
              <div>
                Digital ART(Augmented Reality Tech) Laboratory was established in 2003 as a novel bridge between computer science and media art. Our mission is to invent and develop novel computing technologies for future media and art applications that may have great impact on our life.We focus on developing media and art related technologies involving computer graphics, computer vision, image processing, augmented/virtual reality and human computer interaction. Our main interested applications cover movie, animation, game, education and art installations.
              </div>
            </div>
            <p key="p2" className="page-content">
              想要加入? People页面有导师联系方式
            </p>
          </QueueAnim>
        </OverPack>
      </div>
    </div>
  );
}

export default About;
