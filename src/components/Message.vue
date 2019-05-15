<template>
  <div class="clear" :class="[isSelf ? 'right' : 'left']" ref="msg">
    <div class="item">
      <div class="name">
        <span v-if="mytime">{{getdate}}</span> &nbsp;&nbsp;{{name}}
      </div>
      <span class="head-place">
          <img :src="avatar" alt="" class="head">
      </span>
      <div v-if="img">
        <img
          :src="pic"
          alt=""
          v-preview="img"
          class="img"
          preview-title-enable="true"
          preview-nav-enable="true">
      </div>
      <span v-if="msg && !type">
          <span v-html="linkMsg" class="msg"></span>
      </span>
      <h1 class="msg" v-if="type">
        <!--<el-form :inline="true" :model="formInline" class="demo-form-inline">-->
          <!--<el-form-item label="审批人">-->
            <!--<el-input v-model="formInline.user" placeholder="审批人"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="活动区域">-->
            <!--<el-select v-model="formInline.region" placeholder="活动区域">-->
              <!--<el-option label="区域一" value="shanghai"></el-option>-->
              <!--<el-option label="区域二" value="beijing"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item>-->
            <!--<el-button type="primary" @click="onSubmit">查询</el-button>-->
          <!--</el-form-item>-->
        <!--</el-form>-->
      </h1>
      <div v-if="videoSrc" class="videoSrc">
        <video :src="videoSrc"  width="200px" height="150px"  controls="controls"></video>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import dateFormat from "../utils/date";
  import { inHTMLData, uriInUnQuotedAttr } from "xss-filters-es6";
  export default {
    props: ["name", "img", "msg", "head", "mytime", "is-self", "container" , "videoSrc" , "type" ],
    computed: {
      getdate() {
        return dateFormat(new Date(this.mytime), "yyyy-MM-dd HH:mm:ss");
      },
      linkMsg() {
        // 防止xss
        const filterValue = inHTMLData(this.msg);
        return filterValue.replace(
          /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g,
          function($0, $1) {
            const url = $0;
            return `<a style="color: #b374ff" href="${uriInUnQuotedAttr(
              url
            )}" target="_blank">${uriInUnQuotedAttr(url)}</a>`;
          }
        );
      },
      avatar() {
        let avatar = this.head;
//        const reg = /\.\/static\/img\/(\d+)\.jpg/;
//        const matches = this.head.match(reg);
//        if (matches) {
//          avatar = `//s3.qiufengh.com/avatar/${matches[1]}.jpeg`;
//        }
        return `${avatar}?imageView2/2/w/120/h/120`;
      },
      pic() {
        let pic = this.img;
        if (pic.indexOf("data:image") > -1) {
          return pic;
        }
        return `${pic}?imageView2/2/w/360`;
      }
    },
    mounted() {
      this.$refs.msg.scrollIntoView();
    }
  };
</script>
<style lang="scss" scoped>
  .clear {
    .item {
      max-width: 100%;
      position: relative;
      clear: both;
      display: inline-block;
      padding: 16px 40px 16px 20px;
      margin: 20px 10px 20px 10px;
      border-radius: 10px;
      background-color: #fff;

      .img {
        max-width: 200px;
      }
      .videoSrc {
        max-width: 200px;
        max-height: 150px;
      }

      .name {
        position: absolute;
        top: -20px;
        width: 280px;
        height: 20px;
        overflow: hidden;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .msg {
        word-break: break-all;
      }

      .time {
        position: absolute;
        top: -40px;
        width: 200px;
        height: 20px;
        right: -70px;
      }

      .head-place {
        display: block;
        width: 50px;
        height: 50px;
        position: absolute;
        top: 0;
        background: #fff;
        border-radius: 50px;
        overflow: hidden;
      }

      .head {
        width: 50px;
        height: 50px;
        border-radius: 50px;
      }

      &:after {
        position: absolute;
        top: 15px;
        content: '';
        width: 0;
        height: 0;
      }
    }
  }

  .left {
    .item {
      // animation: show-chat-even 0.25s 1 ease-in
      float: left;
      margin-left: 80px;
      color: #313035;
      background: gainsboro;
      &:after {
        left: -15px;
        border-top: 15px solid gainsboro;
        border-left: 15px solid transparent;
      }
    }

    .name {
      text-align: left;
      left: -70px;
    }

    .time {
      text-align: left;
    }

    .head-place {
      left: -70px;
    }
  }

  .right {
    .item {
      // animation: show-chat-odd 0.25s 1 ease-in
      float: right;
      margin-right: 80px;
      color: #fff;
      background: #2196f3;

      &:after {
        right: -15px;
        border-top: 15px solid #2196f3;
        border-right: 15px solid transparent;
      }
    }

    .name {
      color: #313035;
      text-align: right;
      right: -70px;
    }

    .time {
      text-align: right;
    }

    .head-place {
      right: -70px;
    }

    @keyframes show-chat-odd {
      0% {
        margin-right: -480px;
      }

      100% {
        margin-right: 0;
      }
    }

    @keyframes show-chat-even {
      0% {
        margin-left: -480px;
      }

      100% {
        margin-left: 0;
      }
    }
  }
</style>
