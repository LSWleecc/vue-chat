<template>
  <div>
    <div class="webchat" style="position: relative">
      <div class="container" v-show="!isShow">
        <div class="header">
          <h4 class="title">Sara</h4>
          <span>I'm still in development</span>
        </div>
        <div class="chat-inner">
          <div class="chat-container">
            <div v-if="getInfos.length === 0" class="chat-no-people">暂无消息,赶紧来占个沙发～</div>
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
            <div class="clear"></div>
          </div>
        </div>
        <div class="bottom">
          <div class="functions">
            <div class="fun-li" @click="imgupload">
              <i class="iconfont icon-tupian"></i>
            </div>
            <div class="fun-li emoji">
              <i class="iconfont icon-smiling" @click="emojiload"></i>
              <div class="emoji-content" v-show="emojiShow">
                <div class="emoji-tabs">
                  <div class="emoji-container" ref="emoji">
                    <div class="emoji-block" :style="{width: Math.ceil(emoji.people.length / 5) * 48 + 'px'}">
                      <span v-for="(item, index) in emoji.people" :key="index">{{item}}</span>
                    </div>
                    <div class="emoji-block" :style="{width: Math.ceil(emoji.nature.length / 5) * 48 + 'px'}">
                      <span v-for="(item, index) in emoji.nature" :key="index">{{item}}</span>
                    </div>
                    <div class="emoji-block" :style="{width: Math.ceil(emoji.items.length / 5) * 48 + 'px'}">
                      <span v-for="(item, index) in emoji.items" :key="index">{{item}}</span>
                    </div>
                    <div class="emoji-block" :style="{width: Math.ceil(emoji.place.length / 5) * 48 + 'px'}">
                      <span v-for="(item, index) in emoji.place" :key="index">{{item}}</span>
                    </div>
                    <div class="emoji-block" :style="{width: Math.ceil(emoji.single.length / 5) * 48 + 'px'}">
                      <span v-for="(item, index) in emoji.single" :key="index">{{item}}</span>
                    </div>
                  </div>
                  <div class="tab">

                  </div>
                </div>
              </div>
            </div>
            <div class="fun-li video">
              <i class="iconfont icon-BAI-shiping" @click="videoUpload"></i>
            </div>
          </div>
          <div class="chat">
            <div class="input" @keyup.enter="submess">
              <input type="text" @focus="handleFocus" v-model="chatValue">
            </div>
            <el-button class="demo-raised-button" type="primary" @click="submess">发送</el-button>
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
  import Message from './Message.vue'
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
        src: '//s3.qiufengh.com/avatar/hoster.jpg'
      }
    },
    computed: {
      ...mapGetters(['getInfos'])
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
        this.emojiShow = !this.emojiShow
      },
      submess() {
        this.emojiShow = false
        // 判断发送信息是否为空
        if (this.chatValue !== '') {
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
//          socket.emit('message', obj);
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
      },
      fileup(e) {
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
//          this.$store.dispatch('uploadImg', formdata);
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
    },
    watch: {
//      nowMessageList: function() {
//        this.$nextTick(() => {
//          document.body.scrollTop = document.body.scrollHeight;
//          console.log(document.body.scrollTop);
//        });
//      }
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
        }
        span {
          text-align: center;
          color: #2c3e50;
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
        height: 80px;
        border-top: 1px solid #ddd;
        background: #f7f6fb;
        .chat {
          width: 100%;
          display: flex;

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

            .mu-text-field {
              width: 100%;
            }
          }

          .demo-raised-button {
            margin-right: 8px;
            min-width: 80px;
            width: 80px;
            height: 40px;
            background: #eeeff3;
            color: #8c8c96;
          }
        }

        .functions {
          width: 100%;
          display: flex;
          .fun-li {
            width: 30px;
            height: 30px;
            line-height: 30px;
            display: inline-block;
            position: relative;
            color: #828187;
            text-align: center;

            .iconfont {
              font-size: 20px;
            }
          }

          .emoji-content {
            position: absolute;
            bottom: 30px;
            left: -30px;
            width: 370px;
            height: 210px;
            border-top: 1px solid #f3f3f3;
            overflow: hidden;
            background-color: #fff;

            .emoji-container {
              width: 10000px;
            }

            .emoji-tabs {
              overflow: auto;

              .emoji-block {
                width: 1170px;
                height: 200px;
                float: left;

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
          }
        }
      }
    }
  }


</style>
