<template>
  <div id="control">
    <ul>
      <!-- <li class="start">
        <div v-if="this.$store.state.isPaused" class="control-resume" @click="resume"></div>
        <div v-else class="control-paused" @click="paused"></div>
      </li>-->
      <li class="video">
        <span v-if="this.isPauseVideo" class="control-resumeVideo" @click="resumeVideo(userid)"></span>
        <span v-else class="control-pausedVideo" @click="pausedVideo(userid)"></span>
      </li>
      <li class="audio">
        <span v-if="this.isPauseAudio" class="control-resumeAudio" @click="resumeAudio(userid)"></span>
        <span v-else class="control-pausedAudio" @click="pausedAudio(userid)"></span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Control",
  props: {
    userid: String
  },
  data() {
    return {
      isPauseVideo: false,
      isPauseAudio: false
    };
  },
  methods: {
    resume() {
      const store = this.$store;
      store.commit("setPaused", false);

      store.state.consumer.videoConsumer.resume();
      store.state.consumer.audioConsumer.resume();

      new Promise(resolve => {
        this.$socket.emit(
          "resume",
          { userid: store.state.user.userid },
          resolve
        );
      })
        .then(() => {
          console.log("继续播放...");
        })
        .catch(err => {
          console.error(err);
        });
    },
    paused() {
      const store = this.$store;
      store.commit("setPaused", true);

      store.state.consumer.videoConsumer.pause();
      store.state.consumer.audioConsumer.pause();

      new Promise(resolve => {
        this.$socket.emit(
          "paused",
          { userid: store.state.user.userid },
          resolve
        );
      })
        .then(() => {
          console.log("暂停播放...");
        })
        .catch(err => {
          console.error(err);
        });
    },
    resumeVideo(userid) {
      const store = this.$store;

      this.isPauseVideo = false;

      store.state.consumer[userid].videoConsumer.resume();

      new Promise(resolve => {
        this.$socket.emit(
          "resumeVideo",
          {
            userid: store.state.user.userid,
            otherUserid: userid
          },
          resolve
        );
      })
        .then(() => {
          console.log("恢复视频...");
        })
        .catch(err => {
          console.error(err);
        });
    },
    pausedVideo(userid) {
      const store = this.$store;

      this.isPauseVideo = true;

      store.state.consumer[userid].videoConsumer.pause();

      new Promise(resolve => {
        this.$socket.emit(
          "pausedVideo",
          {
            userid: store.state.user.userid,
            otherUserid: userid
          },
          resolve
        );
      })
        .then(() => {
          console.log("暂停视频...");
        })
        .catch(err => {
          console.error(err);
        });
    },
    resumeAudio(userid) {
      const store = this.$store;

      this.isPauseAudio = false;

      store.state.consumer[userid].audioConsumer.resume();

      new Promise(resolve => {
        this.$socket.emit(
          "resumeAudio",
          {
            userid: store.state.user.userid,
            otherUserid: userid
          },
          resolve
        );
      })
        .then(() => {
          console.log("恢复语音...");
        })
        .catch(err => {
          console.error(err);
        });
    },
    pausedAudio(userid) {
      const store = this.$store;

      this.isPauseAudio = true;

      store.state.consumer[userid].audioConsumer.pause();

      new Promise(resolve => {
        this.$socket.emit(
          "pausedAudio",
          {
            userid: store.state.user.userid,
            otherUserid: userid
          },
          resolve
        );
      })
        .then(() => {
          console.log("暂停语音...");
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>

<style scoped>
#control {
  position: absolute;
  bottom: 20px;
  width: 80%;
  left: 50%;
  padding: 10px 30px;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.3);
  border-radius: 30px;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
}

li {
  width: 30px;
  height: 30px;
  float: left;
  margin: 0 10px;
}

li span {
  width: 100%;
  height: 100%;
  display: inline-block;
  cursor: pointer;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.control-resume {
  background-image: url("../assets/resume.png");
}
.control-paused {
  background-image: url("../assets/pasued.png");
}
.control-resumeVideo {
  background-image: url("../assets/video.png");
}
.control-pausedVideo {
  background-image: url("../assets/video-close.png");
}
.control-resumeAudio {
  background-image: url("../assets/audio.png");
}
.control-pausedAudio {
  background-image: url("../assets/audio-close.png");
}
</style>