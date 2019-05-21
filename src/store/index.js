/**
 * Created by lsw on 2019/5/13 0013.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import io from 'socket.io-client'
import url from '../api/server';
Vue.use(Vuex)

const socket = io('ws://localhost:5000')

socket.on('receiveMsg', function (data) {
  console.log('浏览器接收到服务器消息', data)
});
var store = new Vuex.Store({
  state: {
    roomdetail: {
      id: '',
      users: {},
      infos: [],
      current: 1,
      total: 0
    },
  },
  getters: {
    getInfos: state => state.roomdetail.infos,

  },
  mutations: {
    addRoomDetailInfos(state, data) {
      console.log(data)
      state.roomdetail.infos.push(data);
    },
    addRoomDefatilInfosHis(state, data) {
      const list = state.roomdetail.infos;
      state.roomdetail.infos = data.concat(list);
    },
    setRoomDetailInfos(state) {
      state.roomdetail.infos = [];
    },
  },
  actions: {
    sendMessage({commit},obj){
      socket.emit('sendMsg', obj)
      console.log('浏览器向服务器发送消息', obj)
    },
  }
})

export default store
