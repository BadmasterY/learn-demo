<template>
  <div class="room">
    <div class="sidbar">
      <ul>
        <li
          v-for="user in roomInfo.users"
          :key="user.userid"
          @click="call(user)"
        >{{ user.username }}</li>
      </ul>
    </div>
    <div class="content">
      <ul ref="videolist">
        <li v-for="id in this.$store.state.roomUsers" :key="id">
          <video :class="id" autoplay></video>
          <Control :key='id' :userid="id" />
        </li>
      </ul>
    </div>
    <div class="self-video" @mouseenter="mouseenter($event)" @mouseleave="mouseleave($event)">
      <video ref="selfvideo" autoplay></video>
      <div v-if="this.isShowSelfControl" class="self-video-mark">
        <span class="video-btn">
          <i v-if="!this.isPauseVideo" class="video-pause" @click="pauseVideo"></i>
          <i v-else class="video-resume" @click="resumeVideo"></i>
        </span>
        <span class="audio-btn">
          <i v-if="!this.isPauseAudio" class="audio-pause" @click="pauseAudio"></i>
          <i v-else class="audio-resume" @click="resumeAudio"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Control from "./Control";

export default {
  name: "Room",
  components: {
    Control
  },
  data() {
    return {
      roomInfo: this.$store.state.room,
      isShowSelfControl: false,
      isPauseVideo: false,
      isPauseAudio: false,
      roomUsers: this.$store.state.roomUsers,
    };
  },
  computed: {},
  mounted() {
    this.$store.commit("setSelfVideo", this.$refs.selfvideo);
  },
  methods: {
    call(user) {
      const state = this.$store.state;
      if(state.isCalled) {
        console.warn('no! you are calling now...');
        return;
      }

      if (state.user.userid === user.userid) {
        console.warn(`Can't call yourself...`);
        return;
      }

      this.$socket.emit("call", { otherUser: user, self: state.user });
    },
    mouseenter(e) {
      if (e.target.className === "self-video") {
        this.isShowSelfControl = true;
      }
    },
    mouseleave(e) {
      if (e.target.className === "self-video") {
        this.isShowSelfControl = false;
      }
    },
    pauseVideo() {
      const store = this.$store;

      this.$socket.emit("pasueSelfVideo", {
        userid: store.state.user.userid
      });

      this.isPauseVideo = true;
      store.state.stream.videoTrack.enabled = false;
    },
    pauseAudio() {
      const store = this.$store;

      this.$socket.emit("pasueSelfAudio", {
        userid: store.state.user.userid
      });

      this.isPauseAudio = true;
      store.state.stream.audioTrack.enabled = false;
    },
    resumeVideo() {
      const store = this.$store;

      this.$socket.emit("resumeSelfVideo", {
        userid: store.state.user.userid
      });

      this.isPauseVideo = false;
      store.state.stream.videoTrack.enabled = true;
    },
    resumeAudio() {
      const store = this.$store;

      this.$socket.emit("resumeSelfAudio", {
        userid: store.state.user.userid
      });

      this.isPauseAudio = false;
      store.state.stream.audioTrack.enabled = true;
    }
  },
  updated() {
    this.$nextTick(function() {
      let videos = this.$refs.videolist.querySelectorAll('video');
      for(let video of videos) {
        this.$store.commit('setVideo', {userid: video.className, video});
      }
    });
  },
};
</script>

<style scoped>
.room {
  width: 100%;
  height: 100%;
}
.sidbar,
.content {
  width: 25%;
  height: 100%;
  float: left;
  box-sizing: border-box;
  background: #eee;
}
.sidbar ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.sidbar ul li {
  padding: 10px 20px;
  cursor: pointer;
  margin-bottom: 5px;
  transition: background 300ms;
}

.sidbar ul li:hover {
  background: rgba(0, 0, 0, 0.1);
}
.content {
  width: 75%;
  background: #fff;
  position: relative;
}

.content ul {
  list-style: none;
  margin: 0;
}

.content ul li {
  position: relative;
}

video {
  max-width: 1280px;
  max-height: 720px;
  width: 100%;
  background: #000;
}

.self-video {
  width: 25%;
  position: fixed;
  bottom: 10px;
  left: 10px;
}

.self-video-mark {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.self-video-mark span {
  display: inline-block;
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.self-video-mark span i {
  display: inline-block;
  width: 50%;
  height: 50%;
  cursor: pointer;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  margin: 0 auto;
}

.video-resume {
  background-image: url("../assets/video.png");
}
.video-pause {
  background-image: url("../assets/video-close.png");
}
.audio-resume {
  background-image: url("../assets/audio.png");
}
.audio-pause {
  background-image: url("../assets/audio-close.png");
}
</style>