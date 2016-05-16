var app = angular.module("app", ['ngRoute', 'CtrlModule'])

.config(function($routeProvider){
    $routeProvider
    .when('/',{
        templateUrl: "home.html",
        controller: "MainCtrl",
        resolve: {
            imagesPromise: function(images){
                return images.getAll();
            }
        }
    })
    .when('/images/:user', {
        templateUrl: "wall.html",
        controller: "UserCtrl",
        resolve: {
            userImages: function(images, $route){
                return images.get($route.current.params.user);
            }
        }
    })
    .when("/user/home", {
        templateUrl: "user_wall.html",
        controller: "MainCtrl",
        resolve: {
            userImagesPromise: function(images){
                return images.userGetAll();
            }
        }
    })
    .otherwise('/');
});

