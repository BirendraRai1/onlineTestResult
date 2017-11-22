angular.module('MyApp')
  .controller('ForgotCtrl', function($scope,$rootScope,$location, $window,$auth, Account) {
    $scope.forgotPassword = function() {
      Account.forgotPassword($scope.user)
        .then(function(response) {
          $auth.setToken(response);
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          //alert("Password changed successfully, Login into your account with updated password");
          $location.path('/dashboard').replace();
          //$window.location.href = '/dashboard'
          if(!$rootScope.$$phase){
            $rootScope.$apply();
          }

        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
            //console.log("error occured inside forgot controller");
          };
        });
    };
  });
