<template>
  <div>
    <div class="webchat" style="position: relative">
      <section class="hero is-fullheight">
        <div class="hero-body is-paddingless" v-show="!isShow">
          <div class="container has-text-centered">
            <div class="columns is-centered">
              <div class="column is-5-desktop is-12-touch">
                <div class="chat-box is-shady">
                  <!-- title -->
                  <div class="chat-box-title">
                    <div class="content has-text-centered">
                      <h1 class="title is-spaced has-text-white">{{$t("listBar.name")}}</h1>
                      <h3 class="subtitle has-text-white">
                        <span>{{$t("listBar.status")}}</span>
                        <span @click="changeCN" class="point">{{$t("listBar.cnLanguage")}}</span>
                        <span @click="changEN" class="point">{{$t("listBar.enLanguage")}}</span>
                      </h3>
                    </div>
                  </div>
                  <!-- content -->
                  <div class="chat-box-content has-background-white">
                    <!-- <div class="is-clearfix">
                      <div class="is-pulled-left">
                        <figure class="image is-48x48">
                          <img class="is-rounded" src="./img/robot.gif" alt>
                        </figure>
                      </div>
                      <div
                        class="pop-robot has-background-white-ter is-pulled-left"
                      >hello! I am Robot Baymax</div>
                    </div>
                    <div class="pop-box is-clearfix">
                      <div class="pop-human has-text-white is-pulled-right">你好</div>
                    </div>
                    <div class="is-clearfix">
                      <div class="is-pulled-left">
                        <figure class="image is-48x48">
                          <img class="is-rounded" src="./img/robot.gif" alt>
                        </figure>
                      </div>
                      <div
                        class="pop-robot has-background-white-ter is-pulled-left"
                      >What can I do for you?</div>
                    </div>
                    <div class="pop-box is-clearfix">
                      <div class="pop-human has-text-white is-pulled-right">Something and so on</div>
                    </div>
                    <div class="is-clearfix">
                      <div class="is-pulled-left">
                        <figure class="image is-48x48">
                          <img class="is-rounded" src="./img/robot.gif" alt>
                        </figure>
                      </div>
                      <div
                        class="pop-robot has-background-white-ter is-pulled-left"
                      >That's what I have to say? -_-</div>
                    </div>
                    <div class="pop-box is-clearfix">
                      <div class="pop-human has-text-white is-pulled-right">如何请假？</div>
                    </div>
                    <div class="is-clearfix">
                      <div class="is-pulled-left">
                        <figure class="image is-48x48">
                          <img class="is-rounded" src="./img/robot.gif" alt>
                        </figure>
                      </div>
                      <div class="pop-robot has-background-white-ter is-pulled-left has-text-left">
                        <div class="field">
                          <label class="label">Name</label>
                          <div class="control">
                            <input class="input" type="text" placeholder="name">
                          </div>
                        </div>
                        <div class="field">
                          <label class="label">Tel</label>
                          <div class="control">
                            <input class="input" type="tel" placeholder="tel">
                          </div>
                        </div>
                        <div class="field">
                          <label class="label">Time</label>
                          <div class="control">
                            <div class="dropdown is-up is-hoverable">
                              <div class="dropdown-trigger">
                                <button
                                  class="button"
                                  aria-haspopup="true"
                                  aria-controls="dropdown-menu4"
                                >
                                  <span>Hover me</span>
                                  <span class="icon is-small">
                                    <i class="fas fa-angle-up" aria-hidden="true"></i>
                                  </span>
                                </button>
                              </div>
                              <div class="dropdown-menu" id="dropdown-menu4" role="menu">
                                <div class="dropdown-content">
                                  <div class="dropdown-item">
                                    <p>
                                      You can insert
                                      <strong>
                                        any type of
                                        content
                                      </strong>
                                      within the dropdown menu.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="field">
                          <div class="control has-text-centered">
                            <button class="button is-rounded submit-btn">Submit</button>
                          </div>
                        </div>
                      </div>
                    </div>-->
                    <div
                      v-if="getInfos.length === 0"
                      class="chat-no-people"
                    >{{$t("listBar.messages")}}</div>
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
                  <!-- bottom -->
                  <div class="chat-box-bottom">
                    <div class="card is-clearfix is-shadowless">
                      <div class="card-left is-clearfix">
                        <div class="input-box is-pulled-left is-hidden-desktop">
                          <input
                            type="text"
                            class="input"
                            ref="starts"
                            @focus="handleFocus"
                            v-model="chatValue"
                            autofocus
                          >
                        </div>
                        <div class="media-box">
                          <div class="dropdown is-up" :class="{'is-active':emojiShow}">
                            <div class="dropdown-trigger point">
                              <i class="iconfont icon-smiling" @click="emojiload"></i>
                            </div>
                            <div class="dropdown-menu" id="dropdown-menu7" role="menu">
                              <div class="dropdown-content">
                                <div class="dropdown-item">
                                  <div class="emoji-content has-background-white">
                                    <div class="emoji-tabs swiper-container">
                                      <div class="emoji-container swiper-wrapper" ref="emoji">
                                        <div
                                          class="emoji-block swiper-slide"
                                          v-for="(categorys,index) in categoryArray"
                                          :key="index"
                                        >
                                          <div>
                                            <span
                                              class="emoji-face point is-inline-block"
                                              v-for="(item, index) in categorys"
                                              :key="index"
                                            >{{item}}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            class="dropdown is-up"
                            :class="{'is-active':fileTypeShow}"
                            v-if="!chatValue"
                          >
                            <div class="dropdown-trigger point">
                              <i class="iconfont icon-jiahao" @click="handleMore"></i>
                            </div>
                            <input
                              id="inputFile"
                              name="inputFile"
                              type="file"
                              multiple="mutiple"
                              accept="image/*"
                              style="display: none"
                              @change="fileup"
                            >
                            <input
                              type="file"
                              accept="video/*"
                              id="video"
                              name="video"
                              style="display: none"
                              @change="uploadVideo"
                            >
                            <div class="dropdown-menu" id="dropdown-menu7" role="menu">
                              <div class="dropdown-content">
                                <div class="dropdown-item">
                                  <div class="is-clearfix">
                                    <div class="image-box is-pulled-left">
                                      <i class="iconfont icon-tupian" @click="imgupload"></i>
                                      <div class="name">图片</div>
                                    </div>
                                    <div class="video-box is-pulled-left">
                                      <i class="iconfont icon-BAI-shiping" @click="videoUpload"></i>
                                      <div class="name">视频</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <span class="demo-raised-button is-hidden-desktop" v-else>
                            <i class="iconfont icon-fasong" @click="submess"></i>
                          </span>
                        </div>
                        <button
                          class="button submit-btn is-rounded is-shadowless is-pulled-right is-hidden-touch"
                          @click="submess"
                        >发送</button>
                      </div>
                      <!-- <div class="card-right is-pulled-right">
                      </div>-->
                    </div>
                    <!-- textarea限制字数 -->
                    <!-- <textarea class="textarea is-shadowless has-background-white-ter" placeholder="说点什么呢？"
                                                    row="3" maxlength="100" onchange="this.value=this.value.substring(0,100)"
                                                    onkeydown="this.value=this.value.substring(0,100)" onkeyup="this.value=this.value.substring(0,100)" autofocus>
                    </textarea>-->
                    <textarea
                      class="textarea is-shadowless has-background-white-ter is-hidden-touch"
                      placeholder="说点什么呢？"
                      ref="starts"
                      @focus="handleFocus"
                      v-model="chatValue"
                      autofocus
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="hero-footer is-hidden-touch">
          <div class="toggleShow" @click="handleClick">
            <i
              class="el-icon-circle-plus"
              :class="{active: isShow}"
              style="font-size: 50px;position: absolute;right: 0px;bottom:56px;"
              v-if="isShow"
            ></i>
            <i
              class="el-icon-mobile-phone"
              :class="{inifit: toggle}"
              style="font-size: 50px; position: absolute;right: 0px;bottom:56px;"
              v-else
            ></i>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script type="text/javascript">
