var CURRENTCONTEXT = {
    rtmenabled: true,
    RTMChannel: "/zen/chat",
    paddingX: 0,
    paddingY: 74,
    busyDialogTimeout: 500
};

function getCurrentContext() {
    return (CURRENTCONTEXT);
}

CURRENTCONTEXT.getRestUrl = function(contentType){
	return( getCurrentContext().getSetting("restUrl","/rest/restservice") + "?contenttype=" + contentType );
}

CURRENTCONTEXT.loadScreenDimensions = function() {
    var cContext = getCurrentContext();
    
    var padX = cContext.paddingX;
    var padY = cContext.paddingY;
    
    var windowDimension = dojo.window.getBox();
   // var screen = window.screen;
    //var windowDimension = {w: screen.width,h: screen.height};
   
    cContext.screenWidth = windowDimension.w - padX;
    cContext.screenHeight = windowDimension.h - padY;
    cContext.windowWidth = windowDimension.w;
    cContext.windowHeight = windowDimension.h;
}

CURRENTCONTEXT.registerEventHandler = function(node,eventName,callback){
	return( getCurrentContext().on(node,eventName,callback) );
}

CURRENTCONTEXT.deregisterEventHandler = function(handler){
	handler.remove();
}

CURRENTCONTEXT.setCurrentView = function(viewId,doLaters){
		var cContext = getCurrentContext();
    
    var viewContext = cContext.getViewContext(viewId);
    
		if( viewContext ){
			
			var doAfter = function(authData){
				if( authData.status ){
					if( cContext.currentView ) {
							var viewContext = cContext.getViewContext(cContext.currentView);
							if( viewContext ){
								viewContext.lifecycle.stop();
							}
					}
					cContext.currentView = viewId;
		    		cContext.nextActions = doLaters;
		    	
		    		viewContext = cContext.getViewContext(cContext.currentView);
		    	
		    		if( !viewContext.lifecycle.initialized ){
						viewContext.lifecycle.init(viewContext);
					}
					else
						viewContext.lifecycle.start();
				}
				else {
					cContext.writeLog(1,"Auth Failed");
				}
			}
			
			if( viewContext.authenticate ){
				cContext.checkAuthentication(doAfter);
			}
			else {
				doAfter({status: 1});
	    }
		}
    
    /*if( cContext.nextActions && cContext.nextActions.length > 0 ){
        var doLaters = cContext.nextActions;
        cContext.nextActions = false;
        
        for(var i = 0;i < doLaters.length;i++){
            try {
                doLaters[i]();
            }
            catch(exp){
                console.log("exp: " + exp);
            }
        }
   }*/
}

CURRENTCONTEXT.clearPendingActions = function(){
	var cContext = getCurrentContext();
    
    if( cContext.nextActions && cContext.nextActions.length > 0 ){
        var doLaters = cContext.nextActions;
        cContext.nextActions = false;
        
        for(var i = 0;i < doLaters.length;i++){
            try {
                doLaters[i]();
            }
            catch(exp){
                console.log("exp: " + exp);
            }
        }
   }
}

CURRENTCONTEXT.checkAuthentication = function(callback){
	callback({status: 1,message: "AOK"});
}

CURRENTCONTEXT.getCurrentView = function(){
    return( getCurrentContext().currentView );
}

CURRENTCONTEXT.getSetting = function(which,defaultValue){
	var cContext = getCurrentContext();
	var result = cContext.SETTINGS ? cContext.SETTINGS[which] : false;
	
	if( !result ){
		result = defaultValue;
	}
	
	return( result );
}

CURRENTCONTEXT.getString = function(which){
	var cContext = getCurrentContext();
	var result = cContext.LANGUAGE ? cContext.LANGUAGE.translation[which] : false;
	if( !result ){
		result = which;
	}
	
	return( result );
}

CURRENTCONTEXT.getLocale = function(which,defaultValue){
	var cContext = getCurrentContext();
	var result = cContext.LANGUAGE ? cContext.LANGUAGE.locale[which]: false;
	
	if( !result ){
		result = defaultValue;
	}
	
	return( result );
}

