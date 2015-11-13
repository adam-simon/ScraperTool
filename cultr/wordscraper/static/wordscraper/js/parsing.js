angular.module('scrappingApp').controller('ParsingCtrl', function($scope, $timeout, $location, commonVariables) {
	
	$scope.headers = commonVariables.getHeaders() ? commonVariables.getHeaders() : {};					// all file's header info list.
	$scope.parsedData = commonVariables.getParsedData() ? commonVariables.getParsedData() : {};			// all file's data list.
	
	$scope.headersSelected = commonVariables.getHeadersSelected();										// selected file's header info.
	$scope.parsedDataSelected = commonVariables.getParsedDataSelected();								// selected file's data.
	
	$scope.fileNames = commonVariables.getFileNames() ? commonVariables.getFileNames() : [];			// all file's name list.
	$scope.selectedFile = commonVariables.getSelectedFile();											// selected file name.
	
	$scope.pageSizes = commonVariables.getPageSizes() ? commonVariables.getPageSizes() : {};			// page number list for all files.
	$scope.pagesPerFile = commonVariables.getPagesPerFile();											// page number list per file.
	$scope.selectedPageSize = commonVariables.getSelectedPageSize();									// selected page number (format: from 'to' to)
	var loadSize = 3;																					// item's size for displaying per page.
	
	var spinner = null;								// loading when drag & drop.
	var opts;										// loading bar options.
	var dropPosition;								// drag & drop position for adding loading bar.
	var selectPosition;								// selecting file position for adding loading bar.
	
	var availableFE = ["csv", "xls", "xlsx"];		// available file extensions.
	
	// adding event listener for drag&drop and selecting file events.
	$scope.init = function () {
		// getting drag & drop posittion and add event listner.
		dropPosition = document.getElementById("upload-file");
		if (dropPosition.addEventListener) {
			dropPosition.addEventListener('dragenter', handleDragover, false);
			dropPosition.addEventListener('dragover', handleDragover, false);
			dropPosition.addEventListener('drop', handleDrop, false);
		}
		
		// getting file selecting and add event listner.
		selectPosition = document.getElementById("upload-data");
		var xlf = document.getElementById("xlf");
		if (xlf.addEventListener) {
			xlf.addEventListener('change', handleFile, false);
		}
		
		// options for file uploading progress bar.
		opts = {
			lines: 15, 				// The number of lines to draw
			length: 18, 				// The length of each line
			width: 4, 				// The line thickness
			radius: 10, 			// The radius of the inner circle
			corners: 1, 			// Corner roundness (0..1)
			rotate: 0, 				// The rotation offset
			color: '#000', 			// #rgb or #rrggbb
			speed: 1, 				// Rounds per second
			trail: 60, 				// Afterglow percentage
			shadow: false, 			// Whether to render a shadow
			hwaccel: false, 		// Whether to use hardware acceleration
			className: 'spinner', 	// The CSS class to assign to the spinner
			zIndex: 2e9, 			// The z-index (defaults to 2000000000)
			top: '50%', 				// Top position relative to parent in px
			left: '50%', 			// Left position relative to parent in px
			position: 'absolute'
		};
	}
	
	// drop event function.
	function handleDrop(e) {
		e.stopPropagation();
		e.preventDefault();
		
		var files = e.dataTransfer.files;
		if (files.length < 1) return;
		
		// setting drag & drop file uploading progress bar and initiate the instance for drag & drop.
		opts.top = '50%';
		opts.left = '50%';
		opts.lines = 15;
		opts.length = 18;
		opts.radius = 10;
		spinner = new Spinner(opts).spin(dropPosition);
		
		var i,f;
		for (i = 0, f = files[i]; i != files.length; ++i) {
			var name = f.name;
			var fileExt = name.substr(name.lastIndexOf('.') + 1);
			
			// checking uploaded file is available or not.
			if ( availableFE.indexOf(fileExt) == -1 ) {
				alert("Please upload files only in the Excel (.xls or xlsx) or CSV format");
				spinner.stop(dropPosition);
				break;
			}
			
			// checking uploaded file is exist or not.
			if ($scope.fileNames && $scope.fileNames.indexOf(name) > -1) {
				spinner.stop(dropPosition);
				break;
			}
			$scope.fileNames.push(name);
			$scope.selectedFile = name;
			
			// parsing uploaded file data.
			var reader = new FileReader();
			if (fileExt.toLowerCase() == "csv") {
				reader.onload = function(e) {
					var data = e.target.result;
					process_csv(data);
				};
				reader.readAsText(f);
			} else {
				reader.onload = function(e) {
					var data = e.target.result;
					var arr = String.fromCharCode.apply(null, new Uint8Array(data));
					var xlsx = XLSX.read(btoa(arr), {type: 'base64'});
				  
					process_xlsx(xlsx);
				};
				reader.readAsArrayBuffer(f);
			}
		}
	}
	
	// drag event function.
	function handleDragover(e) {
		e.stopPropagation();
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy';
	}
	
	// processing data for selecting file.
	function fixdata(data) {
		var o = "", l = 0, w = 10240;
		for(; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w,l*w+w)));
		o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
		return o;
	}
	
	// selecting file event.
	function handleFile(e) {
		var files = e.target.files;
		if (files.length < 1) return;
		
		// setting for selected file uploading progress bar and initiate the instance.
		opts.top = '35%';
		opts.left = '100%';
		opts.lines = 8;
		opts.length = 5;
		opts.radius = 3;
		spinner = new Spinner(opts).spin(selectPosition);
		
		var f = files[0];
		{
			var name = f.name;
			var fileExt = name.substr(name.lastIndexOf('.') + 1);
			
			// checking selected file is available or not.
			if ( availableFE.indexOf(fileExt) == -1 ) {
				alert("Please upload files only in the Excel (.xls or xlsx) or CSV format.");
				if(spinner != null) {
					spinner.stop(selectPosition);
				}
				return;
			}
			
			// checking uploaded file is exist or not.
			if ($scope.fileNames && $scope.fileNames.indexOf(name) > -1) {
				if(spinner != null) {
					spinner.stop(selectPosition);
				}
				return;
			}
			$scope.fileNames.push(name);
			$scope.selectedFile = name;
			
			// parsing uploaded file data.
			var reader = new FileReader();
			if (fileExt.toLowerCase() == "csv") {
				reader.onload = function(e) {
					var data = e.target.result;
					process_csv(data);
				};
				reader.readAsText(f);
			} else {
				reader.onload = function(e) {
					var data = e.target.result;
					var arr = fixdata(data);
					var xlsx = XLSX.read(btoa(arr), {type: 'base64'});
					
					process_xlsx(xlsx);
				};
				reader.readAsArrayBuffer(f);
			}
		}
	}

	// analysing the excel file data what dropped and selected.
	function process_xlsx(xlsx) {
		var output = "";
		output = to_json(xlsx);
		$timeout(function(){
			$scope.parsedData[$scope.selectedFile] = output;
			$scope.selectedPageSize = 0;

			$scope.parsedDataSelected = [];
			$scope.parsedDataSelected = getPageData(0, loadSize);
		  
			getPageNumbers(output.length);  
		  
			if(spinner != null) {
				spinner.stop(dropPosition);
				spinner.stop(selectPosition);
			}
		});
	}
	
	// analysing the csv file data what dropped and selected.
	function process_csv(csvStr) {
		var rows = csvStr.split('\n');
		var headerColumns = rows[0].split(',');
		
		$scope.headersSelected = [];
		for (i = 0; i < headerColumns.length; i ++) {
			$scope.headersSelected.push(headerColumns[i]);
		}
		$scope.headers[$scope.selectedFile] = $scope.headersSelected;
		
		var tmpParsedData = [];
		for (i = 1; i < rows.length - 1; i ++)  {
			var columns = rows[i].split(',');
			var obj = new Object();
			
			for (j = 0; j < $scope.headersSelected.length; j ++) {
				if (!columns[j]) continue;
				obj[$scope.headersSelected[j]] = columns[j];
			}
			tmpParsedData.push(obj);
		}
		
		$timeout(function(){
			$scope.parsedData[$scope.selectedFile] = tmpParsedData;
			$scope.selectedPageSize = 0;

			$scope.parsedDataSelected = [];
			$scope.parsedDataSelected = getPageData(0, loadSize);
			
			getPageNumbers(tmpParsedData.length); 
			
			if(spinner != null) {
				spinner.stop(dropPosition);
				spinner.stop(selectPosition);
			}
		});
	}
	
	// to json object from excel file's data.
	function to_json(workbook) {
		var result = [];
		workbook.SheetNames.forEach(function(sheetName) {
			var rObjArr = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
			var headers = rObjArr.headers;
			if ( headers ) {
				$scope.headersSelected = [];
				for( header in headers ) {
					$scope.headersSelected.push(header);
				}
				$scope.headers[$scope.selectedFile] = $scope.headersSelected;
			}
		
			var rdata = rObjArr.out;
			if(rdata && rdata.length > 0){
				result = rdata;
			} 
		});
		return result;
	}

	// to csv format from excel file's data.
	function to_csv(workbook) {
		var result = [];
		workbook.SheetNames.forEach(function(sheetName) {
			var rObjArr = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
			if(rObjArr && rObjArr.length > 0){
			  result.push("SHEET: " + sheetName);
			  result.push("");
			  result.push(rObjArr);
			}
		});
		return result.join("\n");
	}
	
	// to formulae format from excel file's data.
	function to_formulae(workbook) {
		var result = "";
		workbook.SheetNames.forEach(function(sheetName) {
			var rObjArr = XLSX.utils.sheet_to_formulae(workbook.Sheets[sheetName]);
			if(rObjArr && rObjArr.length > 0){
				for(i = 0; i < rObjArr.length; i ++) {
					result += rObjArr[i];
					result += "\n";
				}
			}
		});
		return result;
	}
	
	// selecting file from files in uploading page.
	$scope.selectFile = function(fileName) {
		$scope.selectedFile = fileName;
		$scope.selectedPageSize = 0;
		
		$scope.headersSelected = [];
		$scope.headersSelected = $scope.headers[fileName];
		
		$scope.parsedDataSelected = [];
		$scope.parsedDataSelected = getPageData(0, loadSize);
		
		$scope.pagesPerFile = [];
		$scope.pagesPerFile = $scope.pageSizes[fileName];
	}
	
	// deleting uploaded file by select delete icon.
	$scope.deleteFile = function(fileName) {
		$scope.headersSelected = [];
		$scope.parsedDataSelected = [];
		
		$scope.fileNames.splice($scope.fileNames.indexOf(fileName), 1);
		delete $scope.parsedData[fileName];
		delete $scope.headers[fileName];
		delete $scope.pageSizes[fileName];
		
		if ($scope.fileNames.length == 0) {
			$scope.selectedFile = "";
			$scope.selectedPageSize = 0;
			
			$scope.headersSelected = [];
			$scope.parsedDataSelected = [];
			$scope.pagesPerFile = [];
		} else {
			$scope.selectedFile = $scope.fileNames[0];
			$scope.selectedPageSize = 0;
			
			$scope.headersSelected = $scope.headers[$scope.selectedFile];
			$scope.parsedDataSelected = getPageData(0, loadSize);
			$scope.pagesPerFile = $scope.pageSizes[$scope.selectedFile];
		}
	}
	
	// displaying selected file data by page number.
	$scope.selectPage = function(selectedPageSize) {
		var startIdx, endIdx;
		if ( selectedPageSize == 0 ) {
			startIdx = 0;
			endIdx = loadSize * (selectedPageSize + 1);
		} else if (selectedPageSize > 0) {
			startIdx = loadSize * selectedPageSize;
			endIdx = loadSize * (selectedPageSize + 1);
		}
		
		$scope.parsedDataSelected = getPageData(startIdx, endIdx);	
	}
	
	// common function for getting file data to display by page number.
	function getPageData(startPnt, endPnt) {
		var tmp = [];
		for(var i = startPnt; i < endPnt; i ++) {
		  if ($scope.parsedData[$scope.selectedFile].length <= i) break;
		  tmp.push($scope.parsedData[$scope.selectedFile][i]);
		}
		return tmp;
	}
	
	// common function for getting page number per file.
	function getPageNumbers(length) {
		var pages;
		if (length % loadSize == 0) {
			pages = length / loadSize;
		} else {
			pages = Math.ceil(length / loadSize) ;
		}
		
		$scope.pagesPerFile = [];
		for (var i = 0; i < pages; i ++) {
			var tmpStart, tmpEnd;
			tmpStart = i * loadSize + 1;
			if (i == pages - 1) {
				tmpEnd = "Last";
			} else {
				tmpEnd = (i + 1) * loadSize;
			}
			
			var obj = new Object();
			obj.id = i;
			obj.val = tmpStart + " to " + tmpEnd;
			
			$scope.pagesPerFile.push(obj);
		}
		$scope.pageSizes[$scope.selectedFile] = $scope.pagesPerFile;
	}
	
	// click next button on page.
	$scope.nextPage = function() {
		if ($scope.fileNames.length < 2) {
			alert("Please upload at least two files containing Terms and Website URL's respectively");
			return;
		}
		
		commonVariables.setParsedData($scope.parsedData);
		commonVariables.setHeaders($scope.headers);
		
		commonVariables.setHeadersSelected($scope.headersSelected);
		commonVariables.setParsedDataSelected($scope.parsedDataSelected);
		
		commonVariables.setFileNames($scope.fileNames);
		commonVariables.setSelectedFile($scope.selectedFile);
		
		commonVariables.setPageSizes($scope.pageSizes);
		commonVariables.setPagesPerFile($scope.pagesPerFile);
		commonVariables.setSelectedPageSize($scope.selectedPageSize);
		
		commonVariables.setDropdownData({});
		commonVariables.setSelectedKeyword(null);
		commonVariables.setSelectedKeywordID(null);
		commonVariables.setSelectedWebsite(null);
		commonVariables.setSelectedWebsiteID(null);
		commonVariables.setSelectedDepth(null);
		commonVariables.setUserEmail(null);
		
		$location.path("/map");
	}
	
	// click previous button on page.
	$scope.previousPage = function() {
		commonVariables.setParsedData($scope.parsedData);
		commonVariables.setHeaders($scope.headers);
		
		commonVariables.setHeadersSelected($scope.headersSelected);
		commonVariables.setParsedDataSelected($scope.parsedDataSelected);
		
		commonVariables.setFileNames($scope.fileNames);
		commonVariables.setSelectedFile($scope.selectedFile);
		
		commonVariables.setPageSizes($scope.pageSizes);
		commonVariables.setPagesPerFile($scope.pagesPerFile);
		commonVariables.setSelectedPageSize($scope.selectedPageSize);
		
		$location.path("/");
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
