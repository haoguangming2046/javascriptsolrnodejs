function buildLoginPage(viewLifecycle) {
	require([], 
	   function(){
	   		internalBuildLoginPage(viewLifecycle);
	   }
	);
}

function internalBuildLoginPage(viewLifecycle){
		
		function buildView(){
			var cContext = getCurrentContext();
	    
	     var mainContainer = cContext.findWidgetById(cContext.mainId);

	     var newDiv = cContext.buildWidget(viewLifecycle,mainContainer,{type: "container",className: "view",id: viewLifecycle.id});
	   
	     var newForm = cContext.buildWidget(viewLifecycle,newDiv,{type: "container",className: "form",id: viewLifecycle.id + "form"});

	     var newInput = cContext.buildWidget(viewLifecycle,newForm,{type: "input",className: "input",labelClassName: "label",id: viewLifecycle.id + "name",itemType: "input",itemLabel: cContext.getString("USERNAME")});

	     var newInput = cContext.buildWidget(viewLifecycle,newForm,{type: "input",className: "input",labelClassName: "label",id: viewLifecycle.id + "pwd",itemType: "password",itemLabel: cContext.getString("PASSWORD")});

	     var controlPanel = cContext.buildWidget(viewLifecycle,newForm,{type: "container",className: "logincontrolpanel",id: viewLifecycle.id + "controlpanel"});
	     
	     var clickAction = function(evt){
	     	var doLater = function(response){
	     		if( response.status ){
	     			getCurrentContext().setCurrentView("main");
	     			getCurrentContext().alias = response.alias;
	     		}
	     	}
	     	var cContext = getCurrentContext();
			
	     	var userName = cContext.findWidgetById(viewLifecycle.id + "name").value;
	     	var userKey = cContext.findWidgetById(viewLifecycle.id + "pwd").value;
	     	cContext.findWidgetById(viewLifecycle.id + "pwd").value = "";

	     	var service = cContext.getDataService(cContext.getSetting("loginUrl") + "&username=" + userName + "&userkey=" + userKey,doLater);
		
			service.get();
	     }

	     var newButton = cContext.buildWidget(viewLifecycle,controlPanel,{type: "button",className: "button",id: viewLifecycle.id + "button",itemLabel: cContext.getString("LOGIN"),onClick: clickAction});

	     viewLifecycle.start();
	  }
	  
	  buildView();
}


function buildMainPage(viewLifecycle) {
	require([], 
	   function(){
	   		internalBuildMainPage(viewLifecycle);
	   }
	);
}

