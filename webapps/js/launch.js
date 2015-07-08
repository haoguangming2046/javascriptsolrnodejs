var globalAppPadX = 0;
var globalAppPadY = 74;

/** main starting point for an app.
 * 
 * The application needs the uiprofile.json, translations.json, and help.json before the
 * login page can load.  Once the page is loaded it should not be reloaded until the user
 * is complete with the application.
 * 
 * 
 * The index.html page simply calls launchApplication to the application.
 * 
 */
 function launchApplication(args) {
    require(["dojo/dom-construct",
              "js/jsclosures.js",
              "js/app.js"],
    
    function(domConstruct){
    		getCurrentContext().setBusy(true,getCurrentContext().getString("LOADING"));
    		
        internLaunchApplication(domConstruct,args);
    });
}

function internLaunchApplication(domConstruct,args) {
     var cContext = getCurrentContext();
     
     if( args ){
     		cContext.mergeObjects(cContext,args);
     }
     
     cContext.mainId = args.id;
     
     cContext.loadScreenDimensions();
    
     var mainContainer = dojo.byId(cContext.mainId);
     
    
    dojo.style(mainContainer, "height", (cContext.windowHeight) + 'px');
    dojo.style(mainContainer, "width", (cContext.windowWidth) + 'px');
    
    cContext.resizing = false;
    
    var resizeDisplay = function(evt){
        var cContext = getCurrentContext();
        
        if( !cContext.resizing  ) {
            cContext.resizing = true;
        
            cContext.loadScreenDimensions();
       
            dojo.style(mainContainer, "height", (cContext.windowHeight+padY) + 'px');
            dojo.style(mainContainer, "width", (cContext.windowWidth+padX) + 'px');
            
            var tMainApp = dojo.byId(cContext.mainContainerName);
            if( tMainApp && tMainApp.lifecycle.resizeDisplay ){
                tMainApp.lifecycle.resizeDisplay(evt);
            }
                
            cContext.resizing = false;
        }
    }

    cContext.registerEventHandler(window, "onresize", resizeDisplay);
    cContext.registerEventHandler(mainContainer, "onresize", resizeDisplay);
    
    function buildBaseView() {
        console.log("build base view");

				if( cContext.getSetting("background-color") ){
        	dojo.style(mainContainer,"background-color",cContext.getSetting("background-color"));
				}
				
        cContext.init("en");
    }
    
    buildBaseView();
}

