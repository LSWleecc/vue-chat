<template>
  <div>
    <div class="webchat" style="position: relative">
      <div class="container" v-show="!isShow">
        <div class="header">
          <h4 class="title">{{$t("listBar.name")}}</h4>
          <div class="chooseLang">
            <span>{{$t("listBar.status")}}</span>
            <span @click="changeCN">{{$t("listBar.cnLanguage")}}</span>
            <span @click="changEN">{{$t("listBar.enLanguage")}}</span>
          </div>
        </div>
        <div class="chat-inner">
          <div class="chat-container">
            <div v-if="getInfos.length === 0" class="chat-no-people">{{$t("listBar.messages")}}</div>
            <Message
              v-for="(obj,index) in getInfos"
              :key="index"
              :is-self="obj.username === userid"
              :name="obj.username"
              :head="obj.src"
              :msg="obj.msg"
              :img="obj.img"
              :videoSrc="obj.videoSrc"
              :mytime="obj.time"
              :container="container"
              :type="obj.type"
            ></Message>
          </div>
        </div>
        <div class="bottom">
          <div class="chooseFileType" v-show="fileTypeShow">
            <div class="image">
              <div>
                <div class="choseBtn">
                  <i class="iconfont icon-tupian" @click="imgupload"></i>
                </div>
              </div>
              <div class="name">图片</div>
            </div>
            <div class="video">
              <div>
                <div class="choseBtn">
                  <i class="iconfont icon-BAI-shiping" @click="videoUpload"></i>
                </div>
              </div>
              <div class="name">视屏</div>
            </div>
          </div>
          <div class="chat">
            <div class="input" @keyup.enter="submess">
              <input type="text" ref="starts" @focus="handleFocus" v-model="chatValue">
            </div>
            <div class="emoji">
              <div class="chooseFile">
                <i class="iconfont icon-smiling" @click="emojiload"></i>
                <div class="emoji-content" v-show="emojiShow">
                  <div class="emoji-tabs swiper-container">
                    <div class="emoji-container swiper-wrapper" ref="emoji">
                      <div class="emoji-block swiper-slide" v-for="(categorys,index) in categoryArray" :key="index">
                        <div>
                          <span v-for="(item, index) in categorys" :key="index">{{item}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="more" v-if="!chatValue">
              <i class="iconfont icon-jiahao" @click="handleMore"></i>
            </div>
            <div class="demo-raised-button" v-else>
              <i class="iconfont icon-fasong" @click="submess"></i>
            </div>
          </div>
          <input id="inputFile" name='inputFile' type='file' multiple='mutiple' accept="image/*"
                 style="display: none" @change="fileup">
          <input type="file" accept="video/*" id="video" name="video" style="display: none" @change="uploadVideo">
        </div>
      </div>
      <div class="toggleShow" @click="handleClick">
        <i class="el-icon-circle-plus" :class="{active: isShow}" style="font-size: 50px; position: absolute;right: 0px;bottom: -56px;" v-if="isShow"></i>
        <i class="el-icon-mobile-phone" :class="{inifit: toggle}" style="font-size: 50px; position: absolute;right: 0px;bottom: -56px;" v-else></i>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import {mapGetters} from 'vuex'
  import emoji from '../utils/emoji';
  import {inHTMLData} from 'xss-filters-es6';
  import Message from '../components/Message.vue'
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.min.css'
  import {_SetCookie} from '../../src/utils/util'
  export default {
    data(){
      return{
        isShow: false,
        toggle: true,
        emoji: emoji,
        container: {},
        chatValue: '',
        emojiShow: false,
        userid: 'lswlee',
        src: '//s3.qiufengh.com/avatar/hoster.jpg',
        fileTypeShow: false,
        lang: '中文'
      }
    },
    computed: {
      ...mapGetters(['getInfos']),
      categoryArray(){
        const {people} = this.emoji
        const bigArray = []

        let smallArray = []
        people.forEach(c => {
          if(smallArray.length===0){
            bigArray.push(smallArray)
          }
          smallArray.push(c)

          if(smallArray.length===35){
            smallArray = []
          }
        })
        return bigArray
      },
      emojiTypes(){
        return Object.keys(this.emoji)
      }
    },
    methods:{
      handleClick(){
        this.isShow = !this.isShow
      },
      imgupload() {
        const file = document.getElementById('inputFile');
        file.click();
      },
      videoUpload(){
        const fileVideo = document.getElementById('video');
        fileVideo.click();
      },
      emojiload(){
        if(this.fileTypeShow){
          this.fileTypeShow = false
        }
        this.emojiShow = !this.emojiShow
      },
      submess() {
        // 判断发送信息是否为空
        if (this.chatValue !== '') {
          this.emojiShow = false
          const msg = inHTMLData(this.chatValue); // 防止xss
          let id = this.id
          const obj = {
            username: this.userid,
            src: this.src,
            img: '',
            msg,
            time: new Date(),
          };
          // 传递消息信息
          this.$store.dispatch('sendMessage',obj)
          this.$store.commit('addRoomDetailInfos',obj)
          setTimeout(()=>{
            const resRobot = {
              username: 'robot',
              src: this.src,
              img: '',
              msg,
              time: new Date(),
              type: msg === '请假' ? true : false
            };
            this.$store.commit('addRoomDetailInfos',resRobot)
            this.$nextTick(() => {
              this.container.scrollTop = this.container.scrollHeight;
            });
          },2000)
          this.chatValue = '';
          this.$nextTick(() => {
            this.container.scrollTop = this.container.scrollHeight;
            console.log(this.container.scrollHeight,this.container.scrollTop)
          });
        } else {
          return
        }
      },
      handleFocus(){
        this.emojiShow = false
        this.fileTypeShow = false
      },
      handleMore(){
        if(this.emojiShow){
          this.emojiShow = false
        }
        this.fileTypeShow = !this.fileTypeShow
      },
      fileup(e) {
        this.fileTypeShow = false
        const that = this;
        const file1 =e.target.files[0];
        console.log(e.target.files[0])
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
          return false
        }
        if (file1.size >= 1048576) {
          alert('图片大小不能超过1M')
          return false;
        }
        if (file1) {
          const formdata = new window.FormData();
          formdata.append('file', file1);
          formdata.append('username', this.userid);
          formdata.append('src', this.src);
          formdata.append('time', new Date());
          const fr = new window.FileReader();
          fr.onload = function () {
            const obj = {
              username: that.userid,
              src: that.src,
              img: fr.result,//被选定文件的内容
              msg: '',
              time: new Date()
            };
            that.$store.dispatch('sendMessage',obj)
            that.$store.commit('addRoomDetailInfos',obj)
            setTimeout(()=>{
              const resRobot = {
                username: 'robot',
                src: that.src,
                img: fr.result,
                msg: '',
                time: new Date()
              };
              that.$store.commit('addRoomDetailInfos',resRobot)
              that.$nextTick(() => {
                that.container.scrollTop = that.container.scrollHeight;
              });
            },2000)
            that.$nextTick(() => {
              that.container.scrollTop = that.container.scrollHeight;
            });
            e.target.value = ''
          };
          //读取文件内容，结果用data:url的字符串形式表示
          fr.readAsDataURL(file1);
        } else {
          console.log('必须有文件');
        }
      },
      uploadVideo(e) {
        this.fileTypeShow = false
        const that = this;
        const video = e.target.files[0];  //选择的文件
        if(video){
          const result = new window.FormData();
          result.append('file', video);
          result.append('username', this.userid);
          result.append('src', this.src);
          result.append('time', new Date());
          var reader = new FileReader();
          var rs =  reader.readAsArrayBuffer(video)
          reader.onload = (e) => {
            let data
            if (typeof e.target.result === 'object') {
              data = window.URL.createObjectURL(new Blob([e.target.result]))
            } else {
              data = e.target.result
            }
            const obj = {
              username: that.userid,
              src: that.src,
              img: '',
              msg: '',
              videoSrc: data,
              time: new Date()
            };
            that.$store.dispatch('sendMessage',obj)
            that.$store.commit('addRoomDetailInfos',obj)
            this.$nextTick(() => {
              that.container.scrollTop = that.container.scrollHeight;
            });
            e.target.value = ''
          }
        }else{
          console.log('必须有文件')
        }
      },
      _initSwiper(){
        var mySwiper = new Swiper('.swiper-container',{
          observer:true,
          observeParents:true
        })
      },
      changeCN(){
        this.lang = '中文';
        this.$i18n.locale = 'zh-CN'
        _SetCookie('PLAY_LANG','zh-CN',1)
      },
      changEN(){
        this.lang = 'English';
        this.$i18n.locale = 'en-US'
        _SetCookie('PLAY_LANG','en-US',1)
      }
    },
    async mounted(){
      this.container = document.querySelector('.chat-inner');
      const that = this;
      await this.$store.commit('setRoomDetailInfos')
      this.$refs.emoji.onclick = function (e) {
        console.log('11',e)
        var target = e.target || e.srcElement;
        if (!!target && target.tagName.toLowerCase() === 'span') {
          that.chatValue = that.chatValue + target.innerHTML;
        }
        e.stopPropagation();
      }
      this._initSwiper()
    },
    watch: {

    },
    components:{
      Message
    }
  }
