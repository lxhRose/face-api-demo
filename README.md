# face-api-demo
只需两条命令启动项目：
1、npm install
2、npm start

开发步骤：
导入脚本

首先，从 dist/face-api.js 获得最新的版本（github.com/justadudewh…），或者从 dist/face-api.min.js 获得缩减版，并且导入脚本：
<script src="face-api.js"></script>
如果你使用 npm 包管理工具，可以输入如下指令：
npm i face-api.js

加载模型数据
假如你将它们放在 public/models 文件夹下：
loadModels = async () => {

    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    this.setState({
        loading: false,
        text: ''
    });
}

html:
< img id="myImg" src="xxx" />

js:
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
          Modal.success({title: '图中有人脸！'});
      } else {
          Modal.error({title: '图中没有人脸！'});
      }
  }



const detections = await faceapi.detectAllFaces(input) // 检测图中所有人脸，返回一个数组，如果没有人脸返回空数组；

const detection = await faceapi.detectSingleFace(input) // 检测图中单张人脸，返回人脸数据，没有人脸返回undefined

注意：无论是加载模块还是后面调用API，都是在异步函数中使用await 同步函数，否则不成功；加载模块非常慢，建议提前进行，比如我把它放在构造函数中加载。

