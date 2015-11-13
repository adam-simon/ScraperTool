angular.module('scrappingApp', ['ngRoute', 'ngCookies']).config(['$routeProvider', '$interpolateProvider', function($routeProvider, $interpolateProvider){
		$routeProvider.
			when('/', {
				templateUrl: 'instruction.html',
				controller: 'InstructionCtrl'
			}).
			when('/upload', {
				templateUrl: 'upload.html',
				controller: 'ParsingCtrl'
			}).
			when('/map', {
				templateUrl: 'map.html',
				controller: 'MappingCtrl'
			}).
			when('/done', {
				templateUrl: 'done.html',
				controller: 'DoneCtrl'
			}).
			otherwise({
				redirectTo: '/'
			});
			
		$interpolateProvider.startSymbol('{$');
		$interpolateProvider.endSymbol('$}');
		
	}]).service('commonVariables', function() {
		var parsedData, headers, fileNames, pageSizes;
		var headersSelected, parsedDataSelected, selectedFile, pagesPerFile, selectedPageSize;
		var dropdownData, selectedKeyword, selectedKeywordID, selectedWebsite, selectedWebsiteID, selectedDepth, userEmail;
		
		return {
			getParsedData: function() {
				return parsedData;
			},
			setParsedData: function(value) {
				parsedData = value;
			},
			
			getHeaders: function() {
				return headers;
			},
			setHeaders: function(value) {
				headers = value;
			},
			
			getFileNames: function() {
				return fileNames;
			},
			setFileNames: function(value) {
				fileNames = value;
			},
			
			getPageSizes: function() {
				return pageSizes;
			},
			setPageSizes: function(value) {
				pageSizes = value;
			},
			
			getHeadersSelected: function() {
				return headersSelected;
			},
			setHeadersSelected: function(value) {
				headersSelected = value;
			},
			
			getParsedDataSelected: function() {
				return parsedDataSelected;
			},
			setParsedDataSelected: function(value) {
				parsedDataSelected = value;
			},
			
			getSelectedFile: function() {
				return selectedFile;
			},
			setSelectedFile: function(value) {
				selectedFile = value;
			},
			
			getPagesPerFile: function() {
				return pagesPerFile;
			},
			setPagesPerFile: function(value) {
				pagesPerFile = value;
			},
			
			getSelectedPageSize: function() {
				return selectedPageSize;
			},
			setSelectedPageSize: function(value) {
				selectedPageSize = value;
			}, 
			
			getDropdownData: function() {
				return dropdownData;
			},
			setDropdownData: function(value) {
				dropdownData = value;
			},
			
			getSelectedKeyword: function() {
				return selectedKeyword;
			},
			setSelectedKeyword: function(value) {
				selectedKeyword = value;
			},
			
			getSelectedKeywordID: function() {
				return selectedKeywordID;
			},
			setSelectedKeywordID: function(value) {
				selectedKeywordID = value;
			},
			
			getSelectedWebsite: function() {
				return selectedWebsite;
			},
			setSelectedWebsite: function(value) {
				selectedWebsite = value;
			},
			
			getSelectedWebsiteID: function() {
				return selectedWebsiteID;
			},
			setSelectedWebsiteID: function(value) {
				selectedWebsiteID = value;
			},
			
			getSelectedDepth: function() {
				return selectedDepth;
			},
			setSelectedDepth: function(value) {
				selectedDepth = value;
			},

			getUserEmail: function() {
				return userEmail;
			},
			setUserEmail: function(value) {
				userEmail = value;
			}
		}
	}).factory('Base64', function() {
		var keyStr = 'ABCDEFGHIJKLMNOP' +
				'QRSTUVWXYZabcdef' +
				'ghijklmnopqrstuv' +
				'wxyz0123456789+/' +
				'=';
		return {
			encode: function (input) {
				var output = "";
				var chr1, chr2, chr3 = "";
				var enc1, enc2, enc3, enc4 = "";
				var i = 0;

				do {
					chr1 = input.charCodeAt(i++);
					chr2 = input.charCodeAt(i++);
					chr3 = input.charCodeAt(i++);

					enc1 = chr1 >> 2;
					enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
					enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
					enc4 = chr3 & 63;

					if (isNaN(chr2)) {
						enc3 = enc4 = 64;
					} else if (isNaN(chr3)) {
						enc4 = 64;
					}

					output = output +
							keyStr.charAt(enc1) +
							keyStr.charAt(enc2) +
							keyStr.charAt(enc3) +
							keyStr.charAt(enc4);
					chr1 = chr2 = chr3 = "";
					enc1 = enc2 = enc3 = enc4 = "";
				} while (i < input.length);

				return output;
			},

			decode: function (input) {
				var output = "";
				var chr1, chr2, chr3 = "";
				var enc1, enc2, enc3, enc4 = "";
				var i = 0;

				// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
				var base64test = /[^A-Za-z0-9\+\/\=]/g;
				if (base64test.exec(input)) {
					alert("There were invalid base64 characters in the input text.\n" +
							"Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
							"Expect errors in decoding.");
				}
				input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

				do {
					enc1 = keyStr.indexOf(input.charAt(i++));
					enc2 = keyStr.indexOf(input.charAt(i++));
					enc3 = keyStr.indexOf(input.charAt(i++));
					enc4 = keyStr.indexOf(input.charAt(i++));

					chr1 = (enc1 << 2) | (enc2 >> 4);
					chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
					chr3 = ((enc3 & 3) << 6) | enc4;

					output = output + String.fromCharCode(chr1);

					if (enc3 != 64) {
						output = output + String.fromCharCode(chr2);
					}
					if (enc4 != 64) {
						output = output + String.fromCharCode(chr3);
					}

					chr1 = chr2 = chr3 = "";
					enc1 = enc2 = enc3 = enc4 = "";

				} while (i < input.length);

				return output;
			}
		};
	});