</script>
<style scoped lang="scss">
  .active {
    transform: rotateZ(45deg);
    transition: transform linear .2s ;
  }
  .inifit{
    transform: rotateZ(-45deg);
    transition: transform linear .2s ;
  }
  .webchat{
    width: 370px;
    height: 600px;
    border-radius: 5px;
    margin: 0 auto;
    .container {
      box-shadow: 0 1px 8px 0 rgba(122, 107, 107, 0.22);
      -webkit-box-shadow: 0 1px 8px 0 rgba(122, 107, 107, 0.22);
      .header {
        width: 370px;
        height: 87px;
        background: slateblue;
        .title {
          color: #fff;
          font-size: 24px;
          margin: 0;
          padding: 15px 0;
          text-align: center;
        }
        .chooseLang {
          text-align: center;
        }
        span {
          text-align: center;
          color: #2c3e50;
          cursor: pointer;
        }
      }
      .chat-inner {
        background-color: #fff;
        height: 50vh;
        max-height: 425px;
        overflow-y: auto;
        padding-top: 10px;
        .chat-container {
          overflow: hidden;
          .chat-no-people {
            width: 100%;
            height: 415px;
            line-height: 415px;
            text-align: center;
            color: #D1CFD2;
          }
        }
      }
      .chat-inner::-webkit-scrollbar{
        width:5px;
      }
      .chat-inner::-webkit-scrollbar-track{
        box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        border-radius:5px;
      }
      .chat-inner::-webkit-scrollbar-thumb{
        background-color:rgba(50, 65, 87, 0.5);
        outline:1px solid slategrey;
        border-radius:5px;
      }
      .bottom {
        width: 100%;
        height: 50px;
        border-top: 1px solid #ddd;
        background: #f7f6fb;
        .chat {
          width: 100%;
          display: flex;
          position: relative;
          .emoji,.more,.demo-raised-button {
            width: 30px;
            text-align: center;
            line-height: 40px;
            margin-right: 5px;
            .iconfont {
              font-size: 25px;
              cursor: pointer;
            }
          }
          .input {
            flex: 1;
            padding: 0 4px 4px 4px;

            input {
              width: 100%;
              height: 42px;
              box-sizing: border-box;
              border: 1px solid #e8e7ea;
              border-radius: 3px;
              color: #333333;
              font-size: 19px;
              padding-left: 5px;
              outline: none;
            }

          }
        }

        .chooseFile {
          width: 100%;
          display: flex;
          .emoji-content {
            position: absolute;
            bottom: 48px;
            left: 0px;
            width: 370px;
            height: 210px;
            border-top: 1px solid #f3f3f3;
            background-color: #fff;
            .emoji-container {
              width: 100%;
              height: 100%;
            }

            .emoji-tabs {
              .emoji-block {

                span {
                  display: inline-block;
                  cursor: pointer;
                  font-size: 26px;
                  min-width: 48px;
                  line-height: 39px;
                  text-align: center;
                  list-style: none;
                }
              }
            }
            .tab {
              width: 100%;
              height: 38px;
              border: 1px solid red;
              display: flex;
              .emojiType {
                display: flex;

              }
            }
          }
        }
        .chooseFileType {
          width: 100%;
          height: 100px;
          background: #fff;
          border-top: 1px solid #f3f3f3;
          position: absolute;
          left: 0px;
          bottom: 85px;
          display: flex;
          align-items: center;
          .choseBtn {
            width: 50px;
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            .iconfont {
              font-size: 32px;
              color: #828187;
            }
          }
          .image,.video {
            width: 50px;
            height: 50px;
            border: 1px solid #828187;
            margin-left: 20px;
            border-radius: 5px;
          }
        }
      }
    }
  }


</style>
