/**
 * Created by lsw on 2019/5/13 0013.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import WebSocket from 'socket.io-client'

Vue.use(Vuex)

// const socket = io('ws://localhost:5000')

// socket.on('receiveMsg', function (data) {
//   console.log('浏览器接收到服务器消息', data)
//   console.log(socket,'fff')
// });


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
      // socket.emit('sendMsg', obj)
    },
  }
})

export default store
