import * as React from "react";
import { connect } from 'dva';
import * as faceapi from 'face-api.js';
import {Modal, Alert} from 'antd';
import {Loading} from './../../components/index';
import angry from './images/angry.jpg';
import disgusted from './images/disgusted.jpg';
import fearful from './images/fearful.jpg';
import happy from './images/happy.jpg';
import neutral from './images/neutral.jpg';
import sad from './images/sad.jpg';
import surprised from './images/surprised.jpg';
import daXX from './images/daXX.jpg';
import daXX2 from './images/daXX2.jpg';
import bbt1 from './images/bbt1.jpg';
import bbt2 from './images/bbt2.jpg';
import bbt3 from './images/bbt3.jpg';
import bbt4 from './images/bbt4.jpg';
import bbt5 from './images/bbt5.jpg';

const IMG = [daXX,daXX2,surprised, angry, disgusted,fearful,happy,neutral,sad,bbt1, bbt2, bbt3, bbt4, bbt5];

interface Props {
    dispatch?: any,
}

@connect((state) => ({
}))
class FaceDemo extends React.PureComponent<Props, any> {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            text: '模块加载中'
        }
        this.loadModels();
    }

    componentDidMount = () => {
        document.title = "faceDemo";
    }

    loadModels = async () => {
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        this.setState({
            loading: false,
            text: ''
        });
    }

    pre_detectSingleFace = () => {
        this.setState({
            loading: true,
            text: '人脸识别中'
        });
        setTimeout(()=> {
            this._detectSingleFace();
        }, 1);
    }

    _detectSingleFace = async () => {
        const input: any = document.getElementById('myImg');
        const detection = await faceapi.detectSingleFace(input);
        // const detections1 = await faceapi.detectAllFaces(input);
        // const fullFaceDescriptions = await faceapi.allFaces(input, 0.8);
        // console.log('detectSingleFace', detection);
        // console.log('detectAllFaces', detections1);
        // console.log('fullFaceDescriptions', fullFaceDescriptions);

        this.setState({
            loading: false,
            text: ''
        });
        if (detection) {
            Modal.success({title: '人脸识别成功！'});
        } else {
            Modal.error({title: '未识别人脸！'});
        }
    }

    inputFileChange = (e) => {
        let that = this;
        let file = e.target.files[0];  
        let myImg: any = document.getElementById("myImg");
        if(window.FileReader) {  
            let fr = new FileReader();  
            fr.onloadend = function(e) {  
                myImg.src = e.target.result;  
                that.pre_detectSingleFace();
            };  
            fr.readAsDataURL(file);  //也是利用将图片作为url读出
        } 
    }

    choseImg = (img) => {
        let myImg: any = document.getElementById("myImg");
        myImg.src = img;
        window.scrollTo(0,0); //回到顶部
        this.pre_detectSingleFace();
    }

	render() {
		return (
            <div style={{textAlign: 'center'}}>
                <img id="myImg" src={angry} style={{width: '100%'}} />
                <Alert message="温馨提示：光线充足识别率更高哦！" type="warning" />
                <input type="file"
                 onChange={this.inputFileChange}
                  style={{padding: '20px 0'}}
                  accept="image/*"
                  capture="user"></input>
                <ul>
                    <li>选择下面图片试试：</li>
                    {IMG.map((img, index) => (
                        <li onClick={() => this.choseImg(img)}
                        key={index}
                         style={{float: 'left', width: '50%', padding: '10px'}}>
                            <img src={img} style={{width: '100%'}} />
                        </li>
                    ))}
                </ul>
                {this.state.loading && <Loading text={this.state.text} />}
            </div>
        )
	}
}

export default FaceDemo;
