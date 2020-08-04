<template>
  <div>
    <div v-if="isSupportShared">Supportedd Share Content</div>
    <div v-else>Oh no 😢</div>
    <div class="result">Have {{ error }}</div>
    <button id="btn" v-on:click="setNewValue">Button</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: "HelloWorld",
    };
  },
  computed: {
    isSupportShared: function () {
      return navigator.share;
    },
  },
  methods: {
    setNewValue: async () => {
      try {
        alert("alerts");
        let shareData = {
          title: "MDN",
          text: "Learn web development on MDN!",
          url: "https://developer.mozilla.org",
        };
        await navigator.share(shareData);
        this.error = "MDN shared successfully";
      } catch (e) {
        alert(e);
        this.error = "Error: " + e;
      }
    },
  },
};
</script>