CURRENTCONTEXT.getHelp = function(which){
	var cContext = getCurrentContext();
	var result = cContext.LANGUAGE ? cContext.LANGUAGE.help[which] : false;
	
	return( result );
}

CURRENTCONTEXT.checkAuthentication = function(callback){
		var cContext = getCurrentContext();
		var service = cContext.getDataService(cContext.getSetting("authUrl"),callback);
	
		service.get();
}

CURRENTCONTEXT.init = function(defaultLanguage) {
	var cContext = getCurrentContext();

	var doLater = function(response){
			cContext.SETTINGS = response;
			cContext.loadLanguage(defaultLanguage);
	}
	
	var service = cContext.getDataService("conf/jsclosures.json",doLater);
	
	service.get();
}

CURRENTCONTEXT.loadLanguage = function(languageId){
	var cContext = getCurrentContext();
	var language = cContext.getSetting("language");
	
	if( language ){
		var doLater = function(response){
				cContext.LANGUAGE = response;
				cContext.start();
		}
	
		var service = cContext.getDataService("conf/" + languageId + "/translations.json",doLater);
		
		service.get();
	}
}

CURRENTCONTEXT.start = function(defaultView) {
		var cContext = getCurrentContext();
		cContext.viewChildren = cContext.getSetting("viewChildren");
		var viewToStart = false;
		
		if( cContext.viewChildren ){
			if( !defaultView && cContext.viewChildren.length > 0 ){
				defaultView = cContext.viewChildren[0].id;
			}
			
			for(var i = 0;i < cContext.viewChildren.length;i++){
				var tViewChild = cContext.viewChildren[i];
				tViewChild.lifecycle = cContext.getLifeCycle();
				
				if( tViewChild.id === defaultView ){
					viewToStart = tViewChild;
				}
			}
			
			if( viewToStart ){
				viewToStart.lifecycle.init(viewToStart);
				cContext.currentView = viewToStart.id;
			}
		}
}

CURRENTCONTEXT.stop = function() {
	  var cContext = getCurrentContext();
		
		if( cContext.viewChildren ){
			for(var i = 0;i < cContext.viewChildren.length;i++){
				var tViewChild = cContext.viewChildren[i];
				tViewChild.lifecycle.stop();
			}
		}
}

CURRENTCONTEXT.destroy = function() {
		var cContext = getCurrentContext();
		
		if( cContext.viewChildren ){
			for(var i = 0;i < cContext.viewChildren.length;i++){
				var tViewChild = cContext.viewChildren[i];
				tViewChild.lifecycle.destroy();
			}
		}
}

CURRENTCONTEXT.getViewContext = function(viewId) {
	  var cContext = getCurrentContext();
		var result = false;
		
		if( cContext.viewChildren ){
			for(var i = 0;i < cContext.viewChildren.length;i++){
				if( cContext.viewChildren[i].id === viewId ){
					result = cContext.viewChildren[i];
					break;
				}
			}
		}
		
		return( result );
}

CURRENTCONTEXT.getDataService = function(target, callback){
               
	var userService = {};
	
	userService.get = function(query, queryOptions)
	{
	 return dojo.xhrGet({
		 url:target,
		 handleAs:'json',
		 content:{
			 query:query,
			 queryOptions:queryOptions
		 },
		 load: function(data){
				 callback(data);
		}
	 });
	}

	userService.target = target;
  
	 userService.put = function(jsonData)  //
	 {			   
		 var put_data = dojo.toJson(jsonData);
		 return dojo.xhrPut({
			 url: target,
			 headers: { "Content-Type": "application/json", "Accept" : "application/json"},
			 load: function(data){
				 callback(data);
			 },
			 handleAs:'json',
			 putData:put_data
		 });
			   
	 }
	
	 userService.post = function( jsonData )
	 {
		 var post_data = dojo.toJson(jsonData);
		 return dojo.xhrPost({
			 headers: { "Content-Type": "application/json", "Accept" : "application/json"},
			 url:this.target,
			 load: function(data){
				 callback(data);
			 },
			 handleAs:'json',
			 postData: post_data
		 });
	
	 }
	
	 userService['delete'] = function(changingObj,jsonData)
	 {
		  var post_data = dojo.toJson(jsonData);
		  
		 return dojo.xhrDelete({
			 url:target,
			 headers: { "Content-Type": "application/json", "Accept" : "application/json"},
			 load: function(data){
				 callback(data);
			 },
			 handleAs:'json',
			 postData: post_data
		 });
	 }
	
	 return userService;
}	 

