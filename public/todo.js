angular.module('todoApp', ['ui.router', 'ngResource'])
  .controller('TodoListController', [ '$scope', '$state', '$resource', '$stateParams', 'tasksService', function(
    $scope,
    $state,
    $resource,
    $stateParams,
    tasksService
  ) {
    $scope.todos = tasksService.tasks;
    $scope.days = 1e100;
    $scope.todoText = getTextTodo();

    function getTextTodo() {
      var todo = tasksService.tasks.filter(el => el.date.toString() === $stateParams.taskId)
      return todo.length ? todo[0].text : ''
    }
    var Todos = $resource('/todo.json');

    !tasksService.tasks.length && Todos.get({a:'a'})
        .$promise.then(function(response) {
          $scope.todos = tasksService.tasks = response.tasks;
        })
        .catch(err => console.log(err));

    $scope.setDays = function (days) {
      $scope.days = days;
    };

    $scope.filterDone = function (task) {
      return task.done;
    };

    $scope.editTask = function (date) {
      var editIndex = $scope.todos.reduce(function(acc, elem, index) {
        return (elem.date === date) ? index : acc;
      },0);
      $state.go('edit', {taskId: $scope.todos[editIndex].date})
      $scope.todoText = $scope.todos[editIndex].text;
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
      var editIndex = tasksService.tasks.reduce(function(acc, elem, index) {
        return (elem.date.toString() === $stateParams.taskId) ? index : acc;
      },-1);
      if (editIndex >= 0) {
        tasksService.tasks[editIndex].text = $scope.todoText;
      } else {
        tasksService.tasks.push({text:$scope.todoText, done:false, date: Date.now()});
      }
      $scope.todoText = '';
      $state.go('main');
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
  }])
  .service('tasksService', ['$http', function($http) {
     var tasks = [];
     return {
       tasks: tasks
     };
   }])
  .directive('main', function() {
    return {
      template: `<h2>Todo</h2>
      <div ng-controller="TodoListController">
        <span>{{remaining()}} of {{todos.length}} remaining</span>
        [ <a href="" ng-click="archive()">archive</a> ]
        <button ng-class="{active:days === 1}" ng-click="setDays(1)">1 day</button>&nbsp;
        <button ng-class="{active:days === 3}" ng-click="setDays(3)">3 day</button>&nbsp;
        <button ng-class="{active:days === 5}" ng-click="setDays(5)">5 day</button>&nbsp;
        <button ng-class="{active:days === 1e100}" ng-click="setDays(1e100)">All dates</button>&nbsp;
        <button ng-class="{active:sortTasksByName}" ng-click="orderTasks()">Sort by name</button>
        <ul class="unstyled">
          <li class="list-title">
            Complited tasks
          </li>
          <li ng-repeat="todo in todos | filter:filterDays | orderBy:sortTasksByName | filter:filterDone">
            <label class="checkbox">
              <input type="checkbox" ng-model="todo.done">
            </label>
            <span class="done-{{todo.done}}" ng-click="editTask(todo.date)">{{todo.text}}</span>&nbsp;
            <span class="task-date" ng-click="editTask(todo.date)">{{todo.date | date:'medium'}}</span>
          </li>
        </ul>
        <ul class="unstyled">
            <li class="list-title">
              Uncomplited tasks
            </li>
          <li ng-repeat="todo in todos | filter:filterDays | orderBy:sortTasksByName | filter:!filterDone">
              <label class="checkbox">
                  <input type="checkbox" ng-model="todo.done">
                </label>
                <span class="done-{{todo.done}}" ng-click="editTask(todo.date)">{{todo.text}}</span>&nbsp;
                <span class="task-date" ng-click="editTask(todo.date)">{{todo.date | date:'medium'}}</span>
              </li>
        </ul>
        <a ui-sref="add" ui-sref-active="active">add task</a>
  `
    };
  })
  .directive('add', function() {
    return {
      template: `
      <form name="myForm" ng-submit="addTodo()" ng-controller="TodoListController">
        <input type="text" ng-model="todoText" name="input" size="30"
              placeholder="add new todo here">
        <input class="btn-primary" type="submit" value="add/change">
        <span class="error" ng-show="todoText.length > 20">Length should be less 20!</span><br>
      </form>
  `
    };
  })
  .config(function($stateProvider,$locationProvider) {
    var mainState = {
      name: 'main',
      url: '/',
      template: '<main></main>'
    }

    var addState = {
      name: 'add',
      url: '/task/add',
      template: '<add></add>'
    }

    var editState = {
      name: 'edit',
      url: '/task/{taskId}/edit',
      template: '<add></add>'
    }

    $stateProvider.state(mainState);
    $stateProvider.state(addState);
    $stateProvider.state(editState);
    $locationProvider.html5Mode(true);
  });
