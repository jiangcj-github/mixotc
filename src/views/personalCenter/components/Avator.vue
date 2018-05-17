// <template>
// <div>
//   <div id="cropper">  
//     <!-- 遮罩层 -->  
//     <div class="wrap1" v-show="panel">
//       <div class="wrap2">
//           <div class="container">  
//               <img id="image" :src="url" alt="Picture" style="width: 100%">  
//           </div>  
//         <button type="button" class="button" @click="crop">确定</button>
//         <button type="button" class="button cancel" @click="panel = false">取消</button>
//       </div>
//     </div>

//     <div style="padding:20px;">  
//         <div class="show" @click="()=>{
//             this.$refs.change.value = '';
//             this.$refs.change.click();
//           }">  
//           <div class="picture" :style="'backgroundImage:url('+headerImage+')'">  
//           </div>  
//         </div>
//         <div style="margin-top:20px;">  
//           <input type="file" id="change" ref="change" accept="image/png, image/jpeg" @change="change" v-show="false">  
//           <label for="change"></label>  
//         </div>  
//     </div>  
//   </div>  
// </div>  
// </template>

// <script>
//   import Cropper from 'cropperjs'  
// export default {  
//   // props: ['url', 'emitValue'],
//   data () {  
//     return {  
//       headerImage:'',  
//       picValue:'',  
//       cropper:'',  
//       croppable:false,
//       scalable: false,  
//       panel:false,  
//       url:'',
//       img: null
//     }  
//   },  
//   mounted () {  
//     //初始化这个裁剪框  
//     let self = this;  
//     let image = document.getElementById('image');  
//     this.cropper = new Cropper(image, {  
//       aspectRatio: 1,  
//       viewMode: 1,  
//       background:false,  
//       zoomable:true,
//       // center:false,
//       ready: function () {  
//         self.croppable = true;  
//       }  
//     });  
//   },  
//   methods: {  
//     getObjectURL (file) {  
//       let url = null ;   
//       if (window.createObjectURL!=undefined) { // basic  
//         url = window.createObjectURL(file) ;  
//       } else if (window.URL!=undefined) { // mozilla(firefox)  
//         url = window.URL.createObjectURL(file) ;  
//       } else if (window.webkitURL!=undefined) { // webkit or chrome  
//         url = window.webkitURL.createObjectURL(file) ;  
//       }  
//       return url ;  
//     },  
//     change (e) {  
//       let files = e.target.files || e.dataTransfer.files;  
//       if (!files.length) return;  
//       this.panel = true;  
//       this.picValue = files[0];  

//       this.url = this.getObjectURL(this.picValue);  
//       //每次替换图片要重新得到新的url  
//       if(this.cropper){  
//         this.cropper.replace(this.url);  
//       }
//       this.panel = true;  

//     },  
//     crop () {  
//         this.panel = false;  
//         let croppedCanvas;  
//         let roundedCanvas;  

//         if (!this.croppable) {  
//           return;  
//         }  
//         // Crop  
//         croppedCanvas = this.cropper.getCroppedCanvas();  
//         // Round  
//         roundedCanvas = this.getRoundedCanvas(croppedCanvas);  

//         this.headerImage = roundedCanvas.toDataURL();  
//         this.postImg()  

//     },  
//     getRoundedCanvas (sourceCanvas) {  

//       let canvas = document.createElement('canvas');  
//       let context = canvas.getContext('2d');  
//       let width = sourceCanvas.width;  
//       let height = sourceCanvas.height;  

//       canvas.width = width;  
//       canvas.height = height;  

//       context.imageSmoothingEnabled = true;  
//       context.drawImage(sourceCanvas, 0, 0, width, height);  
//       context.globalCompositeOperation = 'destination-in';  
//       context.beginPath();  
//       context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);  
//       context.fill();  