CURRENTCONTEXT.getLifeCycle = function(){
	var result = {initialized: false};
	result.connectorList = new Array();
	result.childList = new Array();
	
	result.init = function(viewInfo){
		var cContext = getCurrentContext();
		cContext.writeLog(1,"init: " + viewInfo.id);
		result.id = viewInfo.id;
		result.name = viewInfo.name;
		result.initialized = true;
		
		if( result.preInit ){
			result.preInit(result,viewInfo);
		}
		
		require(viewInfo.includes, 
         function(){
         		var ev = function(e){
                return( dojo.eval(e) );
            }
            ev(viewInfo.buildWith)(result);
            
            if( result.postInit ){
							result.postInit(result,viewInfo);
						}
         }
		);
	}
	
	result.start = function(doActions){
		var cContext = getCurrentContext();
		cContext.writeLog(1,"start: " + result.id);
		if( result.preStart ){
			result.preStart(result,doActions);
		}
		
		var mainContainer = dojo.byId(result.id);
    dojo.style(mainContainer,"z-index","100"); 
    
    if( result.postStart ){
			result.postStart(result,doActions);
		}

		cContext.clearPendingActions();
		
		cContext.setBusy(false);
	}
	
	result.stop = function(){
		var cContext = getCurrentContext();
		cContext.writeLog(1,"stop: " + result.id);
		if( result.preStop ){
			result.preStop(result);
		}
		
		var mainContainer = dojo.byId(result.id);
    dojo.style(mainContainer,"z-index","-100"); 
    
    if( result.postStop ){
			result.postStop(result);
		}
	}
	
	result.destroy = function(){
		var cContext = getCurrentContext();
		cContext.writeLog(1,"destroy: " + result.id);
		//maybe use the "predestroy" as a prefix to find all methods that you do 
		if( result.preDestroy ){
			result.preDestroy(result);
		}
				
		if( this.connectorList ){
			for(var i = 0;i < this.connectorList.length;i++){
				cContext.deregisterEventHandler(this.connectorList[i]);
			}
		}
		
		if( this.childList ){
			for(var i = 0;i < this.childList.length;i++){
				var tChild = this.childList[i];
				
				if( result.preChildDestroy ){
					result.preChildDestroy(result,tChild);
				}
				
				if( tChild.type === "DOM" ){
					dojo.destroy(tChild.id);
				}
				else {

				}
				
				if( result.postChildDestroy ){
					result.postChildDestroy(result,tChild);
				}
			}
		}
		
		if( result.postDestroy ){
			result.postDestroy(result);
		}
	}
	
	result.addConnector = function(connector){
		this.connectorList.push(connector);
	}
	
	result.addChild = function(child){
		this.childList.push(child);
	}
	
	result.getChildList = function(){
		return( this.childList );	
	}
	
	result.getConnectorList = function(){
		return( this.connectorList );	
	}

	result.setTarget = function(obj){
		if( result.preSetTarget ){
			result.preSetTarget(result);
		}

		result.target = obj;

		if( result.postSetTarget ){
			result.postSetTarget(result,obj);
		}
	}
	
	return( result );
}

CURRENTCONTEXT.indexOf= function(aList, fieldName, matchValue) {
    var result =  - 1;

    if (aList) {
        var matchStr = typeof matchValue != 'string' ? "" + matchValue : matchValue;
        for (var i = 0;i < aList.length;i++) {
            if ( matchStr == aList[i][fieldName] ) {
                result = i;
                break;
            }
        }
    }
    return (result);
}
CURRENTCONTEXT.indexOfString = function(aList, matchValue) {
    var result =  - 1;

    if (aList) {
        var matchStr = typeof matchValue != 'string' ? "" + matchValue : matchValue;
        for (var i = 0;i < aList.length;i++) {
            if ( matchStr == aList[i] ) {
                result = i;
                break;
            }
        }
    }
    return (result);
}

CURRENTCONTEXT.indexInString = function(str,find) {
  return new RegExp(find, 'g').test(str);
}