function internalBuildMainPage(viewLifecycle){
			
		function buildView(){
			var cContext = getCurrentContext();
	    
	     var mainContainer = cContext.findWidgetById(cContext.mainId);
	     
	     var newDiv = cContext.buildWidget(viewLifecycle,mainContainer,{type: "container",className: "view",id: viewLifecycle.id});
	   
	     var newForm = cContext.buildWidget(viewLifecycle,newDiv,{type: "container",className: "form",id: viewLifecycle.id + "form"});

		var gridPanel = cContext.buildWidget(viewLifecycle,newForm,{type: "container",className: "gridpanel",id: viewLifecycle.id + "panel"});


	     var tabFilterName = viewLifecycle.id + "filter";

		var filterList = new Array();
		for (var i = 0;i < 26;i += 2) {
			var tLabel = String.fromCharCode(97 + i) + "-" + String.fromCharCode(97 + (i + 1));
			var tCode =  String.fromCharCode(97 + i) + "*+OR+" + String.fromCharCode(97 + (i + 1)) + "*";

			filterList.push( {
				id : tabFilterName + i, label : tLabel, 
				class  : i == 0 ? "protoAtoZTab" : "protoAtoZTab", code : tCode
			});
		}
		var currentFilter = filterList[0].code;

		var filterConfig = {
			parentId : tabFilterName, filterList : filterList, onClickHandler : "tabClick"
		};

		var tabFilter = protoAtoZPicker(filterConfig);


		var newFilter = cContext.buildWidget(viewLifecycle,gridPanel,{type: "container",className: "filtercontainer",id: viewLifecycle.id + "filter",innerHTML: tabFilter});
	   

		newFilter.tabClick = function(code) {
			console.log("code: " + code);
			currentFilter = code;
			getCurrentContext().findWidgetById(tabFilterName).tabCode = code;
			hiliteAtoZTab(tabFilterName,code);
			gridState.start = 0;
			loadGridData(code);
		}
		newFilter.tabConfig = filterConfig;

		var gridName = viewLifecycle.id + "grid";
		var gridState = {start: 0,rows: 10,code: filterList[0].code,children: 0};

		var newGridContainer = cContext.buildWidget(viewLifecycle,gridPanel,{type: "container",className: "gridlistcontainer",id: viewLifecycle.id + "container"});
	   
		var newGridWrapper = cContext.buildWidget(viewLifecycle,newGridContainer,{type: "container",className: "gridlist",id: viewLifecycle.id + "wrapper"});

		var newGrid = cContext.buildWidget(viewLifecycle,newGridWrapper,{type: "container",className: "gridlist",id: gridName,itemType: "ul"});

	     var controlPanel = cContext.buildWidget(viewLifecycle,gridPanel,{type: "container",className: "gridcontrolpanel",id: gridName + "controlpanel"});
	     
	     var previousClickAction = function(evt){
	     		console.log("previous");
	     		if( gridState.start > 0 ){
	     			gridState.start = gridState.start - gridState.rows;
	     			loadGridData(gridState.code);
	     		}
	     }
	     
	     var previousButton = cContext.buildWidget(viewLifecycle,controlPanel,{type: "button",className: "previousbutton",id: viewLifecycle.id + "previousbutton",itemLabel: cContext.getString("PREVIOUS"),onClick: previousClickAction});
	     
	     var nextClickAction = function(evt){
	     		console.log("next");
	     		gridState.start = gridState.start + gridState.rows;
	     		loadGridData(gridState.code);
	     }
	     

	     var nextButton = cContext.buildWidget(viewLifecycle,controlPanel,{type: "button",className: "nextbutton",id: viewLifecycle.id + "nextbutton",itemLabel: cContext.getString("NEXT"),onClick: nextClickAction});

	     var mainControlPanel = cContext.buildWidget(viewLifecycle,gridPanel,{type: "container",className: "maincontrolpanel",id: viewLifecycle.id + "controlpanel"});
	     
	     var clickAction = function(evt){
	     		getCurrentContext().setCurrentView("login");
	     		var doLater = function(response){
		     		if( response.status ){
		     			getCurrentContext().setCurrentView("login");
		     			getCurrentContext().alias = false;
		     		}
		     	}

		     	var cContext = getCurrentContext();
				var service = cContext.getDataService(cContext.getSetting("logoutUrl"),doLater);
			
				service.get();
	     }
	     
	     var newButton = cContext.buildWidget(viewLifecycle,mainControlPanel,{type: "button",className: "button",id: viewLifecycle.id + "button",itemLabel: cContext.getString("LOGOUT"),onClick: clickAction});

	     function handleItemClick(evt){
	     	console.log("item: " + this.actualRecord);
	     	if( this.actualRecord ){
	     		var item = this.actualRecord;
	     		var doLater = function(){
	     			console.log("once map pace is laoded: " + item);
	     			 var vContext = getCurrentContext().getViewContext("map");
	     			 if( vContext && vContext.lifecycle.setTarget ){
	     			 	vContext.lifecycle.setTarget(item);
	     			 }
	     		}
	     		getCurrentContext().setCurrentView("map",[doLater]);
	     	}
	     }
	     function loadGridData(code){
	     	var cContext = getCurrentContext();
	     	gridState.code = code;

	     	var doLater = function(data){
	     		console.log(data);
	     		var items = data.items;

	     		if( items ){
	     			gridState.items = items;
	     			var grid = cContext.findWidgetById(gridName);
	     			if( grid ){
	     				for(var i = 0;i < gridState.rows;i++){
	     					var newListItem = cContext.findWidgetById(gridName + i + "click");

     						if( newListItem == null ){
     						

								newListItem = cContext.buildWidget(viewLifecycle,grid,{type: "container",itemType: "li",className: "",id: gridName + i});

								var newListItemClick = cContext.buildWidget(viewLifecycle,newListItem,{type: "button",itemType: "a",className: "",id: gridName + i + "click",onClick: handleItemClick});

								gridState.children++;
								newListItem = newListItemClick;
							}
							if( i < items.length ){
								newListItem.innerHTML = items[i].contenttitle;
								newListItem.actualRecord = items[i];
								newListItem.title = items[i].contenttitle;
							}
							else {
								newListItem.innerHTML = "&nbsp;";
								newListItem.actualRecord = false;
								newListItem.title = "";
							}
							
	     				}

	     				cContext.setBusy(false);
	     			}
	     		}
	     	}

	     	var tUrl = cContext.getRestUrl("CONTENT") + "&wt=json&rows=" + gridState.rows + "&start=" + gridState.start + "&query=contenttype:CONTENT+AND+contenttitle:" + code + "*";

     		var service = cContext.getDataService(tUrl,doLater);
	
			service.get();
			cContext.setBusy(true,"LOADING");
	     }

	     viewLifecycle.postStart = function(viewLifecycle){
	     	newFilter.tabClick(filterConfig.filterList[0].code);
	     }
	     
	     viewLifecycle.start();
	  }


	  
	  buildView();
}

