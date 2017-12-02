(function () {
	'use strict';
	var app = angular.module('Arcade', []);
    app.controller('MenuController', ['$scope', function ($scope) {
        $scope.user = {username:"",highscore:0};
        $scope.username = '';

		$scope.loginUser = function () {
            $.get("getUser",{"username":$scope.username},function(result){
                console.log("Result:"+result);
                if(result.length){
                    $scope.$apply(function(){
                    $scope.user=result[0];
                    });

                    console.log("Name set to " + $scope.user.username);
                }else{
                    console.log("Error: No user found with username "+$scope.username);
                    $.post("putUser",{"username":$scope.username});
                }
            });

        };

        $scope.playGame = function(){
            StartPong($scope.user);
        }

        $scope.watchCat = function(){
             startVideos();
            $("#special-content").show();
        }

        $scope.logOut = function(){
            console.log("Click");
            $scope.user.username = "";
            $scope.user.highscore = 0;
            $scope.username = '';
            $("#special-content").remove();
            $("body").append("<div id=\"special-content\"><\div>");
        };

        $scope.hidden = function () {
            return ($scope.user.username.length>0);
        };

        $scope.disabled = function () {
            return !($scope.username).length || ($scope.user.username.length);
        };

	}]);
}());
