angular.module('todoApp', [])
  .controller('TodoListController', [ '$scope', function($scope) {
    $scope.todos = [
      {text:'learn AngularJS', done:true, date: 1521544682274},
      {text:'build an AngularJS app', done:false, date: 1521544282274}
    ];

    $scope.days = 0;

    $scope.setDays = function (days) {
      $scope.days = days;
    };

    $scope.filterDays = function(day) {
      console.log(day); //1521544282274
      console.log($scope.days); //1 * 86 400 000
      return day > Date.now() - $scope.days
    };

    $scope.addTodo = function() {
      $scope.todos.push({text:$scope.todoText, done:false, date: Date.now()});
      $scope.todoText = '';
    };

    $scope.remaining = function() {
      var count = 0;
      angular.forEach($scope.todos, function(todo) {
        count += todo.done ? 0 : 1;
      });
      return count;
    };

    $scope.archive = function() {
      var oldTodos = $scope.todos;
      $scope.todos = [];
      angular.forEach(oldTodos, function(todo) {
        if (!todo.done) $scope.todos.push(todo);
      });
    };
  }]);
