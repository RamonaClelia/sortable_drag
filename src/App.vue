<template>
  <div id="app">
    <center>
      <div id="coverScroll" v-if="!warning_show"></div>
    </center>
    <!-- start fixtopcontainer container -->
    <div class="fixCont">
      <div
        class="answerRow"
        v-for="(finInd,indx) in finalpos.filter(function(item,index){return index<inputObj.topfix})"
        :key="indx"
        :id="'sort_'+indx"
        v-bind:style="{ 'min-height': maxh+'px' }"
      >
        <div class="srtBtn left">
          <i class="fa fa-bars"></i>
        </div>
        <div class="answer dns">
          <span class="innText" v-html="answers[finInd]"></span>
        </div>
        <div class="srtBtn right">
          <i class="fa fa-bars"></i>
        </div>
      </div>
    </div>
    <!-- end fixtopcontainer container -->
    <!-- start sortable container -->
    <div class="answerContainer">
      <div
        class="answerRow"
        v-for="(finInd,indx) in finalpos.filter(function(item,index){return index>=inputObj.topfix && index<(finalpos.length-inputObj.bottomfix)})"
        :key="indx"
        :id="'sort_'+indx"
        v-bind:style="{ 'min-height': maxh+'px' }"
      >
        <div class="srtBtn left">
          <i class="fa fa-bars"></i>
        </div>
        <div class="answer dns">
          <span class="innText" v-html="answers[finInd]"></span>
        </div>
        <div class="srtBtn right">
          <i class="fa fa-bars"></i>
        </div>
      </div>
    </div>
    <!-- end sortable container -->
    <!-- start fixbottomcontainer container -->
    <div class="fixCont">
      <div
        class="answerRow"
        v-for="(finInd,indx) in finalpos.filter(function(item,index){return index>=(finalpos.length-inputObj.bottomfix)})"
        :key="indx"
        :id="'sort_'+indx"
        v-bind:style="{ 'min-height': maxh+'px' }"
      >
        <div class="srtBtn left">
          <i class="fa fa-bars"></i>
        </div>
        <div class="answer dns">
          <span class="innText" v-html="answers[finInd]"></span>
        </div>
        <div class="srtBtn right">
          <i class="fa fa-bars"></i>
        </div>
      </div>
    </div>
    <!-- end fixbottomcontainer container -->
    <div class="modalContainer" v-if="warning_show">
      <div class="modalOverlay" @click.self="warning_show=false"></div>
      <div class="modalContent">
        <div class="modalClose" >
          <span id="closeBtn" v-html="inputObj.error_button"  @click="warning_show=false">

          </span>
        </div>
        <div class="modalText" v-html="inputObj.error_text"></div>
        
      </div>
    </div>
    <button
      type="button"
      id="fakeNext"
      class="mrNext"
      @click="next_click()"
      v-html="inputObj.text_next"
    ></button>
  </div>
</template> 

