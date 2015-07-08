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
	    
	     var mainContainer = dojo.byId(cContext.mainId);
	     
	     var newDiv = dojo.create("div");
	     newDiv.id = viewLifecycle.id;
	     newDiv.className = "view";
	
	     mainContainer.appendChild(newDiv);
	     
	     viewLifecycle.addChild({type: "DOM",id: newDiv.id});

	     var newForm = dojo.create("div");
	     newForm.id = viewLifecycle.id + "form";
	     newForm.className = "form";
	
	     newDiv.appendChild(newForm);
	     
	     viewLifecycle.addChild({type: "DOM",id: newForm.id});

	     var inputLabel = dojo.create("label");
	     inputLabel.id = viewLifecycle.id + "name" + "label"
	     inputLabel.className = "label";
	     inputLabel.for = viewLifecycle.id + "name";
	     inputLabel.innerHTML = cContext.getString("USERNAME");
	     
	     newForm.appendChild(inputLabel);
	     
	     viewLifecycle.addChild({type: "DOM",id: inputLabel.id});

	     var newInput = dojo.create("input");
	     newInput.id = viewLifecycle.id + "name";
	     newInput.className = "input";
	     newInput.type = "text";
	     
	     newForm.appendChild(newInput);
	     
	     viewLifecycle.addChild({type: "DOM",id: newInput.id});

	     var inputLabel = dojo.create("label");
	     inputLabel.id = viewLifecycle.id + "pwd" + "label";
	     inputLabel.className = "label";
	     inputLabel.for = viewLifecycle.id + "pwd";
	     inputLabel.innerHTML = cContext.getString("PASSWORD");
	     
	     newForm.appendChild(inputLabel);
	     
	     viewLifecycle.addChild({type: "DOM",id: inputLabel.id});

	     var newInput = dojo.create("input");
	     newInput.id = viewLifecycle.id + "pwd";
	     newInput.className = "input";
	     newInput.type = "password";
	     
	     newForm.appendChild(newInput);
	     
	     viewLifecycle.addChild({type: "DOM",id: newInput.id});
	     
	     var controlPanel = dojo.create("div");
	     controlPanel.id = viewLifecycle.id + "controlpanel";
	     controlPanel.className = "logincontrolpanel";
	     
	     newForm.appendChild(controlPanel);
	     
	     viewLifecycle.addChild({type: "DOM",id: controlPanel.id});
	     
	     var newButton = dojo.create("div");
	     newButton.id = viewLifecycle.id + "button";
	     newButton.className = "button";
	     newButton.innerHTML = cContext.getString("LOGIN");
	     
	     controlPanel.appendChild(newButton);
	     
	     viewLifecycle.addChild({type: "DOM",id: newButton.id});
	     
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
	     
	     var tConnect = getCurrentContext().registerEventHandler(newButton,"click",clickAction);
	     
	     viewLifecycle.addConnector(tConnect);
	     
	     
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
	    
	     var mainContainer = dojo.byId(cContext.mainId);
	     
	     var newDiv = dojo.create("div");
	     newDiv.id = viewLifecycle.id;
	     newDiv.className = "view";
	
	     mainContainer.appendChild(newDiv);
	     
	     viewLifecycle.addChild({type: "DOM",id: newDiv.id});

	     var newForm = dojo.create("div");
	     newForm.id = viewLifecycle.id + "form";
	     newForm.className = "form";
	
	     newDiv.appendChild(newForm);
	     
	     viewLifecycle.addChild({type: "DOM",id: newForm.id});

	     var gridPanel = dojo.create("div");
		gridPanel.id = viewLifecycle.id + "panel";
		gridPanel.className = "gridpanel";
	
		newForm.appendChild(gridPanel);
		viewLifecycle.addChild({type: "DOM",id: gridPanel.id});

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

		var newFilter = dojo.create("div");
		newFilter.id = viewLifecycle.id + "filter";
		newFilter.innerHTML = tabFilter;
		newFilter.className = "filtercontainer";
	
		gridPanel.appendChild(newFilter);
		viewLifecycle.addChild({type: "DOM",id: newFilter.id});

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

		var newGridContainer = dojo.create("div");
		newGridContainer.id = gridName + "container";
		newGridContainer.className = "gridlistcontainer";
	
		gridPanel.appendChild(newGridContainer);
		viewLifecycle.addChild({type: "DOM",id: newGridContainer.id});

		var newGridWrapper = dojo.create("div");
		newGridWrapper.id = gridName + "wrapper";
		newGridWrapper.className = "gridlist";
	
		newGridContainer.appendChild(newGridWrapper);
		viewLifecycle.addChild({type: "DOM",id: newGridWrapper.id});

		var newGrid = dojo.create("ul");
		newGrid.id = gridName;
		newGrid.className = "gridlist";
	
	
		newGridWrapper.appendChild(newGrid);
		viewLifecycle.addChild({type: "DOM",id: newGrid.id});

		var controlPanel = dojo.create("div");
	     controlPanel.id = gridName+ "controlpanel";
	     controlPanel.className = "gridcontrolpanel";
	     
	     gridPanel.appendChild(controlPanel);
	     
	     viewLifecycle.addChild({type: "DOM",id: controlPanel.id});

		var previousButton = dojo.create("div");
	     previousButton.id = viewLifecycle.id + "previousbutton";
	     previousButton.className = "previousbutton";
	     previousButton.innerHTML = cContext.getString("PREVIOUS");
	     
	     controlPanel.appendChild(previousButton);
	     
	     viewLifecycle.addChild({type: "DOM",id: previousButton.id});
	     
	     var previousClickAction = function(evt){
	     		console.log("previous");
	     		if( gridState.start > 0 ){
	     			gridState.start = gridState.start - gridState.rows;
	     			loadGridData(gridState.code);
	     		}
	     }
	     
	     var tConnect = getCurrentContext().registerEventHandler(previousButton,"click",previousClickAction);
	     
	     viewLifecycle.addConnector(tConnect);


	     var nextButton = dojo.create("div");
	     nextButton.id = viewLifecycle.id + "nextbutton";
	     nextButton.className = "nextbutton";
	     nextButton.innerHTML = cContext.getString("NEXT");
	     
	     controlPanel.appendChild(nextButton);
	     
	     viewLifecycle.addChild({type: "DOM",id: nextButton.id});
	     
	     var nextClickAction = function(evt){
	     		console.log("next");
	     		gridState.start = gridState.start + gridState.rows;
	     		loadGridData(gridState.code);
	     }
	     
	     var tConnect = getCurrentContext().registerEventHandler(nextButton,"click",nextClickAction);
	     
	     viewLifecycle.addConnector(tConnect);

	     var mainControlPanel = dojo.create("div");
	     mainControlPanel.id = viewLifecycle.id + "controlpanel";
	     mainControlPanel.className = "maincontrolpanel";
	     
	     gridPanel.appendChild(mainControlPanel);
	     
	     viewLifecycle.addChild({type: "DOM",id: mainControlPanel.id});
	     
	     var newButton = dojo.create("div");
	     newButton.id = viewLifecycle.id + "button";
	     newButton.className = "button";
	     newButton.innerHTML = cContext.getString("LOGOUT");
	     
	     mainControlPanel.appendChild(newButton);
	     
	     viewLifecycle.addChild({type: "DOM",id: newButton.id});
	     
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
	     
	     var tConnect = getCurrentContext().registerEventHandler(newButton,"click",clickAction);
	     
	     viewLifecycle.addConnector(tConnect);
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
     							newListItem = dojo.create("li");
								newListItem.id = gridName + i;
								//newListItem.className = "gridlist";
	
								grid.appendChild(newListItem);
								viewLifecycle.addChild({type: "DOM",id: newListItem.id});

								var newListItemClick = dojo.create("a");
								newListItemClick.id = gridName + i + "click";
								newListItemClick.className = "gridlist";
								newListItemClick.onclick = handleItemClick;
	
								newListItem.appendChild(newListItemClick);
								viewLifecycle.addChild({type: "DOM",id: newListItemClick.id});

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
    var filterConfig = getCurrentContext().findWidgetById(tabFilterName).tabConfig;
    var filterList = filterConfig.filterList;

    for (var i = 0;i < filterList.length;i++) {
        var tItem = dojo.byId(filterList[i].id);
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

        dojo.style(tItem, newStyle);
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
	    
	     var mainContainer = dojo.byId(cContext.mainId);
	     
	     var newDiv = dojo.create("div");
	     newDiv.id = viewLifecycle.id;
	     newDiv.className = "view";
	
	     mainContainer.appendChild(newDiv);
	     
	     viewLifecycle.addChild({type: "DOM",id: newDiv.id});

	     var newForm = dojo.create("div");
	     newForm.id = viewLifecycle.id + "form";
	     newForm.className = "form";
	
	     newDiv.appendChild(newForm);
	     
	     viewLifecycle.addChild({type: "DOM",id: newForm.id});

	     var parentDimension = cContext.getElementDimensions(newForm);
	     console.log(parentDimension);

	     var mapName = viewLifecycle.id + "map";
	     var mapPadX = 0;
	     var mapPadY = 0;
	     var mapContainer = dojo.create("div");
	     mapContainer.id = mapName;
	     mapContainer.className = "mapView";
	     mapContainer.style.padding = "0px";
	     mapContainer.style.width = "100%";
	     mapContainer.style.height = "100%";
	
	     newForm.appendChild(mapContainer);
	     
	     viewLifecycle.addChild({type: "DOM",id: mapContainer.id});
	     
	     
	     var controlPanel = dojo.create("div");
	     controlPanel.id = viewLifecycle.id + "controlpanel";
	     controlPanel.className = "maincontrolpanel";
	     
	     newForm.appendChild(controlPanel);
	     
	     viewLifecycle.addChild({type: "DOM",id: controlPanel.id});
	     
	     var newButton = dojo.create("div");
	     newButton.id = viewLifecycle.id + "button";
	     newButton.className = "button";
	     newButton.innerHTML = cContext.getString("BACK");
	     
	     controlPanel.appendChild(newButton);
	     
	     viewLifecycle.addChild({type: "DOM",id: newButton.id});
	     
	     var clickAction = function(evt){
	     	var doLater = function(response){
	     		if( true ){
	     			getCurrentContext().setCurrentView("main");
	     		}
	     	}
	     	doLater();
	     }
	     
	     var tConnect = getCurrentContext().registerEventHandler(newButton,"click",clickAction);
	     
	     viewLifecycle.addConnector(tConnect);

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
          
          map = new google.maps.Map(dojo.byId(mapName),{
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