//       return canvas;  
//     },
//     // base64转化为Blob;
//     dataURItoBlob(base64Data) {
//       let byteString;
//       if (base64Data.split(',')[0].indexOf('base64') >= 0) byteString = atob(base64Data.split(',')[1]);
//       else byteString = unescape(base64Data.split(',')[1]);
//       let mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
//       let ia = new Uint8Array(byteString.length);
//       for (let i = 0; i < byteString.length; i++) {
//         ia[i] = byteString.charCodeAt(i);
//       }
//       return new Blob([ia], {type:mimeString});
//     },
//     postImg () {  
//       let blob = this.dataURItoBlob(this.headerImage);
//       // Blobbase64处理为FormData对象;
//       let fd = new FormData(document.forms[0]);
//       fd.append("uploadfile", blob, blob.type);
//       console.log(fd);
//       fetch(`http://192.168.113.26/file/`, {
//           method: 'Post',
//           body: fd
//         }).then(res => res.text())
//         .then(res => console.log(res))
//         .catch(error=>{})
//     }  
//   }  
// }  
// </script>

// <style>
//  #cropper .button {  
//   position: absolute;  
//   right: 95px;  
//   bottom: 20px;  
//   width: 160px;  
//   height: 40px;  
//   font-size: 14px;
//   color: #FFF;
//   background: #FFB422;
//   border-radius: 2px;
//   outline:none;
//   border:none;
//   cursor:pointer;  
// }  
// #cropper .button.cancel{
//   right: 285px;
//   color: #FFB422;
//   background: #FFF;
//   border: 1px solid #FFB422;
// }
// #cropper .show {  
//   width: 60px;  
//   height: 60px;  
//   /* overflow: hidden;   */
//   position: relative;  
//   border-radius: 50%;  
//   border: 1px solid #d5d5d5;  
// }  
// #cropper .picture {  
//   width: 100%;  
//   height: 100%;  
//   /* overflow: hidden;   */
//   background-position: center center;  
//   background-repeat: no-repeat;  
//   background-size: cover;   
// }  
// #cropper .wrap1 {
//   position: fixed;
//   left: 0;
//   top: 0;
//   width: 100%;
//   height: 100%;
//   background: rgba(0,0,0,0.4);
//   z-index: 99;
// }
// #cropper .wrap2{
//   position: absolute;  
//   left: 0;  
//   top: 0;  
//   right: 0;  
//   bottom: 0;  
//   width: 440px;
//   height: 440px;
//   z-index: 99;  
//   padding: 40px 40px 100px 40px;
//   margin: auto auto;
//   background:#fff;  
// }
// #cropper .container{
//   position: relative;
//   width: 100%;
//   height: 100%;
//   overflow: hidden;
//   background: #333;
// }
// #cropper #image {  
//   max-width: 100%;  
// }
// .cropper-view-box,.cropper-face {  
//   border-radius: 50%;  
// }  
// .cropper-container {  
//   width: 100% !important;
//   height: 100% !important;
//   font-size: 0;  
//   line-height: 0;
//   position: relative;
//   -webkit-user-select: none;
//   -moz-user-select: none;
//   -ms-user-select: none;
//   user-select: none;
//   direction: ltr;  
//   -ms-touch-action: none;  
//   touch-action: none

// }  