import { mapGetters } from "vuex";
import emoji from "../utils/emoji";
import { inHTMLData } from "xss-filters-es6";
import Message from "../components/Message.vue";
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
import { _SetCookie } from "../../src/utils/util";
export default {
  data() {
    return {
      isShow: false,
      toggle: true,
      emoji: emoji,
      container: {},
      chatValue: "",
      emojiShow: false,
      userid: "lswlee",
      src: "//s3.qiufengh.com/avatar/hoster.jpg",
      fileTypeShow: false,
      lang: "中文"
    };
  },
  computed: {
    ...mapGetters(["getInfos"]),
    categoryArray() {
      const { people } = this.emoji;
      const bigArray = [];

      let smallArray = [];
      people.forEach(c => {
        if (smallArray.length === 0) {
          bigArray.push(smallArray);
        }
        smallArray.push(c);

        if (smallArray.length === 35) {
          smallArray = [];
        }
      });
      return bigArray;
    },
    emojiTypes() {
      return Object.keys(this.emoji);
    }
  },
  methods: {
    handleClick() {
      this.isShow = !this.isShow;
    },
    imgupload() {
      const file = document.getElementById("inputFile");
      file.click();
    },
    videoUpload() {
      const fileVideo = document.getElementById("video");
      fileVideo.click();
    },
    emojiload() {
      if (this.fileTypeShow) {
        this.fileTypeShow = false;
      }
      this.emojiShow = !this.emojiShow;
    },
    submess() {
      // 判断发送信息是否为空
      console.log("点击了发送按钮");
      if (this.chatValue !== "") {
        this.emojiShow = false;
        const msg = inHTMLData(this.chatValue); // 防止xss
        let id = this.id;
        const obj = {
          username: this.userid,
          src: this.src,
          img: "",
          msg,
          time: new Date()
        };
        // 传递消息信息
        this.$store.dispatch("sendMessage", obj);
        this.$store.commit("addRoomDetailInfos", obj);
        setTimeout(() => {
          const resRobot = {
            username: "robot",
            src: this.src,
            img: "",
            msg,
            time: new Date(),
            type: msg === "请假" ? true : false
          };
          this.$store.commit("addRoomDetailInfos", resRobot);
          this.$nextTick(() => {
            this.container.scrollTop = this.container.scrollHeight;
          });
        }, 2000);
        this.chatValue = "";
        this.$nextTick(() => {
          this.container.scrollTop = this.container.scrollHeight;
          console.log(this.container.scrollHeight, this.container.scrollTop);
        });
      } else {
        return;
      }
    },
    handleFocus() {
      this.emojiShow = false;
      this.fileTypeShow = false;
    },
    handleMore() {
      if (this.emojiShow) {
        this.emojiShow = false;
      }
      this.fileTypeShow = !this.fileTypeShow;
    },
    fileup(e) {
      this.fileTypeShow = false;
      const that = this;
      const file1 = e.target.files[0];
      console.log(e.target.files[0]);
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
        return false;
      }
      if (file1.size >= 1048576) {
        alert("图片大小不能超过1M");
        return false;
      }
      if (file1) {
        const formdata = new window.FormData();
        formdata.append("file", file1);
        formdata.append("username", this.userid);
        formdata.append("src", this.src);
        formdata.append("time", new Date());
        const fr = new window.FileReader();
        fr.onload = function() {
          const obj = {
            username: that.userid,
            src: that.src,
            img: fr.result, //被选定文件的内容
            msg: "",
            time: new Date()
          };
          that.$store.dispatch("sendMessage", obj);
          that.$store.commit("addRoomDetailInfos", obj);
          setTimeout(() => {
            const resRobot = {
              username: "robot",
              src: that.src,
              img: fr.result,
              msg: "",
              time: new Date()
            };
            that.$store.commit("addRoomDetailInfos", resRobot);
            that.$nextTick(() => {
              that.container.scrollTop = that.container.scrollHeight;
            });
          }, 2000);
          that.$nextTick(() => {
            that.container.scrollTop = that.container.scrollHeight;
          });
          e.target.value = "";
        };
        //读取文件内容，结果用data:url的字符串形式表示
        fr.readAsDataURL(file1);
      } else {
        console.log("必须有文件");
      }
    },
    uploadVideo(e) {
      this.fileTypeShow = false;
      const that = this;
      const video = e.target.files[0]; //选择的文件
      if (video) {
        const result = new window.FormData();
        result.append("file", video);
        result.append("username", this.userid);
        result.append("src", this.src);
        result.append("time", new Date());
        var reader = new FileReader();
        var rs = reader.readAsArrayBuffer(video);
        reader.onload = e => {
          let data;
          if (typeof e.target.result === "object") {
            data = window.URL.createObjectURL(new Blob([e.target.result]));
          } else {
            data = e.target.result;
          }
          const obj = {
            username: that.userid,
            src: that.src,
            img: "",
            msg: "",
            videoSrc: data,
            time: new Date()
          };
          that.$store.dispatch("sendMessage", obj);
          that.$store.commit("addRoomDetailInfos", obj);
          this.$nextTick(() => {
            that.container.scrollTop = that.container.scrollHeight;
          });
          e.target.value = "";
        };
      } else {
        console.log("必须有文件");
      }
    },
    _initSwiper() {
      var mySwiper = new Swiper(".swiper-container", {
        observer: true,
        observeParents: true
      });
    },
    changeCN() {
      this.lang = "中文";
      this.$i18n.locale = "zh-CN";
      _SetCookie("PLAY_LANG", "zh-CN", 1);
    },
    changEN() {
      this.lang = "English";
      this.$i18n.locale = "en-US";
      _SetCookie("PLAY_LANG", "en-US", 1);
    }
  },
  async mounted() {
    this.container = document.querySelector(".chat-box-content");
    const that = this;
    await this.$store.commit("setRoomDetailInfos");
    this.$refs.emoji.onclick = function(e) {
      console.log("11", e);
      var target = e.target || e.srcElement;
      if (!!target && target.tagName.toLowerCase() === "span") {
        that.chatValue = that.chatValue + target.innerHTML;
      }
      e.stopPropagation();
    };
    this._initSwiper();
  },
  watch: {},
  components: {
    Message
  }
};
</script>
<style scoped lang="scss">
div {
  // border: 1px solid #ccc;
}
// hero-body
.chat-box {
  border: 1px solid #ccc;
  border-radius: 10px 10px 0 0;
  .chat-box-title {
    padding: 1rem;
    background: linear-gradient(to top right, #524ad0 10%, #d099fa);
    border-radius: 10px 10px 0 0;
    &:hover {
      background: linear-gradient(to bottom left, #524ad0, #d099fa);
    }
  }

  .chat-box-content {
    padding: 1rem 0.5rem;
    // max-height: 320px;
    // min-height: 280px;
    // height: 190px;
    overflow-x: hidden;
    overflow-y: auto;
    .chat-no-people {
      margin-top: 3rem;
    }
  }

  .chat-box-bottom {
    .card {
      padding: 0.25rem;
      // border-top: 1px solid #ccc;
      // border-bottom: 1px solid #ccc;
      background: linear-gradient(to bottom left, #524ad0, #d099fa);

      .dropdown {
        margin-right: 0.25rem;
      }
    }

    .textarea {
      resize: none;
      border: 0;
    }
  }
}

.image-box,
.video-box {
  padding: 0 1rem;
  border-radius: 10px;
  border: 1px solid #ccc;
}

.image-box {
  margin-right: 1rem;
}

.submit-btn {
  border: 1px solid #524ad0;
  &:hover {
    background: linear-gradient(to bottom left, #524ad0 10%, #d099fa);
    color: #fff;
  }
}

.icon-smiling,
.icon-jiahao,
.icon-fasong {
  font-size: 1.5rem;
}

.icon-tupian,
.icon-BAI-shiping {
  font-size: 2rem;
}

.point {
  cursor: pointer;
}

.emoji-content {
  width: 370px;
  height: 210px;
  .emoji-face {
    font-size: 1.8rem;
    min-width: 3rem;
  }
}

// hero-footer
.active {
  transform: rotateZ(45deg);
  transition: transform linear 0.2s;
}
.inifit {
  transform: rotateZ(-45deg);
  transition: transform linear 0.2s;
}

@media screen and(max-width: 1024px) {
  .chat-box-content {
    height: 450px;
  }
  .media-box {
    float: right;
  }
  .dropdown-menu {
    left: auto;
    right: 0;
  }
}

@media screen and(min-width: 1024px) {
  // 容器阴影
  .is-shady {
    background: #fff;
    box-shadow: rgba(0, 0, 0, 0.1) 0 1px 0;
    transition: all 0.2s ease-in-out;
    &:hover {
      box-shadow: 0 10px 16px rgba(0, 0, 0, 0.13), 0 6px 6px rgba(0, 0, 0, 0.19);
    }
  }

  .chat-box-content {
    max-height: 320px;
    min-height: 280px;
  }

  .media-box {
    float: left;
  }
}
</style>
