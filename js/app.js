'use strict';

$.noConflict();

angular.module('app', ['rzModule'])
.controller('mainCtrl', ['$scope', '$http', function($scope, $http){
	$scope.song_name = '';
	$scope.artist_name = '';
	$scope.showWormhole = false;
	$scope.showGuitar = false;
	$scope.showForm2 = false;
	$scope.showResults = false;
	$scope.numRecSongs = 10;
	$scope.pctSameArtist = 30;
	$scope.songMatches = [];
	$scope.songSelection = null;
	$scope.reccommendedSongs = [];
	$scope.userName = '';
	$scope.simUserParam = 0.5;
	$scope.simArtistParam = 0.0;
	
	$scope.numRecSongsSlider = {
			value: $scope.numRecSongs,
			options: {
				floor: 0,
				ceil: 100,
				step: 1,
				onChange: function(id, model, type) {
					$scope.numRecSongs = model;  // this is the value selected by the slider;you can upload this to the server.
				}
			}
		};

	$scope.pctSameArtistSlider = {
			value: $scope.pctSameArtist,
			options: {
				floor: 0,
				ceil: 100,
				step: 1,
				translate: function(value) {
					return value+'%';
				},
				onChange: function(id, model, type) {
					$scope.pctSameArtist = model;
				}
			}
		};

	$scope.artistSimSlider = {
			value: $scope.simArtistParam,
			options: {
				floor: -2,
				ceil: 2,
				step: 0.01,
				precision: 2,
				onChange: function(id, model, type) {
					$scope.simArtistParam = model;
				}
			}
		};

	$scope.userSimSlider = {
			value: $scope.simUserParam,
			options: {
				floor: 0,
				ceil: 2,
				step: 0.01,
				precision: 2,
				onChange: function(id, model, type) {
					$scope.simUserParam = model;  // this is the value selected by the slider;you can upload this to the server.
				}
			}
		};

	$scope.query = function() {
		
		// clear data
		$scope.songMatches = [];
		$scope.reccommendedSongs = [];
		// hide form 2 view
		$scope.showForm2 = false; 
		$scope.showResults = false;

		$scope.showWormhole = true;
		// query url for form 1
		var url1 = 'http://10.11.255.204:9010/SongSelection?song_name=' + $scope.song_name + '&artist_name=' + $scope.artist_name;

		// ajax request
		$http.get(url1)
			.then(function(result) {
				$scope.songMatches = result.data;
//				console.log($scope.songMatches);
				$scope.showWormhole = false;
				$scope.showForm2 = true;
			}, function(error){
				console.log("Failed to load song matches: " + error);
			});
	};
	
	$scope.query2 = function() {

		$scope.showGuitar=true;
		$scope.showResult=false;
		$scope.reccommendedSongs = [];
//		$scope.numRecSongs = $scope.numRecSongs || "10";
//		$scope.numSameArtist = $scope.numSameArtist || "3";

		var refSongId = $scope.songMatches[$scope.songSelection].songId;
		var refArtistId = $scope.songMatches[$scope.songSelection].artistId;
//		console.log($scope.songSelection);
//		console.log('username = ' + $scope.userName);
//		console.log('refArtistId = ' + refArtistId);
//		console.log('numRecSongs = ' + $scope.numRecSongs);
//		console.log('numSameArtist = ' + $scope.numSameArtist);
		
		var url2 = 'http://10.11.255.204:9010/SongRecommendation?song_key='+refSongId+'&artist_key='
			+refArtistId +'&num_recs=' + $scope.numRecSongs + '&num_same_artist='+Math.floor($scope.pctSameArtist*$scope.numRecSongs/100)
			+ '&sim_artist_param='+$scope.simArtistParam+'&user_name='+$scope.userName + '&sim_user_param='+$scope.simUserParam;  // the query url for form 2

		// ajax request
		$http.get(url2)
			.then(function(result) {
//				console.log(result)
				$scope.recommendedSongs = result.data;
//	console.log($scope.recommendedSongs);
				$scope.showGuitar=false;
				$scope.showResults = true; // show query result view
			}, function(error) {
				console.log('Failed to load recommended Songs: ' + error);
			});
};

}]);