// .cropper-container img {  
//   /* Avoid margin top issue (Occur only when margin-top <= -height) */  
//   display: block;  
//   min-width: 0 !important;  
//   max-width: none !important;  
//   min-height: 0 !important;  
//   max-height: none !important;  
//   /* width: 100%;  
//   height: 100%;   */
//   image-orientation: 0deg  
// }
// .cropper-wrap-box,  
// .cropper-canvas,  
// .cropper-drag-box,  
// .cropper-crop-box,  
// .cropper-modal {  
//   position: absolute;   
//   width: 100%;
//   height: 100%; 
// }
// .cropper-wrap-box {  
//   /* overflow: hidden;   */
// }
// .cropper-drag-box {  
//   opacity: 0;  
//   background-color: #fff;  
// }
// .cropper-modal {  
//   opacity: .5;  
//   background-color: #333;  
// }
// .cropper-view-box {  
//   display: block;  
//   overflow: hidden;
//   width: 100%;  
//   height: 100%;
//   outline: 1px solid #FFB422;  
// }  
// .cropper-dashed {  
//   position: absolute;
//   display: block;
//   opacity: .5;  
//   border: 0 dashed #eee  
// }
// .cropper-dashed.dashed-h {  
//   top: 33.33333%;  
//   left: 0;  
//   width: 100%;  
//   height: 33.33333%;  
//   border-top-width: 1px;  
//   border-bottom-width: 1px  
// }
// .cropper-dashed.dashed-v {  
//   top: 0;  
//   left: 33.33333%;  
//   width: 33.33333%;  
//   height: 100%;  
//   border-right-width: 1px;  
//   border-left-width: 1px  
// }
// .cropper-center {  
//   position: absolute;  
//   top: 50%;  
//   left: 50%;
//   display: block;
//   width: 0;  
//   height: 0;
//   opacity: .75  
// }
// .cropper-center:before,  
//   .cropper-center:after {  
//   position: absolute;  
//   display: block;  
//   content: ' ';  
//   background-color: #eee  
// }
// .cropper-center:before {  
//   top: 0;  
//   left: -3px;  
//   width: 7px;  
//   height: 1px  
// }
// .cropper-center:after {  
//   top: -3px;  
//   left: 0;  
//   width: 1px;  
//   height: 7px  
// }
// .cropper-face,  
// .cropper-line,  
// .cropper-point {  
//   position: absolute;
//   display: block;
//   width: 100%;  
//   height: 100%;
//   opacity: 0.1;  
// }
// .cropper-face {  
//   top: 0;  
//   left: 0;
//   background-color: #fff;  
// }
// .cropper-line {  
//   background-color: #FFB422  
// }
// .cropper-line.line-e {  
//   top: 0;  
//   right: -3px;  
//   width: 5px;  
//   cursor: e-resize;  
// }
// .cropper-line.line-n {  
//   top: -3px;  
//   left: 0;  
//   height: 5px;  
//   cursor: n-resize;
// }
// .cropper-line.line-w {  
//   top: 0;  
//   left: -3px;  
//   width: 5px;  
//   cursor: w-resize; 
// }
// .cropper-line.line-s {  
//   bottom: -3px;  
//   left: 0;  
//   height: 5px;  
//   cursor: s-resize;
// }
// .cropper-point {  
//   width: 5px;  
//   height: 5px;  
//   opacity: .75;  
//   background-color: #FFB422;  
// }
// .cropper-point.point-e {  
//   top: 50%;  
//   right: -3px;  
//   margin-top: -3px;  
//   cursor: e-resize;  
// }
// .cropper-point.point-n {  
//   top: -3px;  
//   left: 50%;  
//   margin-left: -3px;  
//   cursor: n-resize;  
// }
// .cropper-point.point-w {  
//   top: 50%;  
//   left: -3px;  
//   margin-top: -3px;  
//   cursor: w-resize;
// }
// .cropper-point.point-s {  
//   bottom: -3px;  
//   left: 50%;  
//   margin-left: -3px;  
//   cursor: s-resize; 
// }
// .cropper-point.point-ne {  
//   top: -3px;  
//   right: -3px;  
//   cursor: ne-resize;  
// }
// .cropper-point.point-nw {  
//   top: -3px;  
//   left: -3px;  
//   cursor: nw-resize;  
// }
// .cropper-point.point-sw {  
//   bottom: -3px;  
//   left: -3px;  
//   cursor: sw-resize  
// }
// .cropper-point.point-se {  
//   right: -3px;  
//   bottom: -3px;  
//   cursor: se-resize;  
// }
// .cropper-invisible {  
//   opacity: 0;  
// }
// .cropper-bg {  
//   background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');  
// }
// .cropper-hide {  
//   position: absolute;
//   display: block;
//   width: 0;  
//   height: 0;  
// }
// .cropper-hidden {  
//   display: none !important;  
// }
// .cropper-move {  
//   cursor: move;  
// }
// .cropper-crop {  
//   cursor: crosshair;  
// }
// .cropper-disabled .cropper-drag-box,  
// .cropper-disabled .cropper-face,  
// .cropper-disabled .cropper-line,  
// .cropper-disabled .cropper-point {  
//   cursor: not-allowed;  
// }
// </style>