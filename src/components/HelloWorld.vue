<template>
  <div>
    <div class="webchat" style="position: relative">
      <div class="container" v-show="!isShow">
        <div class="header">
          <h4 class="title">Sara</h4>
          <span>I'm still in development</span>
        </div>
        <div class="chat-inner" id="nowMessageList">
          <div class="chat-container">
            <div v-if="getInfos.length === 0" class="chat-no-people">暂无消息,赶紧来占个沙发～</div>
            <div v-if="getInfos.length !== 0" class="chat-loading">
              <div class="lds-css ng-scope">
                <div class="lds-rolling">
                  <div>
                  </div>
                </div>
              </div>
            </div>
            <Message
              v-for="(obj,index) in getInfos"
              :key="index"
              :is-self="obj.username === userid"
              :name="obj.username"
              :head="obj.src"
              :msg="obj.msg"
              :img="obj.img"
              :mytime="obj.time"
              :container="container"
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
          </div>
          <div class="chat">
            <div class="input" @keyup.enter="submess">
              <input type="text" @focus="handleFocus" v-model="chatValue">
            </div>
            <el-button class="demo-raised-button" type="primary" @click="submess">发送</el-button>
          </div>
          <input id="inputFile" name='inputFile' type='file' multiple='mutiple' accept="image/*;capture=camera"
                 style="display: none" @change="fileup">
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
//            roomid: this.roomid,
            time: new Date()
          };
          // 传递消息信息
          this.$store.dispatch('sendMessage',obj)
//          socket.emit('message', obj);
          this.$store.commit('addRoomDetailInfos',obj)
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
      fileup() {
        const that = this;
        const file1 = document.getElementById('inputFile').files[0];
        if (file1) {
          const formdata = new window.FormData();
          formdata.append('file', file1);
          formdata.append('username', this.userid);
          formdata.append('src', this.src);
          formdata.append('roomid', that.roomid);
          formdata.append('time', new Date());
          this.$store.dispatch('uploadImg', formdata);
          const fr = new window.FileReader();
          fr.onload = function () {
            const obj = {
              username: that.userid,
              src: that.src,
              img: fr.result,
              msg: '',
              roomid: that.roomid,
              time: new Date()
            };
            socket.emit('message', obj);
          };
          fr.readAsDataURL(file1);
        } else {
          console.log('必须有文件');
        }
      },
    },
    async mounted(){
      this.container = document.querySelector('.chat-inner');
      const that = this;
      await this.$store.commit('setRoomDetailInfos')
      this.$refs.emoji.addEventListener('click', function(e) {
        console.log('11',e)
        var target = e.target || e.srcElement;
        if (!!target && target.tagName.toLowerCase() === 'span') {
          that.chatValue = that.chatValue + target.innerHTML;
        }
        e.stopPropagation();
      });
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

  /*.messageContent{
    background-color: #fff;
    height: 50vh;
    max-height: 425px;
    overflow-y: auto;
    padding-top: 10px;
  }
  .message{
    margin: 10px;
    display: flex;
    font-size: 14px;
    font-family: "Roboto", serif;
  }
  .avantar{
    width: 40px;
    height: 40px;
    border-radius: 100%;
    margin-right: 10px;
  }
  .response{
    background-color: #f4f7f9;
    color: #617287;
    border-radius: 10px;
    padding: 15px;
    max-width: 215px;
  }
  .message-text{
    font-size: 14px;
    margin: 0px;
  }
  .markdown p {
    padding: 0px;
    margin: 0px;
  }
  .client{
    background-color: #0084FF;
    color: #fff;
    border-radius: 10px;
    padding: 8px 16px;
    max-width: 215px;
    text-align: left;
    font-family: "Roboto", serif;
    margin-left: auto;
    overflow-wrap: break-word;
    margin-right: 10px;
  }
  .sender{
    align-items: center;
    display: flex;
    background-color: #f4f7f9;
    height: 45px;
    padding: 5px;
  }
  .new-message{
    font-size: 1.1em;
    width: 100%;
    border: 0;
    background-color: #f4f7f9;
    height: 30px;
    padding-left: 15px;
  }
  .send{
    background: #f4f7f9;
    border: 0;
  }
  .send-icon{
    height: 25px;
  }*/



</style>
