import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ls from 'fm.liveswitch'

// Import the LiveSwitch configuration
import { applicationId, channelId, sharedSecret } from '../liveswitch_config.json'

// Import the plugin
import { LiveSwitchPlugin } from './liveswitch'

Vue.config.productionTip = false

// generate a token that will let us connect to the server
// we use the values from the config here
// Never generate tokens on the client side in a production application
const token = ls.Token.generateClientRegisterToken(applicationId, null, null, null, null, [new ls.ChannelClaim(channelId)], sharedSecret)

// a few handlers
// in your production application, these handlers should
// store the media/record objects in a reactive VueX store
// where all your sub-components can access/react to them
const onLocalMediaReady = function (media) {
  const home = document.getElementsByClassName('home')[0]
  home.insertBefore(media.getView(), home.firstChild)
}

const onParticipantJoin = function (record) {
  const home = document.getElementsByClassName('home')[0]
  home.insertBefore(record.media.getView(), home.firstChild)
}

const onParticipantLeave = function (record) {
  const home = document.getElementsByClassName('home')[0]
  home.removeChild(record.media.getView())
}

// Install the LiveSwitch plugin
Vue.use(LiveSwitchPlugin, {
  applicationId,
  token,
  onLocalMediaReady,
  onParticipantJoin,
  onParticipantLeave
})

// normal vue stuff
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
