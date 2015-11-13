angular.module('scrappingApp').controller('MappingCtrl', function($scope, $http, $location, $cookies, commonVariables, Base64) {
	
	$scope.headers = commonVariables.getHeaders();				// all file's header info list.
	$scope.parsedData = commonVariables.getParsedData();		// all file's data list.
	$scope.fileNames = commonVariables.getFileNames();			// all file's name list.
	
	$scope.dropdownData = commonVariables.getDropdownData();				// data for all drop down.
	
	$scope.selectedKeyword = commonVariables.getSelectedKeyword();			// selected scrapping keyword for keyword field.
	$scope.selectedKeywordID = commonVariables.getSelectedKeywordID();		// selected scrapping keywordId for keywordId field.
	$scope.selectedWebsite = commonVariables.getSelectedWebsite();			// selected website for scrapping.
	$scope.selectedWebsiteID = commonVariables.getSelectedWebsiteID();		// selected websiteId for scrapping.
	$scope.selectedDepth = commonVariables.getSelectedDepth();				// value for scrapping depth.
	$scope.userEmail = commonVariables.getUserEmail();						// value for scrapping depth.
	
	// getting drop down data from parsed data of all files.
	$scope.init = function() {
		var tmpFileNames = $scope.fileNames;
		
		// loop by file name.
		for (fNIdx = 0; fNIdx < tmpFileNames.length; fNIdx ++) {
			// getting parsed data and header by file name.
			var tmpFileData = $scope.parsedData[tmpFileNames[fNIdx]];
			var tmpFileHeaders = $scope.headers[tmpFileNames[fNIdx]];
			
			// truncate the file name if too long.
			var truncFileName = tmpFileNames[fNIdx].substr(0, tmpFileNames[fNIdx].lastIndexOf('.'));
			if (truncFileName.length > 5) truncFileName = truncFileName.substr(0, 5) + "_" + fNIdx + "_" + "...";
			
			// loop by file header.
			for (fHIdx = 0; fHIdx < tmpFileHeaders.length; fHIdx ++) {
				$scope.dropdownData[truncFileName + "-" + tmpFileHeaders[fHIdx]] = [];
				
				// loop by file row.
				for (fDIdx = 0; fDIdx < tmpFileData.length; fDIdx ++) {
					if (!tmpFileData[fDIdx][tmpFileHeaders[fHIdx]]) {
						$scope.dropdownData[truncFileName + "-" + tmpFileHeaders[fHIdx]].push("");
					} else {
						$scope.dropdownData[truncFileName + "-" + tmpFileHeaders[fHIdx]].push(tmpFileData[fDIdx][tmpFileHeaders[fHIdx]]);
					}
				}
			}
		}
	}
	
	// click next button on page.
	$scope.nextPage = function() {
		// Call API.
		
		// checking keyword and website fields has been selected or not.
		if ($scope.selectedKeyword == null || $scope.selectedWebsite == null) {
			alert("Please select the column which contains your list of Terms/Websites");
			return;
		} else {
			// confirm keywordId and websiteId fields do not need to select.
			if ($scope.selectedKeywordID == null || $scope.selectedWebsiteID == null) {
				if (confirm("Having a Website ID or Keyword ID would allow your the ID's to be present in the result file. Are you sure you want to proceed without ID's?")) {
					commonVariables.setDropdownData($scope.dropdownData);
					commonVariables.setSelectedKeyword($scope.selectedKeyword);
					commonVariables.setSelectedKeywordID($scope.selectedKeywordID);
					commonVariables.setSelectedWebsite($scope.selectedWebsite);
					commonVariables.setSelectedWebsiteID($scope.selectedWebsiteID);
					commonVariables.setSelectedDepth($scope.selectedDepth);
					commonVariables.setUserEmail($scope.userEmail);
					
					var json_obj = making_json();
					var req_str = JSON.stringify(json_obj);
					
					$http.defaults.headers.post['Authorization'] = 'Basic ' + Base64.encode('testusr1' + ':' + 'testpwd1');
					$http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
					
					var req_config = {
						method: 'POST',
						url: 'v1/jobs/',
						headers: {
							'Content-Type': 'application/json'
						},
						data: req_str
					};
					
					console.log(req_str);
		
					$http(req_config).
					success(function (data, status, headers, config) {
						$location.path("/done");
					}).
					error(function (data, status, headers, config) {
						alert("Error occurs while calling API !!!");
					});
				}
			} else {
				commonVariables.setDropdownData($scope.dropdownData);
				commonVariables.setSelectedKeyword($scope.selectedKeyword);
				commonVariables.setSelectedKeywordID($scope.selectedKeywordID);
				commonVariables.setSelectedWebsite($scope.selectedWebsite);
				commonVariables.setSelectedWebsiteID($scope.selectedWebsiteID);
				commonVariables.setSelectedDepth($scope.selectedDepth);
				commonVariables.setUserEmail($scope.userEmail);
				
				var json_obj = making_json();
				var req_str = JSON.stringify(json_obj);
				
				$http.defaults.headers.post['Authorization'] = 'Basic ' + Base64.encode('testusr1' + ':' + 'testpwd1');
				$http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
				
				var req_config = {
					method: 'POST',
					url: 'v1/jobs/',
					headers: {
						'Content-Type': 'application/json'
					},
					data: req_str
				};
				
				console.log(req_str);
    
				$http(req_config).
				success(function (data, status, headers, config) {
					$location.path("/done");
				}).
				error(function (data, status, headers, config) {
					alert("Error occurs while calling API !!!");
				});
			}
		}
	}
	
	// making JSON object for inputting to API.
	function making_json() {
		var json_obj = {};
		
		var selectedKeyVals = $scope.dropdownData[$scope.selectedKeyword];
		var selectedKeyIDVals = $scope.dropdownData[$scope.selectedKeywordID];
		
		var selectedWebsiteVals = $scope.dropdownData[$scope.selectedWebsite];
		var selectedWebsiteIDVals = $scope.dropdownData[$scope.selectedWebsiteID];
		
		json_obj["terms"] = [];
		for (i = 0; i < selectedKeyVals.length; i ++) {
			var obj = new Object();
			
			if (selectedKeyVals[i] != "") {
				obj["term"] = selectedKeyVals[i];
			}
			if (selectedKeyIDVals && selectedKeyIDVals[i] != "") {
				obj["term_id"] = selectedKeyIDVals[i];
			}
			obj["extras"] = [];
			json_obj["terms"].push(obj);
		}
		
		json_obj["sites"] = [];
		for (i = 0; i < selectedWebsiteVals.length; i ++) {
			var obj = new Object();
			
			if (selectedWebsiteVals[i] != "") {
				obj["url"] = selectedWebsiteVals[i];
			}
			if (selectedWebsiteIDVals && selectedWebsiteIDVals[i] != "") {
				obj["site_id"] = selectedWebsiteIDVals[i];
			}
			json_obj["sites"].push(obj);
		}
		
		json_obj["max_depth"] = $scope.selectedDepth;
		json_obj["email"] = $scope.userEmail;
		
		return json_obj;
	}
	
	// click previous button on page.
	$scope.previousPage = function() {
		$location.path("/upload");
	}
	
	// click reset progress button on page.
	$scope.resetProgress = function() {
		if (confirm("Are you sure you would like to start again? You will lose all data uploaded so far.")) {
			commonVariables.setParsedData({});
			commonVariables.setHeaders({});
			
			commonVariables.setHeadersSelected(null);
			commonVariables.setParsedDataSelected(null);
			
			commonVariables.setFileNames([]);
			commonVariables.setSelectedFile(null);
			
			commonVariables.setPageSizes({});
			commonVariables.setPagesPerFile(null);
			commonVariables.setSelectedPageSize(null);
			
			commonVariables.setDropdownData({});
			commonVariables.setSelectedKeyword(null);
			commonVariables.setSelectedKeywordID(null);
			commonVariables.setSelectedWebsite(null);
			commonVariables.setSelectedWebsiteID(null);
			commonVariables.setSelectedDepth(null);
			commonVariables.setUserEmail(null);
			
			$location.path("/");
		}
	}
}); 