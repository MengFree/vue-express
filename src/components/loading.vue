
<template>
  <div id="loading_wait" v-if='show'>
      <div class="content">
        <div class="loader">
        </div>
        <p>loading</p> 
      </div>
  </div>
</template>

<script>
  export default {
    name: 'loading',
    data() {
      return {
        
      }
    },
    props: ['show'],
    methods: {
  
    }
  }
</script>


<style>
#loading_wait {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, .4);
    z-index: 10000;
}

#loading_wait .content {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5rem;
    height: 5rem;
    -webkit-transform: translate(-50%, -150%);
    transform: translate(-50%, -150%);
}

#loading_wait .content p {
    color: #ffffff;
    font-size: .8rem;
    font-weight: bold;
    text-align: center;
}

.loader {
    font-size: 2.6rem;
    text-indent: -9999em;
    overflow: hidden;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    margin: 0.8em auto;
    position: relative;
    -webkit-animation: load6 1.7s infinite ease;
    animation: load6 1.7s infinite ease;
}

@-webkit-keyframes load6 {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
        box-shadow: -0.11em -0.83em 0 -0.4em #ffffff, -0.11em -0.83em 0 -0.42em #ffffff, -0.11em -0.83em 0 -0.44em #ffffff, -0.11em -0.83em 0 -0.46em #ffffff, -0.11em -0.83em 0 -0.477em #ffffff;
    }
    5%,
    95% {
        box-shadow: -0.11em -0.83em 0 -0.4em #ffffff, -0.11em -0.83em 0 -0.42em #ffffff, -0.11em -0.83em 0 -0.44em #ffffff, -0.11em -0.83em 0 -0.46em #ffffff, -0.11em -0.83em 0 -0.477em #ffffff;
    }
    30% {
        box-shadow: -0.11em -0.83em 0 -0.4em #ffffff, -0.51em -0.66em 0 -0.42em #ffffff, -0.75em -0.36em 0 -0.44em #ffffff, -0.83em -0.03em 0 -0.46em #ffffff, -0.81em 0.21em 0 -0.477em #ffffff;
    }
    55% {
        box-shadow: -0.11em -0.83em 0 -0.4em #ffffff, -0.29em -0.78em 0 -0.42em #ffffff, -0.43em -0.72em 0 -0.44em #ffffff, -0.52em -0.65em 0 -0.46em #ffffff, -0.57em -0.61em 0 -0.477em #ffffff;
    }
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
        box-shadow: -0.11em -0.83em 0 -0.4em #ffffff, -0.11em -0.83em 0 -0.42em #ffffff, -0.11em -0.83em 0 -0.44em #ffffff, -0.11em -0.83em 0 -0.46em #ffffff, -0.11em -0.83em 0 -0.477em #ffffff;
    }
}

@keyframes load6 {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
        box-shadow: -0.11em -0.83em 0 -0.4em #ffffff, -0.11em -0.83em 0 -0.42em #ffffff, -0.11em -0.83em 0 -0.44em #ffffff, -0.11em -0.83em 0 -0.46em #ffffff, -0.11em -0.83em 0 -0.477em #ffffff;
    }
    5%,
    95% {
        box-shadow: -0.11em -0.83em 0 -0.4em #ffffff, -0.11em -0.83em 0 -0.42em #ffffff, -0.11em -0.83em 0 -0.44em #ffffff, -0.11em -0.83em 0 -0.46em #ffffff, -0.11em -0.83em 0 -0.477em #ffffff;
    }
    30% {
        box-shadow: -0.11em -0.83em 0 -0.4em #ffffff, -0.51em -0.66em 0 -0.42em #ffffff, -0.75em -0.36em 0 -0.44em #ffffff, -0.83em -0.03em 0 -0.46em #ffffff, -0.81em 0.21em 0 -0.477em #ffffff;
    }
    55% {
        box-shadow: -0.11em -0.83em 0 -0.4em #ffffff, -0.29em -0.78em 0 -0.42em #ffffff, -0.43em -0.72em 0 -0.44em #ffffff, -0.52em -0.65em 0 -0.46em #ffffff, -0.57em -0.61em 0 -0.477em #ffffff;
    }
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
        box-shadow: -0.11em -0.83em 0 -0.4em #ffffff, -0.11em -0.83em 0 -0.42em #ffffff, -0.11em -0.83em 0 -0.44em #ffffff, -0.11em -0.83em 0 -0.46em #ffffff, -0.11em -0.83em 0 -0.477em #ffffff;
    }
}
</style>