<script>
export default {
  name: "app",
  data() {
    return {
      inputObj,
      answers: [],
      finalpos: [],
      maxh: 0,
      was_updated: false,
      warning_displayed: false,
      warning_show: false
    };
  },
  created() {
    var vueObj = this;

    $(".mrGridCategoryText").each(function(indx) {
      vueObj.answers.push($(this).html());
      vueObj.finalpos.push(indx);
    });

    this.add_vals();
  },
  beforeDestroy: function() {
    window.removeEventListener("resize", this.handleWindowResize);
  },
  mounted() {
    this.maxh = Math.max(this.maxh, 40);
    let vueObj = this;
    window.addEventListener("resize", this.handleWindowResize);
    // $(".answerContainer").disableSelection();

    $(".answerContainer").sortable({
      axis: "y",
      cursor: "move",
      containment: "parent",
      cancel: ".dns",
      update: function(event, ui) {
        vueObj.was_updated = true;
      }
    });

    window.everythingReady = function() {
      vueObj.add_vals();
      vueObj.resize_ev();
      $("body").trigger("fakeReady");
    };
  },
 watch: {
    warning_show: function(value) {
      if (value){
        $('body').css('overflow','hidden')
      }else{
        $('body').css('overflow','inherit')
      }
    }
  },
  methods: {
    next_click() {
      // console.log(this.inputObj.firstValidation);
      let vueObj = this;
      // debugger;
      if (!vueObj.was_updated && vueObj.inputObj.firstValidation) {
        vueObj.warning_show = true;
        // var errMsg = new OverlayMaster({
        //   Message: vueObj.inputObj.error_text,
        //   OkButton: vueObj.inputObj.error_button
        // });
        // errMsg.show();
        vueObj.warning_displayed = true;
        vueObj.was_updated = true;
      } else {
        // console.log("submit");
        var sorted = $(".answerContainer").sortable("serialize", { key: "id" });
        sorted = sorted.replace(new RegExp("id=", "g"), "");
        var sort_arr = sorted.split("&");
        // console.log(sort_arr);
        for (var i = 0; i < sort_arr.length; i++) {
          // console.log(i, parseInt(sort_arr[i]));
          //add 1
          this.finalpos[parseInt(sort_arr[i]) + vueObj.inputObj.topfix] =
            i + vueObj.inputObj.topfix + 1;
        }
        for (
          var i = vueObj.inputObj.topfix;
          i < sort_arr.length + vueObj.inputObj.topfix;
          i++
        ) {
          $(".mrEdit")
            .eq(i * 2 + 1)
            .val(this.finalpos[i]);
        }
        // // submit comm
        $("#mrForm").submit();
      }
    },
    handleWindowResize(event) {
      this.resize_ev();
    },
    resize_ev(event) {
      var maximum = 0;
      $(".innText").each(function(indx) {
        // console.log(indx,this.scrollHeight, this.offsetHeight);
        if (this.scrollHeight > maximum) {
          maximum = this.scrollHeight;
          //heightCorrection
          maximum=maximum+5;
        }
      });
      // console.log(this.maxh, maximum);
      this.maxh = Math.max(maximum, 40);

      // console.log($(".innText").length);
      $("#coverScroll").css(
        "height",
        parseInt($(".innText").length * this.maxh) +
          ($(".innText").length - 1) *
            parseInt($(".answerRow").css("margin-bottom")) +
          "px"
      );
    },
    add_vals() {
      //add 1
      // debugger;
      // console.log("addvals");
      var vueObj = this;
      $(".mrGridCategoryText").each(function(indx) {
        // console.log(indx)
        $(".mrEdit")
          .eq(indx * 2)
          .val(indx + 1);
        $(".mrEdit")
          .eq(indx * 2 + 1)
          .val(vueObj.finalpos[indx] + 1);
      });
    }
  }
};
</script>
<style scoped>
/* .modalContainer{

} */
.modalContent {
  background-color: white;
  position: fixed;
  width: 60vw;
  top: 15%;
  max-height: 70vh;
  min-height: 20vh;
  margin: 5% auto; /* Will not center vertically and won't work in IE6/7. */
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  border-radius: 5px;

}
.modalOverlay {
  background-color: black;
  opacity: 0.75;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}

.modalClose {
  background-color: #42bcb9;
  display: flex;
  justify-content: flex-end;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
#closeBtn{
  /* background-color: bisque; */
    padding: 5px;
    font-size: larger;
    font-weight: bold;
    color: white;
    cursor: pointer;
    margin-right: 5px;
}
#closeBtn:hover{
  color: gray;
}
.modalText {
  /* background-color: aliceblue; */
  display: flex;
  flex-grow: 2;
  padding: 5px;
    border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  overflow: auto;
      max-height: 85%;
    min-height: 100px;
}
@media only screen and (max-width: 600px) {
  .modalContent {
    width: 85vw;
  }
}
#coverScroll {
  /* border:1px solid red; */
  width: 80%;
  max-width: 600px;
  padding: 3px;
  margin: auto;
  position: absolute;
  min-height: 5px;
  z-index: 1000;
  left: 10%;
}
.srtBtn,
.answer {
  position: absolute;
  top: 0px;
  bottom: 0px;
  min-width: 10%;
  align-items: center;
  display: flex;
}
.left {
  left: 0px;
}
.right {
  right: 0px;
}
.dns {
  position: absolute;
  top: 0px;
  bottom: 0px;
}
.answerRow {
  position: relative;
  padding: 5px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.srtBtn {
  font-size: 25px;
  background-color: #49bfbc;
  color: white;
  cursor: pointer;
  text-align: center;
  justify-content: center;
}
.answer {
  justify-content: center;
  text-align: center;
  width: 80%;
  max-width: 600px;
  padding: 3px;
  margin-left: 9%;
}
.answerRow {
  border: 2px solid #42bcb9;
  border-radius: 5px;
  margin: 5px;
  background-color: white;
}
.answerContainer {
  width: 100%;
  margin: 0 auto;
  text-align: left;
}
@media only screen and (max-width: 600px) {
  .answerContainer {
    width: 100%;
  }
}
#app {
  position: relative;
  max-width: 750px;
  width: 100%;
  margin: auto;
  color: black;
  text-align: center;
  font-family: robotolight, Arial, sans-serif;

  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
#fakeNext {
  padding: 0.5em 0;
  min-width: 100px;
  width: 20%;
  margin-top: 30px;
}

.fixCont > .answerRow > .srtBtn {
  background-color: transparent;
  cursor: initial;
}
</style>
