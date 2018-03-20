angular.module('todoApp', [])
  .controller('TodoListController', [ '$scope', function($scope) {
    $scope.todos = [
      {text:'learn AngularJS', done:true, date: 1521544682274},
      {text:'learn JS core', done:true, date: 1511544682274},
      {text:'build an AngularJS app', done:false, date: 1521544282274}
    ];

    $scope.days = 1e100;

    $scope.setDays = function (days) {
      $scope.days = days;
    };

    $scope.orderTasks = function () {
      $scope.sortTasksByName = !$scope.sortTasksByName ? 'text' : undefined;
    };

    $scope.sortByDate = function () {
      $scope.sortTasksByDate = !$scope.sortTasksByDate;
    };

    $scope.filterDays = function(day) {
      return day.date > Date.now() - $scope.days * 86400000
    };

    $scope.addTodo = function() {
      $scope.validationError = $scope.todoText.length > 20;
      if ($scope.validationError) return;
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
