/**
 * angular-bootstrap-calendar - A pure AngularJS bootstrap themed responsive calendar that can display events and has views for year, month, week and day
 * @version v0.24.0
 * @link https://github.com/mattlewis92/angular-bootstrap-calendar
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular"), require("moment"), (function webpackLoadOptionalExternalModule() { try { return require("interact.js"); } catch(e) {} }()));
	else if(typeof define === 'function' && define.amd)
		define(["angular", "moment", "interact"], factory);
	else if(typeof exports === 'object')
		exports["angularBootstrapCalendarModuleName"] = factory(require("angular"), require("moment"), (function webpackLoadOptionalExternalModule() { try { return require("interact.js"); } catch(e) {} }()));
	else
		root["angularBootstrapCalendarModuleName"] = factory(root["angular"], root["moment"], root["interact"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_12__, __WEBPACK_EXTERNAL_MODULE_20__, __WEBPACK_EXTERNAL_MODULE_44__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(8);

	var angular = __webpack_require__(12);
	__webpack_require__(13);

	function requireAll(r) {
	  r.keys().forEach(r);
	}

	var templates = {};

	if (false) {

	  var templatesContext = require.context('./templates', false, /\.html/);

	  templatesContext.keys().forEach(function(templateName) {
	    var templateNameWithoutPrefix = templateName.replace('./', '');
	    var cacheTemplateName = 'mwl/' + templateNameWithoutPrefix;
	    var configTemplateName = templateNameWithoutPrefix.replace('.html', '');
	    templates[configTemplateName] = {
	      cacheTemplateName: cacheTemplateName,
	      template: templatesContext(templateName)
	    };
	  });

	}

	module.exports = angular
	  .module('mwl.calendar', ['ang-drag-drop'])
	  .config(["calendarConfig", function(calendarConfig) {
	    angular.forEach(templates, function(template, templateName) {
	      if (!calendarConfig.templates[templateName]) {
	        calendarConfig.templates[templateName] = template.cacheTemplateName;
	      }
	    });
	  }])
	  .run(["$templateCache", "$interpolate", function($templateCache, $interpolate) {

	    angular.forEach(templates, function(template) {
	      if (!$templateCache.get(template.cacheTemplateName)) {
	        var templateContents = template.template
	          .replace('{{', $interpolate.startSymbol())
	          .replace('}}', $interpolate.endSymbol());
	        $templateCache.put(template.cacheTemplateName, templateContents);
	      }
	    });

	  }]).name;

	requireAll(__webpack_require__(15));
	requireAll(__webpack_require__(33));
	requireAll(__webpack_require__(38));


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_12__;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(14);
	module.exports = 'ang-drag-drop';


/***/ },
/* 14 */
/***/ function(module, exports) {

	(function(angular) {
	    'use strict';

	    function isDnDsSupported() {
	        return 'ondrag' in document.createElement('a');
	    }

	    function determineEffectAllowed(e) {
	        if(e.originalEvent) {
	          e.dataTransfer = e.originalEvent.dataTransfer;
	        }

	        // Chrome doesn't set dropEffect, so we have to work it out ourselves
	        if (typeof e.dataTransfer !== 'undefined' && e.dataTransfer.dropEffect === 'none') {
	            if (e.dataTransfer.effectAllowed === 'copy' ||
	                e.dataTransfer.effectAllowed === 'move') {
	                e.dataTransfer.dropEffect = e.dataTransfer.effectAllowed;
	            } else if (e.dataTransfer.effectAllowed === 'copyMove' || e.dataTransfer.effectAllowed === 'copymove') {
	                e.dataTransfer.dropEffect = e.ctrlKey ? 'copy' : 'move';
	            }
	        }
	    }

	    if (!isDnDsSupported()) {
	        angular.module('ang-drag-drop', []);
	        return;
	    }

	    var module = angular.module('ang-drag-drop', []);

	    module.directive('uiDraggable', ['$parse', '$rootScope', '$dragImage', function($parse, $rootScope, $dragImage) {
	        return function(scope, element, attrs) {
	            var isDragHandleUsed = false,
	                dragHandleClass,
	                draggingClass = attrs.draggingClass || 'on-dragging',
	                dragTarget;

	            element.attr('draggable', false);

	            scope.$watch(attrs.uiDraggable, function(newValue) {
	                if (newValue) {
	                    element.attr('draggable', newValue);
	                    element.bind('dragend', dragendHandler);
	                    element.bind('dragstart', dragstartHandler);
	                }
	                else {
	                    element.removeAttr('draggable');
	                    element.unbind('dragend', dragendHandler);
	                    element.unbind('dragstart', dragstartHandler);
	                }

	            });

	            if (angular.isString(attrs.dragHandleClass)) {
	                isDragHandleUsed = true;
	                dragHandleClass = attrs.dragHandleClass.trim() || 'drag-handle';

	                element.bind('mousedown', function(e) {
	                    dragTarget = e.target;
	                });
	            }

	            function dragendHandler(e) {
	                if(e.originalEvent) {
	                  e.dataTransfer = e.originalEvent.dataTransfer;
	                }

	                setTimeout(function() {
	                    element.unbind('$destroy', dragendHandler);
	                }, 0);
	                var sendChannel = attrs.dragChannel || 'defaultchannel';
	                $rootScope.$broadcast('ANGULAR_DRAG_END', e, sendChannel);

	                determineEffectAllowed(e);

	                if (e.dataTransfer && e.dataTransfer.dropEffect !== 'none') {
	                    if (attrs.onDropSuccess) {
	                        var onDropSuccessFn = $parse(attrs.onDropSuccess);
	                        scope.$evalAsync(function() {
	                            onDropSuccessFn(scope, {$event: e});
	                        });
	                    }
	                }else if (e.dataTransfer && e.dataTransfer.dropEffect === 'none'){
	                    if (attrs.onDropFailure) {
	                        var onDropFailureFn = $parse(attrs.onDropFailure);
	                        scope.$evalAsync(function() {
	                            onDropFailureFn(scope, {$event: e});
	                        });
	                    }
	                }
	                element.removeClass(draggingClass);
	            }

	            function setDragElement(e, dragImageElementId) {
	                var dragImageElementFn;

	                if(e.originalEvent) {
	                  e.dataTransfer = e.originalEvent.dataTransfer;
	                }

	                dragImageElementFn = $parse(dragImageElementId);

	                scope.$apply(function() {
	                    var elementId = dragImageElementFn(scope, {$event: e}),
	                        dragElement;

	                    if (!(elementId && angular.isString(elementId))) {
	                        return;
	                    }

	                    dragElement = document.getElementById(elementId);

	                    if (!dragElement) {
	                        return;
	                    }

	                    e.dataTransfer.setDragImage(dragElement, 0, 0);
	                });
	            }

	            function dragstartHandler(e) {
	                if(e.originalEvent) {
	                  e.dataTransfer = e.originalEvent.dataTransfer;
	                }

	                var isDragAllowed = !isDragHandleUsed || dragTarget.classList.contains(dragHandleClass);

	                if (isDragAllowed) {
	                    var sendChannel = attrs.dragChannel || 'defaultchannel';
	                    var dragData = '';
	                    if (attrs.drag) {
	                        dragData = scope.$eval(attrs.drag);
	                    }

	                    var dragImage = attrs.dragImage || null;

	                    element.addClass(draggingClass);
	                    element.bind('$destroy', dragendHandler);

	                    //Code to make sure that the setDragImage is available. IE 10, 11, and Opera do not support setDragImage.
	                    var hasNativeDraggable = !(document.uniqueID || window.opera);

	                    //If there is a draggable image passed in, then set the image to be dragged.
	                    if (dragImage && hasNativeDraggable) {
	                        var dragImageFn = $parse(attrs.dragImage);
	                        scope.$apply(function() {
	                            var dragImageParameters = dragImageFn(scope, {$event: e});
	                            if (dragImageParameters) {
	                                if (angular.isString(dragImageParameters)) {
	                                    dragImageParameters = $dragImage.generate(dragImageParameters);
	                                }
	                                if (dragImageParameters.image) {
	                                    var xOffset = dragImageParameters.xOffset || 0,
	                                        yOffset = dragImageParameters.yOffset || 0;
	                                    e.dataTransfer.setDragImage(dragImageParameters.image, xOffset, yOffset);
	                                }
	                            }
	                        });
	                    } else if (attrs.dragImageElementId) {
	                        setDragElement(e, attrs.dragImageElementId);
	                    }

	                    var offset = {x: e.offsetX, y: e.offsetY};
	                    var transferDataObject = {data: dragData, channel: sendChannel, offset: offset};
	                    var transferDataText = angular.toJson(transferDataObject);

	                    e.dataTransfer.setData('text', transferDataText);
	                    e.dataTransfer.effectAllowed = 'copyMove';

	                    $rootScope.$broadcast('ANGULAR_DRAG_START', e, sendChannel, transferDataObject);
	                }
	                else {
	                    e.preventDefault();
	                }
	            }
	        };
	    }
	    ]);

	    module.directive('uiOnDrop', ['$parse', '$rootScope', function($parse, $rootScope) {
	        return function(scope, element, attr) {
	            var dragging = 0; //Ref. http://stackoverflow.com/a/10906204
	            var dropChannel = attr.dropChannel || 'defaultchannel';
	            var dragChannel = '';
	            var dragEnterClass = attr.dragEnterClass || 'on-drag-enter';
	            var dragHoverClass = attr.dragHoverClass || 'on-drag-hover';
	            var customDragEnterEvent = $parse(attr.onDragEnter);
	            var customDragLeaveEvent = $parse(attr.onDragLeave);

	            function calculateDropOffset(e) {
	                var offset = {
	                    x: e.offsetX,
	                    y: e.offsetY
	                };
	                var target = e.target;

	                while (target !== element[0]) {
	                    offset.x = offset.x + target.offsetLeft;
	                    offset.y = offset.y + target.offsetTop;

	                    target = target.offsetParent;
	                    if (!target) {
	                        return null;
	                    }
	                }

	                return offset;
	            }

	            function onDragOver(e) {
	                if (e.preventDefault) {
	                    e.preventDefault(); // Necessary. Allows us to drop.
	                }

	                if (e.stopPropagation) {
	                    e.stopPropagation();
	                }

	                var uiOnDragOverFn = $parse(attr.uiOnDragOver);
	                scope.$evalAsync(function() {
	                    uiOnDragOverFn(scope, {$event: e, $channel: dropChannel});
	                });

	                return false;
	            }

	            function onDragLeave(e) {
	                if (e.preventDefault) {
	                    e.preventDefault();
	                }

	                if (e.stopPropagation) {
	                    e.stopPropagation();
	                }
	                dragging--;

	                if (dragging === 0) {
	                    scope.$evalAsync(function() {
	                        customDragLeaveEvent(scope, {$event: e, $channel: dropChannel});
	                    });
	                    element.addClass(dragEnterClass);
	                    element.removeClass(dragHoverClass);
	                }

	                var uiOnDragLeaveFn = $parse(attr.uiOnDragLeave);
	                scope.$evalAsync(function() {
	                    uiOnDragLeaveFn(scope, {$event: e, $channel: dropChannel});
	                });
	            }

	            function onDragEnter(e) {
	                if (e.preventDefault) {
	                    e.preventDefault();
	                }

	                if (e.stopPropagation) {
	                    e.stopPropagation();
	                }

	                if (dragging === 0) {
	                    scope.$evalAsync(function() {
	                        customDragEnterEvent(scope, {$event: e, $channel: dropChannel});
	                    });
	                    element.removeClass(dragEnterClass);
	                    element.addClass(dragHoverClass);
	                }
	                dragging++;

	                var uiOnDragEnterFn = $parse(attr.uiOnDragEnter);
	                scope.$evalAsync(function() {
	                    uiOnDragEnterFn(scope, {$event: e, $channel: dropChannel});
	                });

	                $rootScope.$broadcast('ANGULAR_HOVER', dragChannel);
	            }

	            function onDrop(e) {
	                if(e.originalEvent) {
	                  e.dataTransfer = e.originalEvent.dataTransfer;
	                }

	                if (e.preventDefault) {
	                    e.preventDefault(); // Necessary. Allows us to drop.
	                }
	                if (e.stopPropagation) {
	                    e.stopPropagation(); // Necessary. Allows us to drop.
	                }

	                var sendData = e.dataTransfer.getData('text');
	                sendData = angular.fromJson(sendData);

	                var dropOffset = calculateDropOffset(e);
	                
	                var position = dropOffset ? {
	                    x: dropOffset.x - sendData.offset.x,
	                    y: dropOffset.y - sendData.offset.y
	                } : null;
	                
	                determineEffectAllowed(e);

	                var uiOnDropFn = $parse(attr.uiOnDrop);
	                scope.$evalAsync(function() {
	                    uiOnDropFn(scope, {$data: sendData.data, $event: e, $channel: sendData.channel, $position: position});
	                });
	                element.removeClass(dragEnterClass);
	                dragging = 0;
	            }
	            
	            function isDragChannelAccepted(dragChannel, dropChannel) {
	                if (dropChannel === '*') {
	                    return true;
	                }

	                var channelMatchPattern = new RegExp('(\\s|[,])+(' + dragChannel + ')(\\s|[,])+', 'i');

	                return channelMatchPattern.test(',' + dropChannel + ',');
	            }

	            function preventNativeDnD(e) {
	                if(e.originalEvent) {
	                  e.dataTransfer = e.originalEvent.dataTransfer;
	                }

	                if (e.preventDefault) {
	                    e.preventDefault();
	                }
	                if (e.stopPropagation) {
	                    e.stopPropagation();
	                }
	                e.dataTransfer.dropEffect = 'none';
	                return false;
	            }

	            var deregisterDragStart = $rootScope.$on('ANGULAR_DRAG_START', function(_, e, channel, transferDataObject) {
	                dragChannel = channel;

	                var valid = true;

	                if (!isDragChannelAccepted(channel, dropChannel)) {
	                    valid = false;
	                }

	                if (valid && attr.dropValidate) {
	                    var validateFn = $parse(attr.dropValidate);
	                    valid = validateFn(scope, {
	                        $drop: {scope: scope, element: element},
	                        $event: e,
	                        $data: transferDataObject.data,
	                        $channel: transferDataObject.channel
	                    });
	                }

	                if (valid) {
	                    element.bind('dragover', onDragOver);
	                    element.bind('dragenter', onDragEnter);
	                    element.bind('dragleave', onDragLeave);
	                    element.bind('drop', onDrop);

	                    element.addClass(dragEnterClass);
	                } else {
	                    element.bind('dragover', preventNativeDnD);
	                    element.bind('dragenter', preventNativeDnD);
	                    element.bind('dragleave', preventNativeDnD);
	                    element.bind('drop', preventNativeDnD);

	                    element.removeClass(dragEnterClass);
	                }

	            });


	            var deregisterDragEnd = $rootScope.$on('ANGULAR_DRAG_END', function() {
	                element.unbind('dragover', onDragOver);
	                element.unbind('dragenter', onDragEnter);
	                element.unbind('dragleave', onDragLeave);

	                element.unbind('drop', onDrop);
	                element.removeClass(dragHoverClass);
	                element.removeClass(dragEnterClass);

	                element.unbind('dragover', preventNativeDnD);
	                element.unbind('dragenter', preventNativeDnD);
	                element.unbind('dragleave', preventNativeDnD);
	                element.unbind('drop', preventNativeDnD);
	            });

	            scope.$on('$destroy', function() {
	                deregisterDragStart();
	                deregisterDragEnd();
	            });


	            attr.$observe('dropChannel', function(value) {
	                if (value) {
	                    dropChannel = value;
	                }
	            });


	        };
	    }
	    ]);

	    module.constant('$dragImageConfig', {
	        height: 20,
	        width: 200,
	        padding: 10,
	        font: 'bold 11px Arial',
	        fontColor: '#eee8d5',
	        backgroundColor: '#93a1a1',
	        xOffset: 0,
	        yOffset: 0
	    });

	    module.service('$dragImage', ['$dragImageConfig', function(defaultConfig) {
	        var ELLIPSIS = '…';

	        function fitString(canvas, text, config) {
	            var width = canvas.measureText(text).width;
	            if (width < config.width) {
	                return text;
	            }
	            while (width + config.padding > config.width) {
	                text = text.substring(0, text.length - 1);
	                width = canvas.measureText(text + ELLIPSIS).width;
	            }
	            return text + ELLIPSIS;
	        }

	        this.generate = function(text, options) {
	            var config = angular.extend({}, defaultConfig, options || {});
	            var el = document.createElement('canvas');

	            el.height = config.height;
	            el.width = config.width;

	            var canvas = el.getContext('2d');

	            canvas.fillStyle = config.backgroundColor;
	            canvas.fillRect(0, 0, config.width, config.height);
	            canvas.font = config.font;
	            canvas.fillStyle = config.fontColor;

	            var title = fitString(canvas, text, config);
	            canvas.fillText(title, 4, config.padding + 4);

	            var image = new Image();
	            image.src = el.toDataURL();

	            return {
	                image: image,
	                xOffset: config.xOffset,
	                yOffset: config.yOffset
	            };
	        };
	    }
	    ]);

	}(angular));


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./mwlCalendar.js": 16,
		"./mwlCalendarDay.js": 17,
		"./mwlCalendarHourList.js": 18,
		"./mwlCalendarMonth.js": 21,
		"./mwlCalendarSlideBox.js": 22,
		"./mwlCalendarWeek.js": 23,
		"./mwlCalendarYear.js": 24,
		"./mwlCollapseFallback.js": 25,
		"./mwlDateModifier.js": 26,
		"./mwlDragSelect.js": 27,
		"./mwlDraggable.js": 28,
		"./mwlDroppable.js": 29,
		"./mwlDynamicDirectiveTemplate.js": 30,
		"./mwlElementDimensions.js": 31,
		"./mwlResizable.js": 32
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 15;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);
	var LOG_PREFIX = 'Bootstrap calendar:';

	angular
	  .module('mwl.calendar')
	  .controller('MwlCalendarCtrl', ["$scope", "$log", "$timeout", "$attrs", "$locale", "moment", "calendarTitle", "calendarHelper", function($scope, $log, $timeout, $attrs, $locale, moment, calendarTitle, calendarHelper) {

	    var vm = this;

	    if (vm.slideBoxDisabled) {
	      $log.warn(LOG_PREFIX, 'The `slide-box-disabled` option is deprecated and will be removed in the next release. ' +
	        'Instead set `cell-auto-open-disabled` to true');
	    }

	    vm.events = vm.events || [];

	    vm.changeView = function(view, newDay) {
	      vm.view = view;
	      vm.viewDate = newDay;
	    };

	    vm.dateClicked = function(date) {

	      var rawDate = moment(date).toDate();

	      var nextView = {
	        year: 'month',
	        month: 'day',
	        week: 'day'
	      };

	      if (vm.onViewChangeClick({calendarDate: rawDate, calendarNextView: nextView[vm.view]}) !== false) {
	        vm.changeView(nextView[vm.view], rawDate);
	      }

	    };

	    var previousDate = moment(vm.viewDate);
	    var previousView = vm.view;

	    function eventIsValid(event) {
	      if (!event.startsAt) {
	        $log.warn(LOG_PREFIX, 'Event is missing the startsAt field', event);
	      } else if (!angular.isDate(event.startsAt)) {
	        $log.warn(LOG_PREFIX, 'Event startsAt should be a javascript date object. Do `new Date(event.startsAt)` to fix it.', event);
	      }

	      if (event.endsAt) {
	        if (!angular.isDate(event.endsAt)) {
	          $log.warn(LOG_PREFIX, 'Event endsAt should be a javascript date object. Do `new Date(event.endsAt)` to fix it.', event);
	        }
	        if (moment(event.startsAt).isAfter(moment(event.endsAt))) {
	          $log.warn(LOG_PREFIX, 'Event cannot start after it finishes', event);
	        }
	      }

	      return true;
	    }

	    function refreshCalendar() {

	      if (calendarTitle[vm.view] && angular.isDefined($attrs.viewTitle)) {
	        vm.viewTitle = calendarTitle[vm.view](vm.viewDate);
	      }

	      vm.events = vm.events.filter(eventIsValid).map(function(event, index) {
	        Object.defineProperty(event, '$id', {enumerable: false, configurable: true, value: index});
	        return event;
	      });

	      //if on-timespan-click="calendarDay = calendarDate" is set then don't update the view as nothing needs to change
	      var currentDate = moment(vm.viewDate);
	      var shouldUpdate = true;
	      if (
	        previousDate.clone().startOf(vm.view).isSame(currentDate.clone().startOf(vm.view)) &&
	        !previousDate.isSame(currentDate) &&
	        vm.view === previousView
	      ) {
	        shouldUpdate = false;
	      }
	      previousDate = currentDate;
	      previousView = vm.view;

	      if (shouldUpdate) {
	        // a $timeout is required as $broadcast is synchronous so if a new events array is set the calendar won't update
	        $timeout(function() {
	          $scope.$broadcast('calendar.refreshView');
	        });
	      }
	    }

	    calendarHelper.loadTemplates().then(function() {
	      vm.templatesLoaded = true;

	      var eventsWatched = false;

	      //Refresh the calendar when any of these variables change.
	      $scope.$watchGroup([
	        'vm.viewDate',
	        'vm.view',
	        'vm.cellIsOpen',
	        function() {
	          return moment.locale() + $locale.id; //Auto update the calendar when the locale changes
	        }
	      ], function() {
	        if (!eventsWatched) {
	          eventsWatched = true;
	          //need to deep watch events hence why it isn't included in the watch group
	          $scope.$watch('vm.events', refreshCalendar, true); //this will call refreshCalendar when the watcher starts (i.e. now)
	        } else {
	          refreshCalendar();
	        }
	      });

	    }).catch(function(err) {
	      $log.error('Could not load all calendar templates', err);
	    });

	  }])
	  .directive('mwlCalendar', function() {

	    return {
	      template: '<div mwl-dynamic-directive-template name="calendar" overrides="vm.customTemplateUrls"></div>',
	      restrict: 'E',
	      scope: {
	        events: '=',
	        view: '=',
	        viewTitle: '=?',
	        viewDate: '=',
	        cellIsOpen: '=?',
	        cellAutoOpenDisabled: '=?',
	        slideBoxDisabled: '=?',
	        customTemplateUrls: '=?',
	        onEventClick: '&',
	        onEventTimesChanged: '&',
	        onTimespanClick: '&',
	        onDateRangeSelect: '&?',
	        onViewChangeClick: '&',
	        cellModifier: '&',
	        dayViewStart: '@',
	        dayViewEnd: '@',
	        dayViewSplit: '@',
	        dayViewEventChunkSize: '@',
	        templateScope: '=?',
	        scrollToId: '@'
	      },
	      controller: 'MwlCalendarCtrl as vm',
	      bindToController: true
	    };

	  });


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);

	angular
	  .module('mwl.calendar')
	  .controller('MwlCalendarDayCtrl', ["$scope", "moment", "calendarHelper", "calendarEventTitle", function($scope, moment, calendarHelper, calendarEventTitle) {

	    var vm = this;

	    vm.calendarEventTitle = calendarEventTitle;

	    function refreshView() {
	      vm.dayViewSplit = vm.dayViewSplit || 30;
	      vm.dayViewHeight = calendarHelper.getDayViewHeight(
	        vm.dayViewStart,
	        vm.dayViewEnd,
	        vm.dayViewSplit
	      );

	      var view = calendarHelper.getDayView(
	        vm.events,
	        vm.viewDate,
	        vm.dayViewStart,
	        vm.dayViewEnd,
	        vm.dayViewSplit
	      );

	      vm.allDayEvents = view.allDayEvents;
	      vm.nonAllDayEvents = view.events;
	      vm.viewWidth = view.width + 62;

	    }

	    $scope.$on('calendar.refreshView', refreshView);

	    $scope.$watchGroup([
	      'vm.dayViewStart',
	      'vm.dayViewEnd',
	      'vm.dayViewSplit'
	    ], refreshView);

	    vm.eventDragComplete = function(event, minuteChunksMoved) {
	      var minutesDiff = minuteChunksMoved * vm.dayViewSplit;
	      var newStart = moment(event.startsAt).add(minutesDiff, 'minutes');
	      var newEnd = moment(event.endsAt).add(minutesDiff, 'minutes');
	      delete event.tempStartsAt;

	      vm.onEventTimesChanged({
	        calendarEvent: event,
	        calendarNewEventStart: newStart.toDate(),
	        calendarNewEventEnd: event.endsAt ? newEnd.toDate() : null
	      });
	    };

	    vm.eventDragged = function(event, minuteChunksMoved) {
	      var minutesDiff = minuteChunksMoved * vm.dayViewSplit;
	      event.tempStartsAt = moment(event.startsAt).add(minutesDiff, 'minutes').toDate();
	    };

	    vm.eventResizeComplete = function(event, edge, minuteChunksMoved) {
	      var minutesDiff = minuteChunksMoved * vm.dayViewSplit;
	      var start = moment(event.startsAt);
	      var end = moment(event.endsAt);
	      if (edge === 'start') {
	        start.add(minutesDiff, 'minutes');
	      } else {
	        end.add(minutesDiff, 'minutes');
	      }
	      delete event.tempStartsAt;

	      vm.onEventTimesChanged({
	        calendarEvent: event,
	        calendarNewEventStart: start.toDate(),
	        calendarNewEventEnd: end.toDate()
	      });
	    };

	    vm.eventResized = function(event, edge, minuteChunksMoved) {
	      var minutesDiff = minuteChunksMoved * vm.dayViewSplit;
	      if (edge === 'start') {
	        event.tempStartsAt = moment(event.startsAt).add(minutesDiff, 'minutes').toDate();
	      }
	    };

	  }])
	  .directive('mwlCalendarDay', ["$timeout", function($timeout) {

	    return {
	      template: '<div mwl-dynamic-directive-template name="calendarDayView" overrides="vm.customTemplateUrls"></div>',
	      restrict: 'E',
	      require: '^mwlCalendar',
	      scope: {
	        events: '=',
	        viewDate: '=',
	        onEventClick: '=',
	        onEventTimesChanged: '=',
	        onTimespanClick: '=',
	        onDateRangeSelect: '=',
	        dayViewStart: '=',
	        dayViewEnd: '=',
	        dayViewSplit: '=',
	        dayViewEventChunkSize: '=',
	        customTemplateUrls: '=?',
	        cellModifier: '=',
	        templateScope: '=',
	        scrollToId: '='

	      },
	      // link: function(scope, element, attrs, calendarCtrl) {
	      //   $timeout(function() {
	      //     var container = document.getElementById('daypanel'),
	      //         hour = document.getElementById(scope.vm.scrollToId);
	      //     if (hour !== null) {
	      //       container.scrollTop = hour.offsetTop;
	      //     }
	      //   }, 1);
	      //
	      // },
	      controller: 'MwlCalendarDayCtrl as vm',
	      bindToController: true
	    };

	  }]);


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);
	var calendarUtils = __webpack_require__(19);

	angular
	  .module('mwl.calendar')
	  .controller('MwlCalendarHourListCtrl', ["$scope", "moment", "calendarHelper", "calendarConfig", function($scope, moment, calendarHelper, calendarConfig) {
	    var vm = this;

	    function updateDays() {

	      vm.dayViewSplit = parseInt(vm.dayViewSplit);
	      var dayStart = (vm.dayViewStart || '00:00').split(':');
	      var dayEnd = (vm.dayViewEnd || '23:59').split(':');
	      vm.hourGrid = calendarUtils.getDayViewHourGrid({
	        viewDate: vm.weekView ? moment(vm.viewDate).startOf('week').toDate() : moment(vm.viewDate).toDate(),
	        hourSegments: 60 / vm.dayViewSplit,
	        dayStart: {
	          hour: dayStart[0],
	          minute: dayStart[1]
	        },
	        dayEnd: {
	          hour: dayEnd[0],
	          minute: dayEnd[1]
	        }
	      });

	      vm.hourGrid.forEach(function(hour) {
	        hour.segments.forEach(function(segment) {

	          if (calendarConfig.showTimesOnWeekView) {

	            segment.days = [];

	            for (var i = 0; i < 7; i++) {
	              var day = {
	                date: moment(segment.date).add(i, 'days')
	              };
	              vm.cellModifier({calendarCell: day});
	              segment.days.push(day);
	            }

	          } else {
	            vm.cellModifier({calendarCell: segment});
	          }
	        });
	      });

	    }

	    var originalLocale = moment.locale();

	    $scope.$on('calendar.refreshView', function() {

	      if (originalLocale !== moment.locale()) {
	        originalLocale = moment.locale();
	        updateDays();
	      }

	    });

	    $scope.$watchGroup([
	      'vm.dayViewStart',
	      'vm.dayViewEnd',
	      'vm.dayViewSplit',
	      'vm.viewDate'
	    ], function() {
	      updateDays();
	    });

	    vm.eventDropped = function(event, date) {
	      var newStart = moment(date);
	      var newEnd = calendarHelper.adjustEndDateFromStartDiff(event.startsAt, newStart, event.endsAt);

	      vm.onEventTimesChanged({
	        calendarEvent: event,
	        calendarDate: date,
	        calendarNewEventStart: newStart.toDate(),
	        calendarNewEventEnd: newEnd ? newEnd.toDate() : null
	      });
	    };

	    vm.getClickedDate = function(baseDate, minutes, days) {
	      return moment(baseDate).clone().startOf('hour').add(minutes, 'minutes').add(days || 0, 'days').toDate();
	    };

	    vm.onDragSelectStart = function(date, dayIndex) {
	      if (!vm.dateRangeSelect) {
	        vm.dateRangeSelect = {
	          active: true,
	          startDate: date,
	          endDate: date,
	          dayIndex: dayIndex
	        };
	      }
	    };

	    vm.onDragSelectMove = function(date) {
	      if (vm.dateRangeSelect) {
	        vm.dateRangeSelect.endDate = date;
	      }
	    };

	    vm.onDragSelectEnd = function(date) {
	      vm.dateRangeSelect.endDate = date;
	      if (vm.dateRangeSelect.endDate > vm.dateRangeSelect.startDate) {
	        vm.onDateRangeSelect({calendarRangeStartDate: vm.dateRangeSelect.startDate, calendarRangeEndDate: vm.dateRangeSelect.endDate});
	      }
	      delete vm.dateRangeSelect;
	    };

	  }])
	  .directive('mwlCalendarHourList', ["$timeout", function($timeout) {

	    return {
	      restrict: 'E',
	      template: '<div mwl-dynamic-directive-template name="calendarHourList" overrides="vm.customTemplateUrls"></div>',
	      controller: 'MwlCalendarHourListCtrl as vm',
	      scope: {
	        viewDate: '=',
	        dayViewStart: '=',
	        dayViewEnd: '=',
	        dayViewSplit: '=',
	        dayWidth: '=?',
	        onTimespanClick: '=',
	        onDateRangeSelect: '=',
	        onEventTimesChanged: '=',
	        customTemplateUrls: '=?',
	        cellModifier: '=',
	        templateScope: '=',
	        scrollToId: '=',
	        weekView: '<'
	      },
	      link: function(scope, element, attrs, calendarCtrl) {
	        scope.vm.calendarCtrl = calendarCtrl;
	        $timeout(function() {
	          var container = document.getElementById('daypanel'),
	              hour = document.getElementById(scope.vm.scrollToId);
	          if (hour !== null) {
	            container.scrollTop = hour.offsetTop;
	          }
	        }, 1);

	      },
	      bindToController: true
	    };

	  }]);


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory(__webpack_require__(20));
		else if(typeof define === 'function' && define.amd)
			define(["moment"], factory);
		else if(typeof exports === 'object')
			exports["calendarUtils"] = factory(require("moment"));
		else
			root["calendarUtils"] = factory(root["moment"]);
	})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	/******/
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
	/******/
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {

		"use strict";
		var moment = __webpack_require__(1);
		var WEEKEND_DAY_NUMBERS = [0, 6];
		var DAYS_IN_WEEK = 7;
		var HOURS_IN_DAY = 24;
		var MINUTES_IN_HOUR = 60;
		var getDaySpan = function (event, offset, startOfWeek) {
		    var span = 1;
		    if (event.end) {
		        var begin = moment(event.start).isBefore(startOfWeek) ? startOfWeek : moment(event.start);
		        span = moment(event.end)
		            .endOf('day')
		            .add(1, 'minute')
		            .diff(begin.startOf('day'), 'days');
		        if (span > DAYS_IN_WEEK) {
		            span = DAYS_IN_WEEK;
		        }
		    }
		    var totalLength = offset + span;
		    if (totalLength > DAYS_IN_WEEK) {
		        span -= (totalLength - DAYS_IN_WEEK);
		    }
		    return span;
		};
		exports.getDayOffset = function (event, startOfWeek) {
		    var offset = 0;
		    if (moment(event.start).startOf('day').isAfter(moment(startOfWeek))) {
		        offset = moment(event.start).startOf('day').diff(startOfWeek, 'days');
		    }
		    return offset;
		};
		var isEventIsPeriod = function (_a) {
		    var event = _a.event, periodStart = _a.periodStart, periodEnd = _a.periodEnd;
		    var eventStart = moment(event.start);
		    var eventEnd = moment(event.end || event.start);
		    if (eventStart.isAfter(periodStart) && eventStart.isBefore(periodEnd)) {
		        return true;
		    }
		    if (eventEnd.isAfter(periodStart) && eventEnd.isBefore(periodEnd)) {
		        return true;
		    }
		    if (eventStart.isBefore(periodStart) && eventEnd.isAfter(periodEnd)) {
		        return true;
		    }
		    if (eventStart.isSame(periodStart) || eventStart.isSame(periodEnd)) {
		        return true;
		    }
		    if (eventEnd.isSame(periodStart) || eventEnd.isSame(periodEnd)) {
		        return true;
		    }
		    return false;
		};
		var getEventsInPeriod = function (_a) {
		    var events = _a.events, periodStart = _a.periodStart, periodEnd = _a.periodEnd;
		    return events.filter(function (event) { return isEventIsPeriod({ event: event, periodStart: periodStart, periodEnd: periodEnd }); });
		};
		var getWeekDay = function (_a) {
		    var date = _a.date;
		    var today = moment().startOf('day');
		    return {
		        date: date,
		        isPast: date.isBefore(today),
		        isToday: date.isSame(today),
		        isFuture: date.isAfter(today),
		        isWeekend: WEEKEND_DAY_NUMBERS.indexOf(date.day()) > -1
		    };
		};
		exports.getWeekViewHeader = function (_a) {
		    var viewDate = _a.viewDate;
		    var start = moment(viewDate).startOf('week');
		    var days = [];
		    for (var i = 0; i < DAYS_IN_WEEK; i++) {
		        var date = start.clone().add(i, 'days');
		        days.push(getWeekDay({ date: date }));
		    }
		    return days;
		};
		exports.getWeekView = function (_a) {
		    var events = _a.events, viewDate = _a.viewDate;
		    var startOfWeek = moment(viewDate).startOf('week');
		    var endOfWeek = moment(viewDate).endOf('week');
		    var eventsMapped = getEventsInPeriod({ events: events, periodStart: startOfWeek, periodEnd: endOfWeek }).map(function (event) {
		        var offset = exports.getDayOffset(event, startOfWeek);
		        var span = getDaySpan(event, offset, startOfWeek);
		        return {
		            event: event,
		            offset: offset,
		            span: span,
		            startsBeforeWeek: moment(event.start).isBefore(startOfWeek),
		            endsAfterWeek: moment(event.end || event.start).isAfter(endOfWeek)
		        };
		    }).sort(function (itemA, itemB) {
		        var startSecondsDiff = moment(itemA.event.start).diff(moment(itemB.event.start));
		        if (startSecondsDiff === 0) {
		            var endA = moment(itemA.event.end || itemA.event.start);
		            var endB = moment(itemB.event.end || itemB.event.start);
		            return moment(endB).diff(endA);
		        }
		        return startSecondsDiff;
		    });
		    var eventRows = [];
		    var allocatedEvents = [];
		    eventsMapped.forEach(function (event, index) {
		        if (allocatedEvents.indexOf(event) === -1) {
		            allocatedEvents.push(event);
		            var rowSpan_1 = event.span + event.offset;
		            var otherRowEvents = eventsMapped.slice(index + 1).filter(function (nextEvent) {
		                if (allocatedEvents.indexOf(nextEvent) === -1 &&
		                    nextEvent.offset >= rowSpan_1 &&
		                    rowSpan_1 + nextEvent.span <= DAYS_IN_WEEK) {
		                    nextEvent.offset -= rowSpan_1;
		                    rowSpan_1 += nextEvent.span + nextEvent.offset;
		                    allocatedEvents.push(nextEvent);
		                    return true;
		                }
		            });
		            eventRows.push({
		                row: [
		                    event
		                ].concat(otherRowEvents)
		            });
		        }
		    });
		    return eventRows;
		};
		exports.getMonthView = function (_a) {
		    var events = _a.events, viewDate = _a.viewDate;
		    var start = moment(viewDate).startOf('month').startOf('week');
		    var end = moment(viewDate).endOf('month').endOf('week');
		    var eventsInMonth = getEventsInPeriod({
		        events: events,
		        periodStart: start,
		        periodEnd: end
		    });
		    var days = [];
		    for (var i = 0; i < end.diff(start, 'days') + 1; i++) {
		        var date = start.clone().add(i, 'days');
		        var day = getWeekDay({ date: date });
		        var events_1 = getEventsInPeriod({
		            events: eventsInMonth,
		            periodStart: moment(date).startOf('day'),
		            periodEnd: moment(date).endOf('day')
		        });
		        day.inMonth = date.clone().startOf('month').isSame(moment(viewDate).startOf('month'));
		        day.events = events_1;
		        day.badgeTotal = events_1.length;
		        days.push(day);
		    }
		    var rows = Math.floor(days.length / 7);
		    var rowOffsets = [];
		    for (var i = 0; i < rows; i++) {
		        rowOffsets.push(i * 7);
		    }
		    return {
		        rowOffsets: rowOffsets,
		        days: days
		    };
		};
		exports.getDayView = function (_a) {
		    var events = _a.events, viewDate = _a.viewDate, hourSegments = _a.hourSegments, dayStart = _a.dayStart, dayEnd = _a.dayEnd, eventWidth = _a.eventWidth, segmentHeight = _a.segmentHeight;
		    var startOfView = moment(viewDate)
		        .startOf('day')
		        .hour(dayStart.hour)
		        .minute(dayStart.minute);
		    var endOfView = moment(viewDate)
		        .endOf('day')
		        .startOf('minute')
		        .hour(dayEnd.hour)
		        .minute(dayEnd.minute);
		    var previousDayEvents = [];
		    var dayViewEvents = getEventsInPeriod({
		        events: events.filter(function (event) { return !event.allDay; }),
		        periodStart: startOfView,
		        periodEnd: endOfView
		    }).sort(function (eventA, eventB) {
		        return eventA.start.valueOf() - eventB.start.valueOf();
		    }).map(function (event) {
		        var eventStart = event.start;
		        var eventEnd = event.end || eventStart;
		        var startsBeforeDay = eventStart < startOfView.toDate();
		        var endsAfterDay = eventEnd > endOfView.toDate();
		        var hourHeightModifier = (hourSegments * segmentHeight) / MINUTES_IN_HOUR;
		        var top = 0;
		        if (eventStart > startOfView.toDate()) {
		            top += moment(eventStart).diff(startOfView, 'minutes');
		        }
		        top *= hourHeightModifier;
		        var startDate = startsBeforeDay ? startOfView : moment(eventStart);
		        var endDate = endsAfterDay ? endOfView : moment(eventEnd);
		        var height = endDate.diff(startDate, 'minutes');
		        if (!event.end) {
		            height = segmentHeight;
		        }
		        else {
		            height *= hourHeightModifier;
		        }
		        var bottom = top + height;
		        var overlappingPreviousEvents = previousDayEvents.filter(function (previousEvent) {
		            var previousEventTop = previousEvent.top;
		            var previousEventBottom = previousEvent.top + previousEvent.height;
		            if (top < previousEventTop && previousEventTop < bottom) {
		                return true;
		            }
		            else if (top < previousEventBottom && previousEventBottom < bottom) {
		                return true;
		            }
		            else if (previousEventTop <= top && bottom <= previousEventBottom) {
		                return true;
		            }
		            return false;
		        });
		        var dayEvent = {
		            event: event,
		            height: height,
		            width: eventWidth,
		            top: top,
		            left: overlappingPreviousEvents.length * eventWidth,
		            startsBeforeDay: startsBeforeDay,
		            endsAfterDay: endsAfterDay
		        };
		        if (height > 0) {
		            previousDayEvents.push(dayEvent);
		        }
		        return dayEvent;
		    }).filter(function (dayEvent) { return dayEvent.height > 0; });
		    var width = Math.max.apply(Math, dayViewEvents.map(function (event) { return event.left + event.width; }));
		    var allDayEvents = getEventsInPeriod({
		        events: events.filter(function (event) { return event.allDay; }),
		        periodStart: startOfView,
		        periodEnd: endOfView
		    });
		    return {
		        events: dayViewEvents,
		        width: width,
		        allDayEvents: allDayEvents
		    };
		};
		exports.getDayViewHourGrid = function (_a) {
		    var viewDate = _a.viewDate, hourSegments = _a.hourSegments, dayStart = _a.dayStart, dayEnd = _a.dayEnd;
		    var hours = [];
		    var startOfView = moment(viewDate).startOf('day').hour(dayStart.hour).minute(dayStart.minute);
		    var endOfView = moment(viewDate).endOf('day').startOf('minute').hour(dayEnd.hour).minute(dayEnd.minute);
		    var segmentDuration = MINUTES_IN_HOUR / hourSegments;
		    var startOfDay = moment(viewDate).startOf('day');
		    for (var i = 0; i < HOURS_IN_DAY; i++) {
		        var segments = [];
		        for (var j = 0; j < hourSegments; j++) {
		            var date = startOfDay.clone().add(i, 'hours').add(j * segmentDuration, 'minutes');
		            if (date >= startOfView && date < endOfView) {
		                segments.push({
		                    date: date,
		                    isStart: j === 0
		                });
		            }
		        }
		        if (segments.length > 0) {
		            hours.push({ segments: segments });
		        }
		    }
		    return hours;
		};


	/***/ },
	/* 1 */
	/***/ function(module, exports) {

		module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

	/***/ }
	/******/ ])
	});
	;
	//# sourceMappingURL=calendarUtils.js.map

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_20__;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);

	angular
	  .module('mwl.calendar')
	  .controller('MwlCalendarMonthCtrl', ["$scope", "moment", "calendarHelper", "calendarConfig", "calendarEventTitle", function($scope, moment, calendarHelper, calendarConfig, calendarEventTitle) {

	    var vm = this;
	    vm.calendarConfig = calendarConfig;
	    vm.calendarEventTitle = calendarEventTitle;
	    vm.openRowIndex = null;

	    function toggleCell() {
	      vm.openRowIndex = null;
	      vm.openDayIndex = null;

	      if (vm.cellIsOpen && vm.view) {
	        vm.view.forEach(function(day, dayIndex) {
	          if (moment(vm.viewDate).startOf('day').isSame(day.date)) {
	            vm.openDayIndex = dayIndex;
	            vm.openRowIndex = Math.floor(dayIndex / 7);
	          }
	        });
	      }
	    }

	    $scope.$on('calendar.refreshView', function() {

	      vm.weekDays = calendarHelper.getWeekDayNames();

	      var monthView = calendarHelper.getMonthView(vm.events, vm.viewDate, vm.cellModifier);
	      vm.view = monthView.days;
	      vm.monthOffsets = monthView.rowOffsets;

	      if (vm.cellAutoOpenDisabled) {
	        toggleCell();
	      } else if (!vm.cellAutoOpenDisabled && vm.cellIsOpen && vm.openRowIndex === null) {
	        //Auto open the calendar to the current day if set
	        vm.openDayIndex = null;
	        vm.view.forEach(function(day) {
	          if (day.inMonth && moment(vm.viewDate).startOf('day').isSame(day.date)) {
	            vm.dayClicked(day, true);
	          }
	        });
	      }

	    });

	    if (vm.cellAutoOpenDisabled) {
	      $scope.$watchGroup([
	        'vm.cellIsOpen',
	        'vm.viewDate'
	      ], toggleCell);
	    }

	    vm.dayClicked = function(day, dayClickedFirstRun, $event) {

	      if (!dayClickedFirstRun) {
	        vm.onTimespanClick({
	          calendarDate: day.date.toDate(),
	          calendarCell: day,
	          $event: $event
	        });
	        if ($event && $event.defaultPrevented) {
	          return;
	        }
	      }

	      if (!vm.cellAutoOpenDisabled) {
	        vm.openRowIndex = null;
	        var dayIndex = vm.view.indexOf(day);
	        if (dayIndex === vm.openDayIndex) { //the day has been clicked and is already open
	          vm.openDayIndex = null; //close the open day
	          vm.cellIsOpen = false;
	        } else {
	          vm.openDayIndex = dayIndex;
	          vm.openRowIndex = Math.floor(dayIndex / 7);
	          vm.cellIsOpen = true;
	        }
	      }

	    };

	    vm.highlightEvent = function(event, shouldAddClass) {

	      vm.view.forEach(function(day) {
	        delete day.highlightClass;
	        delete day.backgroundColor;
	        if (shouldAddClass) {
	          var dayContainsEvent = day.events.indexOf(event) > -1;
	          if (dayContainsEvent) {
	            day.backgroundColor = event.color ? event.color.secondary : '';
	          }
	        }
	      });

	    };

	    vm.handleEventDrop = function(event, newDayDate, draggedFromDate) {

	      var newStart = moment(event.startsAt)
	        .date(moment(newDayDate).date())
	        .month(moment(newDayDate).month())
	        .year(moment(newDayDate).year());

	      var newEnd = calendarHelper.adjustEndDateFromStartDiff(event.startsAt, newStart, event.endsAt);

	      vm.onEventTimesChanged({
	        calendarEvent: event,
	        calendarDate: newDayDate,
	        calendarNewEventStart: newStart.toDate(),
	        calendarNewEventEnd: newEnd ? newEnd.toDate() : null,
	        calendarDraggedFromDate: draggedFromDate
	      });
	    };

	    vm.getWeekNumberLabel = function(day) {
	      var weekNumber = day.date.clone().add(1, 'day').isoWeek();
	      if (typeof calendarConfig.i18nStrings.weekNumber === 'function') {
	        return calendarConfig.i18nStrings.weekNumber({weekNumber: weekNumber});
	      } else {
	        return calendarConfig.i18nStrings.weekNumber.replace('{week}', weekNumber);
	      }
	    };

	    vm.onDragSelectStart = function(day) {
	      if (!vm.dateRangeSelect) {
	        vm.dateRangeSelect = {
	          startDate: day.date,
	          endDate: day.date
	        };
	      }
	    };

	    vm.onDragSelectMove = function(day) {
	      if (vm.dateRangeSelect) {
	        vm.dateRangeSelect.endDate = day.date;
	      }
	    };

	    vm.onDragSelectEnd = function(day) {
	      vm.dateRangeSelect.endDate = day.date;
	      if (vm.dateRangeSelect.endDate > vm.dateRangeSelect.startDate) {
	        vm.onDateRangeSelect({
	          calendarRangeStartDate: vm.dateRangeSelect.startDate.clone().startOf('day').toDate(),
	          calendarRangeEndDate: vm.dateRangeSelect.endDate.clone().endOf('day').toDate()
	        });
	      }
	      delete vm.dateRangeSelect;
	    };

	  }])
	  .directive('mwlCalendarMonth', function() {

	    return {
	      template: '<div mwl-dynamic-directive-template name="calendarMonthView" overrides="vm.customTemplateUrls"></div>',
	      restrict: 'E',
	      require: '^mwlCalendar',
	      scope: {
	        events: '=',
	        viewDate: '=',
	        onEventClick: '=',
	        onEventTimesChanged: '=',
	        onDateRangeSelect: '=',
	        cellIsOpen: '=',
	        cellAutoOpenDisabled: '=',
	        onTimespanClick: '=',
	        cellModifier: '=',
	        slideBoxDisabled: '=',
	        customTemplateUrls: '=?',
	        templateScope: '=',
	      },
	      controller: 'MwlCalendarMonthCtrl as vm',
	      link: function(scope, element, attrs, calendarCtrl) {
	        scope.vm.calendarCtrl = calendarCtrl;
	      },
	      bindToController: true
	    };

	  });


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);

	angular
	  .module('mwl.calendar')
	  .controller('MwlCalendarSlideBoxCtrl', ["$scope", "$timeout", "calendarConfig", "calendarEventTitle", function($scope, $timeout, calendarConfig, calendarEventTitle) {

	    var vm = this;
	    vm.calendarConfig = calendarConfig;
	    vm.calendarEventTitle = calendarEventTitle;

	    vm.isCollapsed = true;
	    $scope.$watch('vm.isOpen', function(isOpen) {
	      //events must be populated first to set the element height before animation will work
	      $timeout(function() {
	        vm.isCollapsed = !isOpen;
	      });
	    });

	  }])
	  .directive('mwlCalendarSlideBox', function() {

	    return {
	      restrict: 'E',
	      template: '<div mwl-dynamic-directive-template name="calendarSlideBox" overrides="vm.customTemplateUrls"></div>',
	      replace: true,
	      controller: 'MwlCalendarSlideBoxCtrl as vm',
	      require: ['^?mwlCalendarMonth', '^?mwlCalendarYear'],
	      link: function(scope, elm, attrs, ctrls) {
	        scope.isMonthView = !!ctrls[0];
	        scope.isYearView = !!ctrls[1];
	      },
	      scope: {
	        isOpen: '=',
	        events: '=',
	        onEventClick: '=',
	        cell: '=',
	        customTemplateUrls: '=?',
	        templateScope: '='
	      },
	      bindToController: true
	    };

	  });


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);

	angular
	  .module('mwl.calendar')
	  .controller('MwlCalendarWeekCtrl', ["$scope", "moment", "calendarHelper", "calendarConfig", "calendarEventTitle", function($scope, moment, calendarHelper, calendarConfig, calendarEventTitle) {

	    var vm = this;

	    vm.showTimes = calendarConfig.showTimesOnWeekView;
	    vm.calendarEventTitle = calendarEventTitle;

	    $scope.$on('calendar.refreshView', function() {
	      vm.dayViewSplit = vm.dayViewSplit || 30;
	      vm.dayViewHeight = calendarHelper.getDayViewHeight(
	        vm.dayViewStart,
	        vm.dayViewEnd,
	        vm.dayViewSplit
	      );
	      if (vm.showTimes) {
	        vm.view = calendarHelper.getWeekViewWithTimes(
	          vm.events,
	          vm.viewDate,
	          vm.dayViewStart,
	          vm.dayViewEnd,
	          vm.dayViewSplit
	        );
	      } else {
	        vm.view = calendarHelper.getWeekView(vm.events, vm.viewDate);
	      }
	    });

	    vm.weekDragged = function(event, daysDiff, minuteChunksMoved) {

	      var newStart = moment(event.startsAt).add(daysDiff, 'days');
	      var newEnd = moment(event.endsAt).add(daysDiff, 'days');

	      if (minuteChunksMoved) {
	        var minutesDiff = minuteChunksMoved * vm.dayViewSplit;
	        newStart = newStart.add(minutesDiff, 'minutes');
	        newEnd = newEnd.add(minutesDiff, 'minutes');
	      }

	      delete event.tempStartsAt;

	      vm.onEventTimesChanged({
	        calendarEvent: event,
	        calendarNewEventStart: newStart.toDate(),
	        calendarNewEventEnd: event.endsAt ? newEnd.toDate() : null
	      });
	    };

	    vm.eventDropped = function(event, date) {
	      var daysDiff = moment(date).diff(moment(event.startsAt), 'days');
	      vm.weekDragged(event, daysDiff);
	    };

	    vm.weekResized = function(event, edge, daysDiff) {

	      var start = moment(event.startsAt);
	      var end = moment(event.endsAt);
	      if (edge === 'start') {
	        start.add(daysDiff, 'days');
	      } else {
	        end.add(daysDiff, 'days');
	      }

	      vm.onEventTimesChanged({
	        calendarEvent: event,
	        calendarNewEventStart: start.toDate(),
	        calendarNewEventEnd: end.toDate()
	      });

	    };

	    vm.tempTimeChanged = function(event, minuteChunksMoved) {
	      var minutesDiff = minuteChunksMoved * vm.dayViewSplit;
	      event.tempStartsAt = moment(event.startsAt).add(minutesDiff, 'minutes').toDate();
	    };

	  }])
	  .directive('mwlCalendarWeek', ["$timeout", function($timeout) {

	    return {
	      template: '<div mwl-dynamic-directive-template name="calendarWeekView" overrides="vm.customTemplateUrls"></div>',
	      restrict: 'E',
	      require: '^mwlCalendar',
	      scope: {
	        events: '=',
	        viewDate: '=',
	        onEventClick: '=',
	        onEventTimesChanged: '=',
	        dayViewStart: '=',
	        dayViewEnd: '=',
	        dayViewSplit: '=',
	        dayViewEventChunkSize: '=',
	        onTimespanClick: '=',
	        onDateRangeSelect: '=',
	        customTemplateUrls: '=?',
	        cellModifier: '=',
	        templateScope: '=',
	        scrollToId: '='
	      },
	      controller: 'MwlCalendarWeekCtrl as vm',
	      // link: function(scope, element, attrs, calendarCtrl) {
	      //   scope.vm.calendarCtrl = calendarCtrl;
	      //   $timeout(function() {
	      //     var container = document.getElementById('daypanel'),
	      //         hour = document.getElementById(scope.vm.scrollToId);
	      //     if (hour !== null) {
	      //       container.scrollTop = hour.offsetTop;
	      //     }
	      //   }, 1);
	      //
	      // },
	      bindToController: true
	    };

	  }]);


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);

	angular
	  .module('mwl.calendar')
	  .controller('MwlCalendarYearCtrl', ["$scope", "moment", "calendarHelper", function($scope, moment, calendarHelper) {

	    var vm = this;
	    vm.openMonthIndex = null;

	    function toggleCell() {
	      vm.openRowIndex = null;
	      vm.openMonthIndex = null;

	      if (vm.cellIsOpen && vm.view) {
	        vm.view.forEach(function(month, monthIndex) {
	          if (moment(vm.viewDate).startOf('month').isSame(month.date)) {
	            vm.openMonthIndex = monthIndex;
	            vm.openRowIndex = Math.floor(monthIndex / 4);
	          }
	        });
	      }
	    }

	    $scope.$on('calendar.refreshView', function() {
	      vm.view = calendarHelper.getYearView(vm.events, vm.viewDate, vm.cellModifier);

	      if (vm.cellAutoOpenDisabled) {
	        toggleCell();
	      } else if (!vm.cellAutoOpenDisabled && vm.cellIsOpen && vm.openMonthIndex === null) {
	        //Auto open the calendar to the current day if set
	        vm.openMonthIndex = null;
	        vm.view.forEach(function(month) {
	          if (moment(vm.viewDate).startOf('month').isSame(month.date)) {
	            vm.monthClicked(month, true);
	          }
	        });
	      }

	    });

	    if (vm.cellAutoOpenDisabled) {
	      $scope.$watchGroup([
	        'vm.cellIsOpen',
	        'vm.viewDate'
	      ], toggleCell);
	    }

	    vm.monthClicked = function(month, monthClickedFirstRun, $event) {

	      if (!monthClickedFirstRun) {
	        vm.onTimespanClick({
	          calendarDate: month.date.toDate(),
	          calendarCell: month,
	          $event: $event
	        });
	        if ($event && $event.defaultPrevented) {
	          return;
	        }
	      }

	      if (!vm.cellAutoOpenDisabled) {
	        vm.openRowIndex = null;
	        var monthIndex = vm.view.indexOf(month);
	        if (monthIndex === vm.openMonthIndex) { //the month has been clicked and is already open
	          vm.openMonthIndex = null; //close the open month
	          vm.cellIsOpen = false;
	        } else {
	          vm.openMonthIndex = monthIndex;
	          vm.openRowIndex = Math.floor(monthIndex / 4);
	          vm.cellIsOpen = true;
	        }
	      }

	    };

	    vm.handleEventDrop = function(event, newMonthDate) {
	      var newStart = moment(event.startsAt)
	        .month(moment(newMonthDate).month())
	        .year(moment(newMonthDate).year());
	      var newEnd = calendarHelper.adjustEndDateFromStartDiff(event.startsAt, newStart, event.endsAt);

	      vm.onEventTimesChanged({
	        calendarEvent: event,
	        calendarDate: newMonthDate,
	        calendarNewEventStart: newStart.toDate(),
	        calendarNewEventEnd: newEnd ? newEnd.toDate() : null
	      });
	    };

	  }])
	  .directive('mwlCalendarYear', function() {

	    return {
	      template: '<div mwl-dynamic-directive-template name="calendarYearView" overrides="vm.customTemplateUrls"></div>',
	      restrict: 'E',
	      require: '^mwlCalendar',
	      scope: {
	        events: '=',
	        viewDate: '=',
	        onEventClick: '=',
	        onEventTimesChanged: '=',
	        cellIsOpen: '=',
	        cellAutoOpenDisabled: '=',
	        onTimespanClick: '=',
	        cellModifier: '=',
	        slideBoxDisabled: '=',
	        customTemplateUrls: '=?',
	        templateScope: '='
	      },
	      controller: 'MwlCalendarYearCtrl as vm',
	      link: function(scope, element, attrs, calendarCtrl) {
	        scope.vm.calendarCtrl = calendarCtrl;
	      },
	      bindToController: true
	    };

	  });


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);

	angular
	  .module('mwl.calendar')
	  .controller('MwlCollapseFallbackCtrl', ["$scope", "$attrs", "$element", function($scope, $attrs, $element) {

	    $scope.$watch($attrs.mwlCollapseFallback, function(shouldCollapse) {
	      if (shouldCollapse) {
	        $element.addClass('ng-hide');
	      } else {
	        $element.removeClass('ng-hide');
	      }
	    });

	  }])
	  .directive('mwlCollapseFallback', ["$injector", function($injector) {

	    if ($injector.has('uibCollapseDirective')) {
	      return {};
	    }

	    return {
	      restrict: 'A',
	      controller: 'MwlCollapseFallbackCtrl'
	    };

	  }]);


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);

	angular
	  .module('mwl.calendar')
	  .controller('MwlDateModifierCtrl', ["$element", "$attrs", "$scope", "moment", function($element, $attrs, $scope, moment) {

	    var vm = this;

	    function onClick() {
	      if (angular.isDefined($attrs.setToToday)) {
	        vm.date = new Date();
	      } else if (angular.isDefined($attrs.increment)) {
	        vm.date = moment(vm.date).add(1, vm.increment).toDate();
	      } else if (angular.isDefined($attrs.decrement)) {
	        vm.date = moment(vm.date).subtract(1, vm.decrement).toDate();
	      }
	      $scope.$apply();
	    }

	    $element.bind('click', onClick);

	    $scope.$on('$destroy', function() {
	      $element.unbind('click', onClick);
	    });

	  }])
	  .directive('mwlDateModifier', function() {

	    return {
	      restrict: 'A',
	      controller: 'MwlDateModifierCtrl as vm',
	      scope: {
	        date: '=',
	        increment: '=',
	        decrement: '='
	      },
	      bindToController: true
	    };

	  });


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);

	angular
	  .module('mwl.calendar')
	  .controller('MwlDragSelectCtrl', ["$scope", "$element", "$parse", "$attrs", function($scope, $element, $parse, $attrs) {

	    function handleMouseEvent(callbackName) {
	      return function(event) {
	        if (callbackName) {
	          $parse(callbackName)($scope);
	          $scope.$apply();
	        }
	        event.preventDefault();
	      };
	    }

	    var onMouseDown = handleMouseEvent($attrs.onDragSelectStart);
	    var onMouseMove = handleMouseEvent($attrs.onDragSelectMove);
	    var onMouseUp = handleMouseEvent($attrs.onDragSelectEnd);

	    function enableMouseListeners() {
	      $element.on('mousedown', onMouseDown);
	      $element.on('mousemove', onMouseMove);
	      $element.on('mouseup', onMouseUp);
	    }

	    function disableMouseListeners() {
	      $element.off('mousedown', onMouseDown);
	      $element.off('mousemove', onMouseMove);
	      $element.off('mouseup', onMouseUp);
	    }

	    $scope.$watch($attrs.mwlDragSelect, function(isEnabled) {
	      if (isEnabled) {
	        enableMouseListeners();
	      } else {
	        disableMouseListeners();
	      }
	    });

	    $scope.$on('$destroy', function() {
	      disableMouseListeners();
	    });

	  }])
	  .directive('mwlDragSelect', function() {

	    return {
	      restrict: 'A',
	      controller: 'MwlDragSelectCtrl'
	    };

	  });


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);

	angular
	  .module('mwl.calendar')
	  .controller('MwlDraggableCtrl', ["$element", "$scope", "$window", "$parse", "$attrs", "$timeout", "interact", function($element, $scope, $window, $parse, $attrs, $timeout, interact) {

	    if (!interact) {
	      return;
	    }

	    var snap, snapGridDimensions;
	    if ($attrs.snapGrid) {
	      snapGridDimensions = $parse($attrs.snapGrid)($scope);
	      snap = {
	        targets: [
	          interact.createSnapGrid(snapGridDimensions)
	        ]
	      };
	    }

	    function translateElement(elm, transformValue) {
	      return elm
	        .css('-ms-transform', transformValue)
	        .css('-webkit-transform', transformValue)
	        .css('transform', transformValue);
	    }

	    interact($element[0]).draggable({
	      snap: snap,
	      onstart: function(event) {
	        angular.element(event.target).addClass('dragging-active');
	        event.target.dropData = $parse($attrs.dropData)($scope);
	        event.target.style.pointerEvents = 'none';
	        if ($attrs.onDragStart) {
	          $parse($attrs.onDragStart)($scope);
	          $scope.$apply();
	        }
	      },
	      onmove: function(event) {

	        var elm = angular.element(event.target);
	        var x = (parseFloat(elm.attr('data-x')) || 0) + (event.dx || 0);
	        var y = (parseFloat(elm.attr('data-y')) || 0) + (event.dy || 0);

	        switch ($parse($attrs.axis)($scope)) {
	          case 'x':
	            y = 0;
	            break;

	          case 'y':
	            x = 0;
	            break;

	          default:
	        }

	        if ($window.getComputedStyle(elm[0]).position === 'static') {
	          elm.css('position', 'relative');
	        }

	        translateElement(elm, 'translate(' + x + 'px, ' + y + 'px)')
	          .css('z-index', 50)
	          .attr('data-x', x)
	          .attr('data-y', y);

	        if ($attrs.onDrag) {
	          $parse($attrs.onDrag)($scope, {x: x, y: y});
	          $scope.$apply();
	        }

	      },
	      onend: function(event) {

	        var elm = angular.element(event.target);
	        var x = elm.attr('data-x');
	        var y = elm.attr('data-y');

	        event.target.style.pointerEvents = 'auto';
	        if ($attrs.onDragEnd) {
	          $parse($attrs.onDragEnd)($scope, {x: x, y: y});
	          $scope.$apply();
	        }

	        $timeout(function() {
	          translateElement(elm, '')
	            .css('z-index', 'auto')
	            .removeAttr('data-x')
	            .removeAttr('data-y')
	            .removeClass('dragging-active');
	        });

	      }
	    });

	    $scope.$watch($attrs.mwlDraggable, function(enabled) {
	      interact($element[0]).draggable({
	        enabled: enabled
	      });
	    });

	    $scope.$on('$destroy', function() {
	      interact($element[0]).unset();
	    });

	  }])
	  .directive('mwlDraggable', function() {

	    return {
	      restrict: 'A',
	      controller: 'MwlDraggableCtrl'
	    };

	  });


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);

	angular
	  .module('mwl.calendar')
	  .controller('MwlDroppableCtrl', ["$element", "$scope", "$parse", "$attrs", "interact", function($element, $scope, $parse, $attrs, interact) {

	    if (!interact) {
	      return;
	    }

	    var DROP_ACTIVE_CLASS = $attrs.dropActiveClass || 'drop-active';

	    interact($element[0]).dropzone({
	      ondragenter: function(event) {
	        angular.element(event.target).addClass(DROP_ACTIVE_CLASS);
	      },
	      ondragleave: function(event) {
	        angular.element(event.target).removeClass(DROP_ACTIVE_CLASS);
	      },
	      ondropdeactivate: function(event) {
	        angular.element(event.target).removeClass(DROP_ACTIVE_CLASS);
	      },
	      ondrop: function(event) {
	        if (event.relatedTarget.dropData) {
	          $parse($attrs.onDrop)($scope, {dropData: event.relatedTarget.dropData});
	          $scope.$apply();
	        }
	      }
	    });

	    $scope.$on('$destroy', function() {
	      interact($element[0]).unset();
	    });

	  }])
	  .directive('mwlDroppable', function() {

	    return {
	      restrict: 'A',
	      controller: 'MwlDroppableCtrl'
	    };

	  });


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);

	angular
	  .module('mwl.calendar')
	  .controller('MwlDynamicDirectiveTemplateCtrl', ["$compile", "$scope", "$attrs", "$element", "$templateCache", "$log", "calendarConfig", function($compile, $scope, $attrs, $element, $templateCache, $log, calendarConfig) {

	    $scope.$watch($attrs.overrides, function(overrides) {

	      var templateName = calendarConfig.templates[$attrs.name];
	      if (
	        overrides &&
	        angular.isObject(overrides) &&
	        overrides[$attrs.name]
	      ) {
	        if ($templateCache.get(overrides[$attrs.name])) {
	          templateName = overrides[$attrs.name];
	        } else {
	          $log.warn('Bootstrap Calendar', 'The custom template for ' + overrides[$attrs.name] +
	            ' was not found in the template cache. Please ensure it is pre-loaded via a script tag ' +
	            '<script type="text/ng-template" id="' + overrides[$attrs.name] + '">Custom template content</script> or ' +
	            'via a tool such as https://www.npmjs.com/package/gulp-angular-templatecache');
	        }
	      }
	      var template = $templateCache.get(templateName);
	      $element.html(template);
	      $compile($element.contents())($scope);

	    });

	  }])
	  .directive('mwlDynamicDirectiveTemplate', function() {

	    return {
	      restrict: 'A',
	      controller: 'MwlDynamicDirectiveTemplateCtrl'
	    };

	  });


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);

	angular
	  .module('mwl.calendar')
	  .controller('MwlElementDimensionsCtrl', ["$element", "$scope", "$parse", "$attrs", "$window", function($element, $scope, $parse, $attrs, $window) {

	    function setDimensions() {
	      $parse($attrs.mwlElementDimensions).assign($scope, {
	        width: $element[0].offsetWidth,
	        height: $element[0].offsetHeight
	      });
	      $scope.$applyAsync();
	    }

	    var win = angular.element($window);

	    win.bind('resize', setDimensions);

	    setDimensions();

	    $scope.$on('$destroy', function() {
	      win.unbind('resize', setDimensions);
	    });

	  }])
	  .directive('mwlElementDimensions', function() {

	    return {
	      restrict: 'A',
	      controller: 'MwlElementDimensionsCtrl'
	    };

	  });


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);

	angular
	  .module('mwl.calendar')
	  .controller('MwlResizableCtrl', ["$element", "$scope", "$parse", "$attrs", "$timeout", "interact", function($element, $scope, $parse, $attrs, $timeout, interact) {

	    if (!interact) {
	      return;
	    }

	    var snap, snapGridDimensions;
	    if ($attrs.snapGrid) {
	      snapGridDimensions = $parse($attrs.snapGrid)($scope);
	      snap = {
	        targets: [
	          interact.createSnapGrid(snapGridDimensions)
	        ]
	      };
	    }

	    var originalDimensions = {};
	    var originalDimensionsStyle = {};
	    var resizeEdge;

	    function getUnitsResized(edge, elm) {
	      var unitsResized = {};
	      unitsResized.edge = edge;
	      if (edge === 'start') {
	        unitsResized.x = elm.data('x');
	        unitsResized.y = elm.data('y');
	      } else if (edge === 'end') {
	        unitsResized.x = parseFloat(elm.css('width').replace('px', '')) - originalDimensions.width;
	        unitsResized.y = parseFloat(elm.css('height').replace('px', '')) - originalDimensions.height;
	      }
	      return unitsResized;
	    }

	    interact($element[0]).resizable({
	      edges: $parse($attrs.resizeEdges)($scope),
	      snap: snap,
	      onstart: function(event) {

	        resizeEdge = 'end';
	        var elm = angular.element(event.target);
	        originalDimensions.height = elm[0].offsetHeight;
	        originalDimensions.width = elm[0].offsetWidth;
	        originalDimensionsStyle.height = elm.css('height');
	        originalDimensionsStyle.width = elm.css('width');

	      },
	      onmove: function(event) {

	        if (event.rect.width > 0 && event.rect.height > 0) {
	          var elm = angular.element(event.target);
	          var x = parseFloat(elm.data('x') || 0);
	          var y = parseFloat(elm.data('y') || 0);

	          elm.css({
	            width: event.rect.width + 'px',
	            height: event.rect.height + 'px'
	          });

	          // translate when resizing from top or left edges
	          x += event.deltaRect.left;
	          y += event.deltaRect.top;

	          elm.css('transform', 'translate(' + x + 'px,' + y + 'px)');

	          elm.data('x', x);
	          elm.data('y', y);

	          if (event.deltaRect.left !== 0 || event.deltaRect.top !== 0) {
	            resizeEdge = 'start';
	          }

	          if ($attrs.onResize) {
	            $parse($attrs.onResize)($scope, getUnitsResized(resizeEdge, elm));
	            $scope.$apply();
	          }

	        }

	      },
	      onend: function(event) {

	        var elm = angular.element(event.target);
	        var unitsResized = getUnitsResized(resizeEdge, elm);

	        $timeout(function() {
	          elm
	            .data('x', null)
	            .data('y', null)
	            .css({
	              transform: '',
	              width: originalDimensionsStyle.width,
	              height: originalDimensionsStyle.height
	            });
	        });

	        if ($attrs.onResizeEnd) {
	          $parse($attrs.onResizeEnd)($scope, unitsResized);
	          $scope.$apply();
	        }

	      }
	    });

	    $scope.$watch($attrs.mwlResizable, function(enabled) {
	      interact($element[0]).resizable({
	        enabled: enabled
	      });
	    });

	    $scope.$on('$destroy', function() {
	      interact($element[0]).unset();
	    });

	  }])
	  .directive('mwlResizable', function() {

	    return {
	      restrict: 'A',
	      controller: 'MwlResizableCtrl'
	    };

	  });


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./calendarDate.js": 34,
		"./calendarLimitTo.js": 35,
		"./calendarTruncateEventTitle.js": 36,
		"./calendarTrustAsHtml.js": 37
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 33;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);

	angular
	  .module('mwl.calendar')
	  .filter('calendarDate', ["calendarHelper", "calendarConfig", function(calendarHelper, calendarConfig) {

	    function calendarDate(date, format, getFromConfig) {

	      if (getFromConfig === true) {
	        format = calendarConfig.dateFormats[format];
	      }

	      return calendarHelper.formatDate(date, format);

	    }

	    // This is stateful because the locale can change as well
	    // as calendarConfig.dateFormats which would change the value outside of this filter
	    calendarDate.$stateful = true;

	    return calendarDate;

	  }]);


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);

	angular
	  .module('mwl.calendar')
	  .filter('calendarLimitTo', ["limitToFilter", function(limitToFilter) {

	    if (angular.version.minor >= 4) { //1.4+ supports the begin attribute
	      return limitToFilter;
	    }

	    //Copied from the angular source. Only 1.4 has the begin functionality.
	    return function(input, limit, begin) {
	      if (Math.abs(Number(limit)) === Infinity) {
	        limit = Number(limit);
	      } else {
	        limit = parseInt(limit);
	      }
	      if (isNaN(limit)) {
	        return input;
	      }

	      if (angular.isNumber(input)) {
	        input = input.toString();
	      }
	      if (!angular.isArray(input) && !angular.isString(input)) {
	        return input;
	      }

	      begin = (!begin || isNaN(begin)) ? 0 : parseInt(begin);
	      begin = (begin < 0 && begin >= -input.length) ? input.length + begin : begin;

	      if (limit >= 0) {
	        return input.slice(begin, begin + limit);
	      } else if (begin === 0) {
	        return input.slice(limit, input.length);
	      } else {
	        return input.slice(Math.max(0, begin + limit), begin);
	      }
	    };

	  }]);


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);

	angular
	  .module('mwl.calendar')
	  .filter('calendarTruncateEventTitle', function() {

	    return function(string, length, boxHeight) {
	      if (!string) {
	        return '';
	      }

	      //Only truncate if if actually needs truncating
	      if (string.length >= length && string.length / 20 > boxHeight / 30) {
	        return string.substr(0, length) + '...';
	      } else {
	        return string;
	      }
	    };

	  });


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);

	angular
	  .module('mwl.calendar')
	  .filter('calendarTrustAsHtml', ["$sce", function($sce) {

	    return function(text) {
	      return $sce.trustAsHtml(text);
	    };

	  }]);


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./calendarConfig.js": 39,
		"./calendarEventTitle.js": 40,
		"./calendarHelper.js": 41,
		"./calendarTitle.js": 42,
		"./interact.js": 43,
		"./moment.js": 45
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 38;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);

	angular
	  .module('mwl.calendar')
	  .constant('calendarConfig', {
	    allDateFormats: {
	      angular: {
	        date: {
	          hour: 'ha',
	          day: 'd MMM',
	          month: 'MMMM',
	          weekDay: 'EEEE',
	          time: 'HH:mm',
	          datetime: 'MMM d, h:mm a'
	        },
	        title: {
	          day: 'EEEE d MMMM, yyyy',
	          week: 'Week {week} of {year}',
	          month: 'MMMM yyyy',
	          year: 'yyyy'
	        }
	      },
	      moment: {
	        date: {
	          hour: 'ha',
	          day: 'D MMM',
	          month: 'MMMM',
	          weekDay: 'dddd',
	          time: 'HH:mm',
	          datetime: 'MMM D, h:mm a'
	        },
	        title: {
	          day: 'dddd D MMMM, YYYY',
	          week: 'Week {week} of {year}',
	          month: 'MMMM YYYY',
	          year: 'YYYY'
	        }
	      }
	    },
	    get dateFormats() {
	      return this.allDateFormats[this.dateFormatter].date;
	    },
	    get titleFormats() {
	      return this.allDateFormats[this.dateFormatter].title;
	    },
	    dateFormatter: 'angular',
	    showTimesOnWeekView: false,
	    displayAllMonthEvents: false,
	    i18nStrings: {
	      weekNumber: 'Week {week}'
	    },
	    templates: {},
	    colorTypes: {
	      info: {
	        primary: '#1e90ff',
	        secondary: '#d1e8ff'
	      },
	      important: {
	        primary: '#ad2121',
	        secondary: '#fae3e3'
	      },
	      warning: {
	        primary: '#e3bc08',
	        secondary: '#fdf1ba'
	      },
	      inverse: {
	        primary: '#1b1b1b',
	        secondary: '#c1c1c1'
	      },
	      special: {
	        primary: '#800080',
	        secondary: '#ffe6ff'
	      },
	      success: {
	        primary: '#006400',
	        secondary: '#caffca'
	      }
	    }
	  });


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);

	angular
	  .module('mwl.calendar')
	  .factory('calendarEventTitle', ["calendarDateFilter", "calendarTruncateEventTitleFilter", function(calendarDateFilter, calendarTruncateEventTitleFilter) {

	    function yearView(event) {
	      return event.title + ' (' + calendarDateFilter(event.startsAt, 'datetime', true) + ')';
	    }

	    function monthView(event) {
	      return event.title + ' (' + calendarDateFilter(event.startsAt, 'time', true) + ')';
	    }

	    function monthViewTooltip(event) {
	      return calendarDateFilter(event.startsAt, 'time', true) + ' - ' + event.title;
	    }

	    function weekView(event) {
	      return event.title;
	    }

	    function weekViewTooltip(event) {
	      return event.title;
	    }

	    function dayView(event) {
	      return event.allDay ? event.title : calendarTruncateEventTitleFilter(event.title, 20, event.height);
	    }

	    return {
	      yearView: yearView,
	      monthView: monthView,
	      monthViewTooltip: monthViewTooltip,
	      weekView: weekView,
	      weekViewTooltip: weekViewTooltip,
	      dayView: dayView
	    };

	  }]);


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);
	var calendarUtils = __webpack_require__(19);

	angular
	  .module('mwl.calendar')
	  .factory('calendarHelper', ["$q", "$templateRequest", "dateFilter", "moment", "calendarConfig", function($q, $templateRequest, dateFilter, moment, calendarConfig) {

	    function formatDate(date, format) {
	      if (calendarConfig.dateFormatter === 'angular') {
	        return dateFilter(moment(date).toDate(), format);
	      } else if (calendarConfig.dateFormatter === 'moment') {
	        return moment(date).format(format);
	      } else {
	        throw new Error('Unknown date formatter: ' + calendarConfig.dateFormatter);
	      }
	    }

	    function adjustEndDateFromStartDiff(oldStart, newStart, oldEnd) {
	      if (!oldEnd) {
	        return oldEnd;
	      }
	      var diffInSeconds = moment(newStart).diff(moment(oldStart));
	      return moment(oldEnd).add(diffInSeconds);
	    }

	    function getRecurringEventPeriod(eventPeriod, recursOn, containerPeriodStart) {

	      var eventStart = moment(eventPeriod.start);
	      var eventEnd = moment(eventPeriod.end);
	      var periodStart = moment(containerPeriodStart);

	      if (recursOn) {

	        switch (recursOn) {
	          case 'year':
	            eventStart.set({
	              year: periodStart.year()
	            });
	            break;

	          case 'month':
	            eventStart.set({
	              year: periodStart.year(),
	              month: periodStart.month()
	            });
	            break;

	          default:
	            throw new Error('Invalid value (' + recursOn + ') given for recurs on. Can only be year or month.');
	        }

	        eventEnd = adjustEndDateFromStartDiff(eventPeriod.start, eventStart, eventEnd);

	      }

	      return {start: eventStart, end: eventEnd};

	    }

	    function eventIsInPeriod(event, periodStart, periodEnd) {

	      periodStart = moment(periodStart);
	      periodEnd = moment(periodEnd);

	      var eventPeriod = getRecurringEventPeriod({start: event.startsAt, end: event.endsAt || event.startsAt}, event.recursOn, periodStart);
	      var eventStart = eventPeriod.start;
	      var eventEnd = eventPeriod.end;

	      return (eventStart.isAfter(periodStart) && eventStart.isBefore(periodEnd)) ||
	        (eventEnd.isAfter(periodStart) && eventEnd.isBefore(periodEnd)) ||
	        (eventStart.isBefore(periodStart) && eventEnd.isAfter(periodEnd)) ||
	        eventStart.isSame(periodStart) ||
	        eventEnd.isSame(periodEnd);

	    }

	    function filterEventsInPeriod(events, startPeriod, endPeriod) {
	      return events.filter(function(event) {
	        return eventIsInPeriod(event, startPeriod, endPeriod);
	      });
	    }

	    function getEventsInPeriod(calendarDate, period, allEvents) {
	      var startPeriod = moment(calendarDate).startOf(period);
	      var endPeriod = moment(calendarDate).endOf(period);
	      return filterEventsInPeriod(allEvents, startPeriod, endPeriod);
	    }

	    function getBadgeTotal(events) {
	      return events.filter(function(event) {
	        return event.incrementsBadgeTotal !== false;
	      }).length;
	    }

	    function getWeekDayNames() {
	      var weekdays = [];
	      var count = 0;
	      while (count < 7) {
	        weekdays.push(formatDate(moment().weekday(count++), calendarConfig.dateFormats.weekDay));
	      }
	      return weekdays;
	    }

	    function getYearView(events, viewDate, cellModifier) {

	      var view = [];
	      var eventsInPeriod = getEventsInPeriod(viewDate, 'year', events);
	      var month = moment(viewDate).startOf('year');
	      var count = 0;
	      while (count < 12) {
	        var startPeriod = month.clone();
	        var endPeriod = startPeriod.clone().endOf('month');
	        var periodEvents = filterEventsInPeriod(eventsInPeriod, startPeriod, endPeriod);
	        var cell = {
	          label: formatDate(startPeriod, calendarConfig.dateFormats.month),
	          isToday: startPeriod.isSame(moment().startOf('month')),
	          events: periodEvents,
	          date: startPeriod,
	          badgeTotal: getBadgeTotal(periodEvents)
	        };

	        cellModifier({calendarCell: cell});
	        view.push(cell);
	        month.add(1, 'month');
	        count++;
	      }

	      return view;

	    }

	    function getMonthView(events, viewDate, cellModifier) {

	      // hack required to work with the calendar-utils api
	      events.forEach(function(event) {
	        event.start = event.startsAt;
	        event.end = event.endsAt;
	      });

	      var view = calendarUtils.getMonthView({
	        events: events,
	        viewDate: viewDate
	      });

	      view.days = view.days.map(function(day) {
	        day.label = day.date.date();
	        day.badgeTotal = getBadgeTotal(day.events);
	        if (!calendarConfig.displayAllMonthEvents && !day.inMonth) {
	          day.events = [];
	        }
	        cellModifier({calendarCell: day});
	        return day;
	      });

	      // remove hack
	      events.forEach(function(event) {
	        delete event.start;
	        delete event.end;
	      });

	      return view;

	    }

	    function getWeekView(events, viewDate) {

	      var days = calendarUtils.getWeekViewHeader({
	        viewDate: viewDate
	      }).map(function(day) {
	        day.weekDayLabel = formatDate(day.date, calendarConfig.dateFormats.weekDay);
	        day.dayLabel = formatDate(day.date, calendarConfig.dateFormats.day);
	        return day;
	      });

	      var startOfWeek = moment(viewDate).startOf('week');
	      var endOfWeek = moment(viewDate).endOf('week');

	      var eventRows = calendarUtils.getWeekView({
	        viewDate: viewDate,
	        events: filterEventsInPeriod(events, startOfWeek, endOfWeek).map(function(event) {

	          var weekViewStart = moment(startOfWeek).startOf('day');

	          var eventPeriod = getRecurringEventPeriod({
	            start: moment(event.startsAt).startOf('day'),
	            end: moment(event.endsAt || event.startsAt).startOf('day').add(1, 'second')
	          }, event.recursOn, weekViewStart);

	          eventPeriod.originalEvent = event;

	          return eventPeriod;

	        })
	      }).map(function(eventRow) {

	        eventRow.row = eventRow.row.map(function(rowEvent) {
	          rowEvent.event = rowEvent.event.originalEvent;
	          return rowEvent;
	        });

	        return eventRow;

	      });

	      return {days: days, eventRows: eventRows};

	    }

	    function getDayView(events, viewDate, dayViewStart, dayViewEnd, dayViewSplit) {

	      var dayStart = (dayViewStart || '00:00').split(':');
	      var dayEnd = (dayViewEnd || '23:59').split(':');

	      var view = calendarUtils.getDayView({
	        events: events.map(function(event) { // hack required to work with event API
	          event.start = event.startsAt;
	          event.end = event.endsAt;
	          return event;
	        }),
	        viewDate: viewDate,
	        hourSegments: 60 / dayViewSplit,
	        dayStart: {
	          hour: dayStart[0],
	          minute: dayStart[1]
	        },
	        dayEnd: {
	          hour: dayEnd[0],
	          minute: dayEnd[1]
	        },
	        eventWidth: 150,
	        segmentHeight: 30
	      });

	      // remove hack to work with new event API
	      events.forEach(function(event) {
	        delete event.start;
	        delete event.end;
	      });

	      return view;

	    }

	    function getWeekViewWithTimes(events, viewDate, dayViewStart, dayViewEnd, dayViewSplit) {
	      var weekView = getWeekView(events, viewDate);
	      var newEvents = [];
	      var flattenedEvents = [];
	      weekView.eventRows.forEach(function(row) {
	        row.row.forEach(function(eventRow) {
	          flattenedEvents.push(eventRow.event);
	        });
	      });
	      weekView.days.forEach(function(day) {
	        var dayEvents = flattenedEvents.filter(function(event) {
	          return moment(event.startsAt).startOf('day').isSame(moment(day.date).startOf('day'));
	        });
	        var newDayEvents = getDayView(
	          dayEvents,
	          day.date,
	          dayViewStart,
	          dayViewEnd,
	          dayViewSplit
	        ).events;
	        newEvents = newEvents.concat(newDayEvents);
	      });
	      weekView.eventRows = [{
	        row: newEvents.map(function(dayEvent) {
	          var event = dayEvent.event;
	          return {
	            event: event,
	            top: dayEvent.top,
	            offset: calendarUtils.getDayOffset(
	              {start: event.startsAt, end: event.endsAt},
	              moment(viewDate).startOf('week')
	            )
	          };
	        })
	      }];
	      return weekView;
	    }

	    function getDayViewHeight(dayViewStart, dayViewEnd, dayViewSplit) {
	      var dayViewStartM = moment(dayViewStart || '00:00', 'HH:mm');
	      var dayViewEndM = moment(dayViewEnd || '23:59', 'HH:mm');
	      var hourHeight = (60 / dayViewSplit) * 30;
	      return ((dayViewEndM.diff(dayViewStartM, 'minutes') / 60) * hourHeight) + 3;
	    }

	    function loadTemplates() {

	      var templatePromises = Object.keys(calendarConfig.templates).map(function(key) {
	        var templateUrl = calendarConfig.templates[key];
	        return $templateRequest(templateUrl);
	      });

	      return $q.all(templatePromises);

	    }

	    return {
	      getWeekDayNames: getWeekDayNames,
	      getYearView: getYearView,
	      getMonthView: getMonthView,
	      getWeekView: getWeekView,
	      getDayView: getDayView,
	      getWeekViewWithTimes: getWeekViewWithTimes,
	      getDayViewHeight: getDayViewHeight,
	      adjustEndDateFromStartDiff: adjustEndDateFromStartDiff,
	      formatDate: formatDate,
	      loadTemplates: loadTemplates,
	      eventIsInPeriod: eventIsInPeriod //expose for testing only
	    };

	  }]);


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);

	angular
	  .module('mwl.calendar')
	  .factory('calendarTitle', ["moment", "calendarConfig", "calendarHelper", function(moment, calendarConfig, calendarHelper) {

	    function day(viewDate) {
	      return calendarHelper.formatDate(viewDate, calendarConfig.titleFormats.day);
	    }

	    function week(viewDate) {
	      return calendarConfig.titleFormats.week
	        .replace('{week}', moment(viewDate).isoWeek())
	        .replace('{year}', moment(viewDate).startOf('week').format('YYYY'));
	    }

	    function month(viewDate) {
	      return calendarHelper.formatDate(viewDate, calendarConfig.titleFormats.month);
	    }

	    function year(viewDate) {
	      return calendarHelper.formatDate(viewDate, calendarConfig.titleFormats.year);
	    }

	    return {
	      day: day,
	      week: week,
	      month: month,
	      year: year
	    };

	  }]);


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);
	var interact;
	try {
	  interact = __webpack_require__(44);
	} catch (e) {
	  /* istanbul ignore next */
	  interact = null;
	}

	angular
	  .module('mwl.calendar')
	  .constant('interact', interact);


/***/ },
/* 44 */
/***/ function(module, exports) {

	if(typeof __WEBPACK_EXTERNAL_MODULE_44__ === 'undefined') {var e = new Error("Cannot find module \"undefined\""); e.code = 'MODULE_NOT_FOUND'; throw e;}
	module.exports = __WEBPACK_EXTERNAL_MODULE_44__;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);
	var moment = __webpack_require__(20);

	angular
	  .module('mwl.calendar')
	  .constant('moment', moment);


/***/ }
/******/ ])
});
;