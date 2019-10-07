// variable for passing input from dimenssion to vue
var inputObj = {};

function gridSortable(settings, parent) {
  this.parent = parent.addClass("gridSortable");

  //this is where we add Properties that can be overridden
  this.myProperty = "myValue";
  this.error_text = 'Errors-MissingAnswer';
  this.error_button = 'X';
  this.text_next = 'Next';
  this.topfix= 0;
  this.bottomfix= 0;
  this.firstValidation=false;

  //it's usefull to have a parameter for seting the path of the loaded files
  this.vuePath = settings.CustomPath
    ? settings.CustomPath + settings.questionLook
    : settings.theFilePath + settings.questionLook;

  // overide defaults with what was passed
  $.extend(this, settings);

  //set inputObj to this in order to pass properties
  inputObj = this;

  //this is where we add Properties that cannot be overridden
  // this.PrivateProperty = true;

  //call the initialization function
  this.init();
}

//You can create multiple functions inside the object prototype
gridSortable.prototype = {
  init: function() {
    var me = this;

    //add div that will be used as placeholder by vue
    $("#question").append("<div id='app'></div>");

    //set what files need to be loaded (result of vue build)
    var VueScripts = [
		"app.css",

		"jquery.ui.touch-punch.min.js", 
		"chunk-vendors.js", 
		"app.js"];
		
		$.getScript( "https://code.jquery.com/jquery-1.7.2.js" )
		  .done(function( script, textStatus ) {
			//call the function that loads the files
			$.getScript( "https://code.jquery.com/ui/1.8.21/jquery-ui.min.js" )
			.done(function( script, textStatus ) {
				load_script();
			})
		  })
		  .fail(function( jqxhr, settings, exception ) {
			console.log("failed to load script");
		});

    

    function load_script() {
	$("head").append("<link rel='stylesheet' type='text/css' href='https://media.ipsosinteractive.com/deploy/resources/FontAwesome/5.10.2/css/all.min.css' />");
      VueScripts.forEach(function(element) {
        if (element.indexOf(".css") != -1) {
          $("head").append("<link rel='stylesheet' type='text/css' href='" +me.vuePath +"/css/" +element +"?" +new Date().getTime() +"' />"
          );
        } else {
          $.getScript(me.vuePath + "/js/" + element);
        }
      });
    }

    // !!!! IMPORTANT  !!!!!!!! BE SURE TO RUN THE FOLLOWING LINE OF CODE WHEN YOUR SCRIPT HAS FINISHED RUNNING !!!!!!
    me.Deffered.resolve(me);
  }
};
