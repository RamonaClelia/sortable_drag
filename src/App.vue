<template>
  <div id="app">
    <center>
      <div id="coverScroll"></div>
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
        <div class="srtBtn left"><i class="fas fa-arrows-alt-v"></i></div>
        <div class="answer dns">
          <span class="innText" v-html="answers[finInd]"></span>
        </div>
        <div class="srtBtn right"><i class="fas fa-arrows-alt-v"></i></div>
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
        <div class="srtBtn left"><i class="fas fa-arrows-alt-v"></i></div>
        <div class="answer dns">
          <span class="innText" v-html="answers[finInd]"></span>
        </div>
        <div class="srtBtn right"><i class="fas fa-arrows-alt-v"></i></div>
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
        <div class="srtBtn left"><i class="fas fa-arrows-alt-v"></i></div>
        <div class="answer dns">
          <span class="innText" v-html="answers[finInd]"></span>
        </div>
        <div class="srtBtn right"><i class="fas fa-arrows-alt-v"></i></div>
      </div>
    </div>
    <!-- end fixbottomcontainer container -->
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
      warning_displayed: false
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
  methods: {
    next_click() {
      // console.log(this.inputObj.firstValidation);
      let vueObj = this;
      // debugger;
      if (!vueObj.was_updated && this.inputObj.firstValidation) {
        var errMsg = new OverlayMaster({
          Message: vueObj.inputObj.error_text,
          OkButton: vueObj.inputObj.error_button
        });
        errMsg.show();
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
          this.finalpos[parseInt(sort_arr[i])+vueObj.inputObj.topfix] = i+vueObj.inputObj.topfix+1;
          
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
        $('#mrForm').submit();
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
          .val(indx+1);
        $(".mrEdit")
          .eq(indx * 2 + 1)
          .val(vueObj.finalpos[indx]+1);
      });
    }
  }
};
</script>
<style scoped>
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
  background-color: white;
  cursor: initial;
}
</style>