CURRENTCONTEXT.replaceAll = function(str,find, replace) {
  return str ? str.replace(new RegExp(find, 'g'), replace) : "";
}


CURRENTCONTEXT.writeLog = function(level,message){
	if( console && console.log ){
		console.log(message);
	}
}

CURRENTCONTEXT.anyWidgetById = function(widgetName)
{
     var result = dijit.byId(widgetName);

     if (!result)
          result = dojo.byId(widgetName);

     return (result);
}

CURRENTCONTEXT.busyDialog;
CURRENTCONTEXT.runningTransport = false;
CURRENTCONTEXT.isBusy = false;

CURRENTCONTEXT.setBusy = function(mode, message) {
    var cContext = getCurrentContext();
    var statusContainer = cContext.statusContainerName ? cContext.anyWidgetById(cContext.statusContainerName) : false;

    
    if (mode) {
        if (cContext.busyDialog == null) {
            cContext.busyDialog = document.createElement('div');
            cContext.busyDialog.setAttribute('id', 'busydialog');
            cContext.busyDialog.style.visibility = 'hidden';
            cContext.busyDialog.style.display = 'none';
            document.body.appendChild(cContext.busyDialog);
        }
        var tContent = '<table width="100%" height="100%" cellspacing=0 cellpadding=0><tr>';
        tContent += '<td width="100%" align="center" style="background: #C8C8C8;color: #000;">' + message;
        tContent += '...</td></tr>';
        tContent += '<td width="100%" align="center" style="background: #C8C8C8;"><img src=\"img/progress.gif\" width=180 height=20></td></tr>';
        
        tContent += '</table>';
        
        cContext.busyDialog.innerHTML = tContent;
        cContext.runningTransport = true;

        setTimeout(cContext.showDialog, cContext.busyDialogTimeout);
        
        if( statusContainer && statusContainer.lifecycle && statusContainer.lifecycle.setData ){
            statusContainer.lifecycle.setData({message: message});
        }
    }
    else {
        cContext.runningTransport = false;
        cContext.busyDialog.style.visibility = 'hidden';
        cContext.busyDialog.style.display = 'none';
        if( statusContainer && statusContainer.lifecycle && statusContainer.lifecycle.setData ){
            statusContainer.lifecycle.setData({message: ""});
        }
    }

    cContext.isBusy = mode;
}

CURRENTCONTEXT.setImmediateBusy = function(mode, message) {
    var cContext = getCurrentContext();
    
    if (mode) {
        if (cContext.busyDialog == null) {
            cContext.busyDialog = document.createElement('div');
            cContext.busyDialog.setAttribute('id', 'busydialog');
            cContext.busyDialog.style.visibility = 'hidden';
            cContext.busyDialog.style.display = 'none';
            document.body.appendChild(cContext.busyDialog);
        }

        cContext.busyDialog.innerHTML = '<table width="100%" height="100%"><tr><td width="100%" height="100%" align="center">' + message + '...' + '</td></tr></table>';
        cContext.runningTransport = true;
        cContext.showDialog();
    }
    else {
        cContext.runningTransport = false;
        cContext.busyDialog.style.visibility = 'hidden';
        cContext.busyDialog.style.display = 'none';

    }

    cContext.isBusy = mode;

    return (cContext.isBusy);
}

CURRENTCONTEXT.showDialog = function() {
    var cContext = getCurrentContext();
    
    if (cContext.runningTransport) {
        var top = (cContext.screenHeight - 100) / 2;
        var left = (cContext.screenWidth - 200) / 2;

        cContext.busyDialog.style.width = '200px';
        cContext.busyDialog.style.height = '100px';
        cContext.busyDialog.style.left = left + 'px';
        cContext.busyDialog.style.top = top + 'px';
        cContext.busyDialog.style.background = 'gray';
        cContext.busyDialog.style.border = '3px outset gray';
        cContext.busyDialog.style.position = 'absolute';
        cContext.busyDialog.style.visibility = 'visible';
        cContext.busyDialog.style.display = 'inline';
        cContext.busyDialog.style.color = 'white';
        cContext.busyDialog.style["z-index"] = 1000;
    }
}

