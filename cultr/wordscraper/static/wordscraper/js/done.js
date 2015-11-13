angular.module('scrappingApp').controller('DoneCtrl', function($scope, $location, commonVariables) {
	
	// click previous button on page.
	$scope.previousPage = function() {
		$location.path("/map");
	}
		
	// click reset progress button on page.
	$scope.resetProgress = function(value) {
		
		// checking which button has been clicked among of reset progress button and Create New Scrape Job button.
		if (value == true) {
			
			// In case of click reset progress button, confirming.
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
		} else {
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