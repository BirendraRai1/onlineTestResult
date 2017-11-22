angular.module('MyApp')
.factory('Account', function($http) {
  return {
    deleteAccount: function() {
      return $http.delete('/account');
    },
    forgotPassword: function(data) {
      return $http.post('/forgot', data);
    }
  };
});