CURRENTCONTEXT.connectToGeoLocation = function(){
		var cContext = getCurrentContext();
    
    if( navigator.geolocation ){
        cContext.GeoLocation = {enabled: true,
                                        successCallback: function(data){
                                            //console.log("gps data callback: " + data);
                                            cContext.GeoLocation.position = data;
                                            doGeoLocation(cContext.getSetting("mapGeoLocation").successDelay);
                                        },
                                        failureCallback: function(data){
                                            //console.log("gps failure callback: " + data);
                                            doGeoLocation(cContext.getSetting("mapGeoLocation").failureDelay);
                                        }
                                        };
                                        
        cContext.doGeoLocation(cContext.getSetting("mapGeoLocation").startDelay);
    }
}

CURRENTCONTEXT.doGeoLocation = function(delay){
    var cContext = getCurrentContext();
    if( navigator.geolocation ){
        var doLater = function(){
            var options = {maximumAge:cContext.getSetting("mapGeoLocation").maximumAge,timeout: cContext.getSetting("mapGeoLocation").timeout};
            
            navigator.geolocation.getCurrentPosition(cContext.GeoLocation.successCallback,
                                                     cContext.GeoLocation.failureCallback,
                                                     options);
        }
        
        setTimeout(doLater,delay);
    }
}

CURRENTCONTEXT.mergeObjects = function(a,b){
  return( dojo.mixin(a,b) );
}

//real time messaging
CURRENTCONTEXT.publishToRTM = function(message){
    var cContext = getCurrentContext();
    var cometd = cContext.cometd;
    cometd.publish(cContext.RTMChannel,{
        "text": message,
        "user": cContext.alias,
        "channel": cContext.RTMChannel
    });
}
CURRENTCONTEXT.connectToRTM = function(){
    var cContext = getCurrentContext();
    try{
        cContext._connectToRTM();
    }
    catch(exp){
        cContext.writeLog(1,"rtm error: " + exp);
    }
}

CURRENTCONTEXT._connectToRTM = function(){
		var cContext = getCurrentContext();
    
    if( cContext.rtmenabled ){
        var cometd = cContext.cometd;
        
        var origin = '';
        
        if( window.location.origin && window.location.origin.indexOf("ws:") == -1 )
            origin = window.location.origin;
        else {
            origin = window.location.protocol + "//" + window.location.host;
        }
        
        cometd.configure({
            url: origin + cContext.getSetting("baseUrl") + '/cometd',
            logLevel: 'info'
        });
        

        var cometdListener = cometd.addListener('/meta/handshake', function(message)
        {
            if (message.successful)
            {
                //console.log("success handshake");
               
                if( !cContext.RTMIsConnected ){
                    
                    
                    var cometdSubscription = cometd.subscribe(cContext.RTMChannel, function(subMsg) {
                        //console.log("/zen/app subscription callback");
                        cContext.lastMessage = subMsg;
                        if(subMsg){
                            cContext.notifyMessageInbound(subMsg);
                        } 
                        else {
                            cContext.writeLog(1,"Response contained no message");
                        }
                     
                        return( true );
                    });
                    
                    cContext.RTMIsConnected = true;
                }
            }
            else
            {
                cContext.RTMIsConnected = false;

            }
        });
        //need to tear down listern
        //cometd.removeListener(cometdListener);
        //cometd.unsubscribe(cometdSubscription);
        
        cContext.cometdListener = cometdListener;
    
    
        cometd.handshake();
    }
}

CURRENTCONTEXT.connectToPrivateChannel = function(channelName,callback){
    var cContext = getCurrentContext();
    
    if( cContext.rtmenabled && cContext.RTMIsConnected  ){
        var cometdSubscription = cContext.cometd.subscribe(channelName,callback );
        if( !cContext.RTMPrivateChannelList ){
            cContext.RTMPrivateChannelList = {};
        }
        if( !cContext.RTMPrivateChannelList.hasOwnProperty(channelName) )
            cContext.RTMPrivateChannelList[channelName] = cometdSubscription;
    }
}

CURRENTCONTEXT.disconnectFromPrivateChannel = function(channelName){
    var cContext = getCurrentContext();
    cContext.cometd.unsubscribe(getCurrentContext().RTMPrivateChannelList[channelName]);
    delete cContext.RTMPrivateChannelList[channelName];
}

