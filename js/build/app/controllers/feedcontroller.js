// Generated by CoffeeScript 1.6.3
/*

ownCloud - News

@author Bernhard Posselt
@copyright 2012 Bernhard Posselt dev@bernhard-posselt.com

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU AFFERO GENERAL PUBLIC LICENSE
License as published by the Free Software Foundation; either
version 3 of the License, or any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU AFFERO GENERAL PUBLIC LICENSE for more details.

You should have received a copy of the GNU Affero General Public
License along with this library.  If not, see <http://www.gnu.org/licenses/>.
*/


(function() {
  angular.module('News').controller('FeedController', [
    '$scope', '_ExistsError', 'Persistence', 'FolderBusinessLayer', 'FeedBusinessLayer', 'SubscriptionsBusinessLayer', 'StarredBusinessLayer', 'unreadCountFormatter', 'ActiveFeed', 'FeedType', '$window', function($scope, _ExistsError, Persistence, FolderBusinessLayer, FeedBusinessLayer, SubscriptionsBusinessLayer, StarredBusinessLayer, unreadCountFormatter, ActiveFeed, FeedType, $window) {
      var FeedController;
      FeedController = (function() {
        function FeedController(_$scope, _persistence, _folderBusinessLayer, _feedBusinessLayer, _subscriptionsBusinessLayer, _starredBusinessLayer, _unreadCountFormatter, _activeFeed, _feedType, _$window) {
          var _this = this;
          this._$scope = _$scope;
          this._persistence = _persistence;
          this._folderBusinessLayer = _folderBusinessLayer;
          this._feedBusinessLayer = _feedBusinessLayer;
          this._subscriptionsBusinessLayer = _subscriptionsBusinessLayer;
          this._starredBusinessLayer = _starredBusinessLayer;
          this._unreadCountFormatter = _unreadCountFormatter;
          this._activeFeed = _activeFeed;
          this._feedType = _feedType;
          this._$window = _$window;
          this._isAddingFolder = false;
          this._isAddingFeed = false;
          this._$scope.folderBusinessLayer = this._folderBusinessLayer;
          this._$scope.feedBusinessLayer = this._feedBusinessLayer;
          this._$scope.subscriptionsBusinessLayer = this._subscriptionsBusinessLayer;
          this._$scope.starredBusinessLayer = this._starredBusinessLayer;
          this._$scope.unreadCountFormatter = this._unreadCountFormatter;
          this._$scope.getTotalUnreadCount = function() {
            var count, title, titleCount;
            count = _this._subscriptionsBusinessLayer.getUnreadCount(0);
            if (count > 0) {
              titleCount = _this._unreadCountFormatter(count);
              title = 'News (' + titleCount + ') | ownCloud';
            } else {
              title = 'News | ownCloud';
            }
            if (_this._$window.document.title !== title) {
              _this._$window.document.title = title;
            }
            return count;
          };
          this._$scope.isAddingFolder = function() {
            return _this._isAddingFolder;
          };
          this._$scope.isAddingFeed = function() {
            return _this._isAddingFeed;
          };
          this._$scope.addFeed = function(feedUrl, parentFolderId) {
            var error;
            if (parentFolderId == null) {
              parentFolderId = 0;
            }
            _this._$scope.feedExistsError = false;
            try {
              _this._isAddingFeed = true;
              if (parentFolderId !== 0) {
                _this._folderBusinessLayer.open(parentFolderId);
              }
              return _this._feedBusinessLayer.create(feedUrl, parentFolderId, function(data) {
                _this._$scope.feedUrl = '';
                _this._isAddingFeed = false;
                return _this._feedBusinessLayer.load(data['feeds'][0].id);
              }, function() {
                return _this._isAddingFeed = false;
              });
            } catch (_error) {
              error = _error;
              if (error instanceof _ExistsError) {
                _this._$scope.feedExistsError = true;
              }
              return _this._isAddingFeed = false;
            }
          };
          this._$scope.addFolder = function(folderName) {
            var error;
            _this._$scope.folderExistsError = false;
            try {
              _this._isAddingFolder = true;
              return _this._folderBusinessLayer.create(folderName, function(data) {
                var activeId;
                _this._$scope.folderName = '';
                _this._$scope.addNewFolder = false;
                _this._isAddingFolder = false;
                activeId = data['folders'][0].id;
                return _this._$scope.folderId = _this._folderBusinessLayer.getById(activeId);
              }, function() {
                return _this._isAddingFolder = false;
              });
            } catch (_error) {
              error = _error;
              if (error instanceof _ExistsError) {
                _this._$scope.folderExistsError = true;
              }
              return _this._isAddingFolder = false;
            }
          };
          this._$scope.$on('moveFeedToFolder', function(scope, data) {
            return _this._feedBusinessLayer.move(data.feedId, data.folderId);
          });
        }

        return FeedController;

      })();
      return new FeedController($scope, Persistence, FolderBusinessLayer, FeedBusinessLayer, SubscriptionsBusinessLayer, StarredBusinessLayer, unreadCountFormatter, ActiveFeed, FeedType, $window);
    }
  ]);

}).call(this);
