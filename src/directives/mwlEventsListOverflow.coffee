'use strict';

angular = require('angular')

angular.module('mwl.calendar').directive(
  'mwlEventsListOverflow'
  [
    '$window'
    '$timeout'
    '$rootScope'
    ($window, $timeout, $rootScope) ->
      return {
        restrict: 'A'
        link: (scope, elem, attrs)->

          $timeout(->
            do setFullHeight
            #        $('nav').off 'resize'
            $('nav').on 'resize', setFullHeight
            #FIXME
            $('#deals-list-table .widget-body a').on 'click', -> $timeout(setFullHeight)
            $('nav').on 'click',  -> $timeout(setFullHeight, 300)
            #        angular.element($window).off 'resize'
            angular.element($window).on 'resize', setFullHeight
            $rootScope.$on(
              '$stateChangeSuccess',
              -> $timeout(setFullHeight)
            )
          )

          setFullHeight = ->
            height = 0
            viewPortHeight = window.innerHeight
            nav = $('nav')
            pageHeight = nav.offset().top + nav.outerHeight() + 120
            viewHeight = _.max([viewPortHeight, pageHeight])
            widget = null
            $widgets = $(elem).find('rbs-widget')
            widget = $($widgets[0]).find('.widget-body')
            height = viewHeight - widget.offset().top
            if height
              if attrs.maxPercent?
                height = height * (parseInt(attrs.maxPercent)/100)
              $widgets.each ->
                widget = $(this).find('.widget-body')
                widget.height(height - 39)
                if attrs.maxPercent?
                  $(this).find('.rbs-widget').css('marginBottom', '12px')
                widget.css('overflow-y', 'auto')
                widget.css('overflow-x', 'hidden')
            scope.$broadcast('setFullHeight', {height: widget.height()})

          return
      }
  ]
)