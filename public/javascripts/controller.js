var CtrlModule = angular.module("CtrlModule", ['wu.masonry'])

.controller("MainCtrl", function($scope, $route, images){
    
    $scope.images = images.allImages;
    $scope.allUserImages = images.images;
    
    $scope.add = function(){
        if($scope.url === ""){
            return
        }
        images.add({
            image: $scope.url
        });
    };
    
    $scope.delete = function(id){
        images.delete(id);
        $route.reload();
    };
})

.controller("UserCtrl", function($scope, userImages){
    $scope.images = userImages;
})

.factory("images", function($http){
    
    var o = {};
    
    o.allImages = [];
    o.images = [];
    
    o.getAll = function(){
        return $http.get("/user").then(function(res){
            angular.copy(res.data, o.allImages)
        }, function(res){
            console.log(res.status);
        });
    };
    
    o.get = function(user){
        return $http.get("/user/" + user).then(function(res) {
            return res.data;
        });
    };
   
   o.userGetAll = function(){
       return $http.get("/images").then(function(res) {
           angular.copy(res.data, o.images)
       }, function(res) {
           console.log(res.status);
       });
   };
   
   o.add = function(image){
       return $http.post("/images", image).then(function(res){
           return o.images.push(res.data);
       });
   };
   
   o.delete = function(id){
       $http.delete("/delete/" + id).then(function(res){
           return console.log(res.status);
       });
   };
   
   return o;
    
});