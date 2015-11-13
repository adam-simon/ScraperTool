angular.module('scrappingApp').controller('InstructionCtrl', function($scope, $location, commonVariables) {
	// click next button on page.	
	$scope.nextPage = function() {
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
		}
	}
});