'use strict';

angular.module('docsTimeDirective', [])
.controller('homeCtrl', ['$scope', function($scope) {
  $scope.format = 'M/d/yy h:mm:ss a';
  $scope.color = '#00ff00';
}])
.directive('myCurrentTime', ['$interval', 'dateFilter', function($interval, dateFilter) {

  function link(scope, element, attrs) {

    var format,
        timeoutId;

       console.log("scope: ", scope);
       console.log("element: ",element);
       console.log("attrs: ", attrs); 


    function updateTime() {
      element.text(dateFilter(new Date(), format));
    }

    scope.$watch(attrs.myCurrentTime, function(value) {
      format = value;
      updateTime();
    });

    element.on('$destroy', function() {
      $interval.cancel(timeoutId);
    });

    // start the UI update process; save the timeoutId for canceling
    timeoutId = $interval(function() {
      updateTime(); // update DOM
    }, 1000);
  }

  return {
    link: link
  };
}])

.directive('color',function(){
 return{
  restrict: 'A',
  link: function(scope, element, attrs){
    scope.$watch(attrs.color,
    function(curr,prev){
            element.css('color',curr);
    });


  }
 }
})

.directive('myDraggable', ['$document', function($document) {
  return {
    link: function(scope, element, attr) {
      var startX = 0, startY = 0, x = 0, y = 0;

      element.css({
       position: 'relative',
       border: '1px solid red',
       backgroundColor: 'lightgrey',
       cursor: 'pointer'
      });

      element.on('mousedown', function(event) {
        // Prevent default dragging of selected content
        event.preventDefault();
        startX = event.pageX - x;
        startY = event.pageY - y;
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      });

      function mousemove(event) {
        y = event.pageY - startY;
        x = event.pageX - startX;
        element.css({
          top: y + 'px',
          left:  x + 'px'
        });
      }

      function mouseup() {
        $document.off('mousemove', mousemove);
        $document.off('mouseup', mouseup);
      }
    }
  };
}])

.directive('testDirective', function(){
return{
  scope:{},
  templateUrl:'/html/timedirective.html'
}
});