CURRENTCONTEXT.publishToPrivateRTM = function(channelName,message){
    var cContext = getCurrentContext();
    var cometd = cContext.cometd;
    cometd.publish(channelName,{
        "text": message,
        "user": cContext.alias,
        "channel": channelName
    });
}

CURRENTCONTEXT.registerRTMessageListener = function(listener){
    var cContext = getCurrentContext();
    
    var listenerCache = cContext.messageListener;
    
    if( !listenerCache ){
      listenerCache = new Array();
      cContext.messageListener = listenerCache;
    }
    
    listenerCache.push(listener);
}


CURRENTCONTEXT.notifyMessageInbound = function(msg){
var cContext = getCurrentContext();
    
    var listenerCache = cContext.messageListener;

    if( msg.data ){
        if( listenerCache ){
          for(var i = 0;i < listenerCache.length;i++){
            var listener = listenerCache[i];
            
            if( listener && listener.lifecycle && listener.lifecycle.messageNotify ){
              listener.lifecycle.messageNotify(msg);
            }
          }
        }
    }
}

CURRENTCONTEXT.findWidgetById = function(widgetId){
	return( dojo.byId(widgetId) );
}

CURRENTCONTEXT.applyStyleToWidget = function(widget,newStyle){
	dojo.style(widget, newStyle);
}


CURRENTCONTEXT.getElementWidth = function(elem) {
    var style = window.getComputedStyle(elem);
    return elem.offsetWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - parseFloat(style.borderLeft) - parseFloat(style.borderRight) - parseFloat(style.marginLeft) - parseFloat(style.marginRight);
}

CURRENTCONTEXT.getElementHeight = function(elem) {
    var style = window.getComputedStyle(elem);
    return elem.offsetHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom) - parseFloat(style.borderTop) - parseFloat(style.borderBottom) - parseFloat(style.marginTop) - parseFloat(style.marginBottom);
}

CURRENTCONTEXT.getElementDimensions = function(elem){
	var result = {};
	var cContext = getCurrentContext();
    
	result.width = cContext.getElementWidth(elem);
	result.height = cContext.getElementHeight(elem);

	return( result );
}

CURRENTCONTEXT.buildWidget = function(viewLifecycle,container,args){
	var itemName = args.id;
	var type = args.type;
	var result = false;

	if( type === "input" ) {
		var itemLabel = dojo.create("label");
	     itemLabel.id = itemName + "label"
	     itemLabel.className = args.labelClassName ? args.labelClassName : "label";
	     itemLabel.for = itemName;
	     itemLabel.innerHTML = args.itemLabel;
	     
	     container.appendChild(itemLabel);
	     
	     viewLifecycle.addChild({type: "DOM",id: itemLabel.id});

	     var newInput = document.createElement("input");
	     newInput.id = itemName;
	     newInput.className =  args.className ? args.className : "input";
	     newInput.type = args.itemType;
	     
	     container.appendChild(newInput);
	     result = newInput;
	}
	else if( type === "button" ) {
		var newButton = dojo.create(args.itemType ? args.itemType : "div");
	     newButton.id = itemName;
	     if( args.className ){
	     	newButton.className = args.className;
	     }
	     
	     if( args.itemLabel ){
	     	newButton.innerHTML = args.itemLabel;
	     }

	     container.appendChild(newButton);
	     
	     viewLifecycle.addChild({type: "DOM",id: newButton.id});
	     
	     newButton.onclick = args.onClick;
	     result = newButton;
	}
	else if( type === "container" ) {
		var newContainer = dojo.create(args.itemType ? args.itemType : "div");
	     newContainer.id = itemName;
	     if( args.className ){
	     	newContainer.className = args.className;
	     }

		 if( args.style ){
		 	newContainer.style = args.style;
		 }

		 if( args.innerHTML ){
		 	newContainer.innerHTML = args.innerHTML;
		 }
	
	     container.appendChild(newContainer);
	     
	     viewLifecycle.addChild({type: "DOM",id: newContainer.id});

	     result = newContainer;
	}

	return( result );
}