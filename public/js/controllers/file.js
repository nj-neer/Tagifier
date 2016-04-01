app.controller('fileCtrl', function($scope,$state,$http,$stateParams)
{
	$scope.baseStr;
	$scope.userPattern;
	$scope.pattern;
	$scope.canDownload = false;
	$scope.file = {};

	$scope.exportFile = {};
	$http({
	  method: 'GET',
	  url: '/api/'+$stateParams.fileId
	}).then(function successCallback(response) {
		parseFileData(response.data);
	}, function errorCallback(response) {

	});

	var parseFileData = function(data){
		console.log(data);
		$scope.file = data;
		$scope.exportFile.cover = data.snippet.thumbnails.maxres.url;
		var pt = data.snippet.localized.title.split(" - ");
		$scope.userPattern = "%artist% - %title%";
		// if xx - xx format
		if(pt.length == 2){
			$scope.baseStr =  data.snippet.localized.title;
		}

		else {
			$scope.baseStr =  data.snippet.channelTitle+" - "+data.snippet.localized.title;
		}

		$scope.genPattern();
	}

	$scope.genPattern = function(){
		$scope.pattern = $scope.userPattern.replace(/%([a-zA-Z0-9])\w+%/g,"(.*)");
		$scope.vars = $scope.userPattern.match(/%([a-zA-Z0-9])\w+%/g);
		for (var i = 0; i < $scope.vars.length; i++)
		{
			$scope.vars[i] = $scope.vars[i].replace("%","").replace("%",""); //remove %x%
		};
		
		var extrData = $scope.baseStr.match(new RegExp($scope.pattern));
		if(!extrData)
		{
			console.log("Invalid regex");
			$scope.canDownload = false;
			return;
		}

		for (var i = 0; i < $scope.vars.length; i++)
		{
			if(extrData[i+1])
			{
				$scope.exportFile[$scope.vars[i]] = extrData[i+1];
			}
		};
		$scope.canDownload = true;
	}
});