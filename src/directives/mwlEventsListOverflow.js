'use strict';
var $, angular, getVisible, isEventsOverload;

angular = require('angular');
$ = require('jquery');

$.event.special.sizeChanged = {
    remove: function() {
        $(this).children('iframe.size-changed').remove();
    },
    add: function() {
        var elm, ielm, iframe;
        elm = $(this);
        iframe = elm.children('iframe.size-changed');
        if (!iframe.length) {
            iframe = $('<iframe/>');
            iframe.addClass('size-changed');
            iframe.prependTo(this);
        }
        ielm = iframe[0];
        (ielm.contentWindow || ielm).onresize = function() {
            return elm.trigger('sizeChanged');
        };
    }
};

getVisible = function($elements, $container) {
    var $visible;
    $visible = $elements.filter(function(i, e) {
        var $e, isVisible;
        isVisible = false;
        $e = $(e);
        isVisible = $e.position().top + $e.height() <= $container.height() && $e.position().left + $e.width() <= $container.width();
        return isVisible;
    });
    return $visible;
};

isEventsOverload = function(elem) {
    var events, visible;
    events = angular.element(elem).find('.event');
    visible = getVisible(events, angular.element(elem));
    visible.removeClass('last-visible');
    if (events.length > visible.length) {
        angular.element(elem).addClass('events-overload');
        return visible.eq(visible.length - 1).addClass('last-visible');
    } else {
        return angular.element(elem).removeClass('events-overload');
    }
};

angular.module('mwl.calendar').directive('mwlEventsListOverflow', [
    '$timeout', function($timeout) {
        return {
            restrict: 'A',
            link: function(scope, elem) {
                $timeout(function() {
                    return function() {
                        isEventsOverload(elem);
                        return angular.element(elem).on('sizeChanged', function() {
                            return isEventsOverload(elem);
                        });
                    };
                }, 100);
            }
        };
    }
]);