function protoAtoZPicker(config) {
    var result = "<ul class=\"protoAtoZTab\">";
    var filterList = config.filterList;

    for (var i = 0;i < filterList.length;i++) {
        result += "<li id=\"" + filterList[i].id + "\" class=\"" + filterList[i].
        class  + "\" onClick=\"getCurrentContext().findWidgetById('" + config.parentId + "')." + config.onClickHandler + "('" + filterList[i].code + "');\">" + filterList[i].label + "</li>";
    }

    result += "</ul>";

    return (result);
}

function hiliteAtoZTab(tabFilterName,code) {
    var cContext = getCurrentContext();
    var filterConfig = cContext.findWidgetById(tabFilterName).tabConfig;
    var filterList = filterConfig.filterList;

    for (var i = 0;i < filterList.length;i++) {
        var tItem = cContext.findWidgetById(filterList[i].id);
        var newStyle = {
        };
        if (code == filterList[i].code) {
            newStyle.background = "#000";
            newStyle.color = "#fff";
        }
        else {
            newStyle.background = "";
            newStyle.color = "";
        }

        cContext.applyStyleToWidget(tItem, newStyle);
    }
}

function buildMapPage(viewLifecycle) {
	require([], 
	   function(){
	   		internalBuildMapPage(viewLifecycle);
	   }
	);
}

