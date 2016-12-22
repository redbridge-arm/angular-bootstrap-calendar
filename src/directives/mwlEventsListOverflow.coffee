'use strict';

angular = require('angular')

$.event.special.sizeChanged =
  remove: ->
    $(this).children('iframe.size-changed').remove()
    return
  add: ->
    elm = $(this)
    iframe = elm.children('iframe.size-changed')

    if !iframe.length
      iframe = $('<iframe/>')
      iframe.addClass('size-changed')
      iframe.prependTo(this)
    ielm = iframe[0]

    (ielm.contentWindow or ielm).onresize = ->
      elm.trigger 'sizeChanged'
    return

getVisible = ($elements, $container) ->

  $visible = $elements.filter((i, e) ->
    isVisible = false
    $e = $(e)
    isVisible = $e.position().top + $e.height() <= $container.height() and $e.position().left + $e.width() <= $container.width()
    isVisible
  )
  $visible

isEventsOverload = (elem) ->

  events = angular.element(elem).find('.event')
  visible = getVisible(events, angular.element(elem))

  visible.removeClass('last-visible')
  if events.size() > visible.size()
    angular.element(elem).addClass('events-overload')
    visible.eq(visible.size()-1).addClass('last-visible')
  else
    angular.element(elem).removeClass('events-overload')

angular.module('mwl.calendar').directive(
  'mwlEventsListOverflow'
  [
    '$timeout'
    ($timeout) ->
      return {
        restrict: 'A'
        link: (scope, elem, attrs) ->

          $timeout(
            =>
              isEventsOverload(elem)
              angular.element(elem).on 'sizeChanged', => isEventsOverload(elem)
            100
          )

          return
      }
  ]
)