function internalBuildMapPage(viewLifecycle){
		var mainId = viewLifecycle.id;

		function buildView(){
			var cContext = getCurrentContext();
	    
	     var mainContainer = cContext.findWidgetById(cContext.mainId);
	     
	     var newDiv = cContext.buildWidget(viewLifecycle,mainContainer,{type: "container",className: "view",id: viewLifecycle.id});
	   
	     var newForm = cContext.buildWidget(viewLifecycle,newDiv,{type: "container",className: "form",id: viewLifecycle.id + "form"});

	     var parentDimension = cContext.getElementDimensions(newForm);
	     console.log(parentDimension);

	     var mapName = viewLifecycle.id + "map";
	     var mapPadX = 0;
	     var mapPadY = 0;

	     var mapContainer = cContext.buildWidget(viewLifecycle,newForm,{type: "container",className: "mapview",id: mapName});
	   
	     
	     var controlPanel = cContext.buildWidget(viewLifecycle,newForm,{type: "container",className: "maincontrolpanel",id: viewLifecycle.id + "controlpanel"});
	     
	     var clickAction = function(evt){
	     	var doLater = function(response){
	     		if( true ){
	     			getCurrentContext().setCurrentView("main");
	     		}
	     	}
	     	doLater();
	     }
	    
	     var newButton = cContext.buildWidget(viewLifecycle,controlPanel,{type: "button",className: "button",id: viewLifecycle.id + "button",itemLabel: cContext.getString("BACK"),onClick: clickAction});

	     viewLifecycle.postInit = function(lifecycle,viewInfo){
	     	console.log("item in post init: " + viewInfo);
	     	lifecycle.buildMap();
	     }

	     viewLifecycle.postSetTarget = function(lifecycle,item){
	     		console.log("item in post start: " + item);
	     		var cLocation = item.contentlocation.split(",");

	     		var latitude = cLocation[0];
	     		var longitude = cLocation[1];

	     		var cPoint =   new google.maps.LatLng(latitude,longitude);
        var rec = {id: item.id,name: item.contenttitle,location: item.contentlocation,actualRecord: item};
            
        loadPoint(map,cPoint,rec,"past");
	     }

	     viewLifecycle.handleEvent = function(map,cPoint,rec,type){
	     			loadPoint(map,cPoint,rec,type);
	     }
	     
	     viewLifecycle.buildMap = function(){
	     		buildGMap(mapName);
	     }
	     
	     viewLifecycle.start();
	  }

	  function loadPoint(map,cPoint,rec,type){
	  		if( mapLoaded ){
	  				createGMapMarker(map,cPoint,rec,type);
	  		}
	  		else {
	  				queuedPoints = new Array();
	  				queuedPoints.push({map:map,point: cPoint,rec: rec,type: type});
	  		}
	  }

	  var queuedPoints = false;

	  var map = false;
	  var mapLoaded = false;
	  function unqueuePoints(){
	  				console.log("unqueue points");
	  				mapLoaded = true;
	  				if( queuedPoints ){
	  						var qList = queuedPoints;
	  						queuedPoints = false;
	  						for(var i = 0;i < qList.length;i++){
	  								var item = qList[i];
	  								createGMapMarker(map,item.point,item.rec,item.type);
	  						}
	  				}
	  }

	  function buildGMap(mapName){
          //console.log("build map with name " + mapName);
          var cContext = getCurrentContext();
            
          var pos = cContext.GeoLocation ? cContext.GeoLocation.position.coords : {latitude: cContext.getSetting("mapCenterLatitude"),longitude: cContext.getSetting("mapCenterLongitude")};
                    
          var cPoint =   new google.maps.LatLng(pos.latitude,pos.longitude);
          
          map = new google.maps.Map(cContext.findWidgetById(mapName),{
              zoom: cContext.getSetting("mapZoomLevel").default,
              mapTypeId: cContext.getSetting("mapType")[0].value,
              xxmapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU}
          });

          google.maps.event.addListener(map, 'tilesloaded', function() {
										  console.log('Map loaded!');
										   unqueuePoints();
										});
          
          getCurrentContext().mapInfo = { map: map};
        
          
          map.setCenter(cPoint);
          
          return( map );
      }

      function createGMapMarker(map,cPoint,rec,type){
    console.log("rec: " + rec);
      //var cPoint = new google.maps.LatLng(rec.latitude,rec.longitude);
      var result = _createGMapMarker(map,cPoint,rec,type);
    
      return( result );
    }
    
    function handleGMapResize(map){
      google.maps.event.trigger(map, 'resize');
    }
    
    function handleGMapCenter(map,lat,long){
      var doLater = function(){
          var cPoint =   new google.maps.LatLng(lat,long);
          map.setCenter(cPoint);
           
      }
      
      setTimeout( doLater, 200);
    }
    
    function _createGMapMarker(map,point, rec,type) {
        if( map ) {
            var cContext = getCurrentContext();
            
            var html = "<div style=\"width: 200px;height: 120px;color: #000;\"><span>" + cContext.getString("name") + ": " + rec.name + "</span><br/>";
            html += "<span>" + cContext.getString("location") + ": " + rec.location + "</span><br/>";
            html += "</div>";
            
            console.log("point: " + point);
            var shape = {
                              coords: [1, 1, 1, 20, 18, 20, 18 , 1],
                              type: 'poly'
                          };
            var image = {
                            url: cContext.getSetting("imagesPrefix") + (type == 'past' ? "icon_summary.png" : "icon_map.png"),
                            // This marker is 20 pixels wide by 32 pixels tall.
                            size: new google.maps.Size(32, 32),
                            // The origin for this image is 0,0.
                            origin: new google.maps.Point(0,0),
                            // The anchor for this image is the base of the flagpole at 0,32.
                            anchor: new google.maps.Point(0, 32)
                          };
                          
            var markerOptions = {   position: point,
                                    title: rec.name,
                                    xxanimation: google.maps.Animation.DROP,
                                    xxicon: image,
                                    clickable: true
                                };
             
            var marker = new google.maps.Marker(markerOptions);
            
            var infowindow = new google.maps.InfoWindow({
                content: html
            });
            
            google.maps.event.addListener(infowindow, 'closeclick', function() {
                                                                            marker.isOpen = false;
                                                                        });

            
            google.maps.event.addListener(marker, 'click', function() {
                                                                            infowindow.open(map,marker);
                                                                            marker.isOpen = true;
                                                                        });
            
            marker.setMap(map);
            
            return( marker );
        }
        else
            return( false );
    }
	  
	  buildView();
}
