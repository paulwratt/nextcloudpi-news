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
  describe('FolderBusinessLayer', function() {
    var _this = this;
    beforeEach(module('News'));
    beforeEach(module(function($provide) {
      _this.persistence = {
        test: 'folderbusinesslayer'
      };
      _this.imagePath = jasmine.createSpy('imagePath');
      _this.utils = {
        imagePath: _this.imagePath
      };
      $provide.value('Persistence', _this.persistence);
      $provide.value('Utils', _this.utils);
    }));
    beforeEach(inject(function(FolderBusinessLayer, FolderModel, FeedModel, ShowAll, ActiveFeed, FeedType, _ExistsError, $timeout, NewestItem, ItemModel, $rootScope) {
      _this.FolderBusinessLayer = FolderBusinessLayer;
      _this.FolderModel = FolderModel;
      _this.FeedModel = FeedModel;
      _this.ShowAll = ShowAll;
      _this.ActiveFeed = ActiveFeed;
      _this.FeedType = FeedType;
      _this._ExistsError = _ExistsError;
      _this.$timeout = $timeout;
      _this.NewestItem = NewestItem;
      _this.ItemModel = ItemModel;
      _this.$rootScope = $rootScope;
      _this.ShowAll.setShowAll(false);
      return _this.ActiveFeed.handle({
        type: _this.FeedType.Feed,
        id: 0
      });
    }));
    it('should delete folders', function() {
      var data;
      data = null;
      _this.$rootScope.$on('undoMessage', function(scope, data) {
        return data = data;
      });
      _this.FeedModel.add({
        id: 5,
        unreadCount: 2,
        folderId: 3,
        url: 'a1'
      });
      _this.FolderModel.removeById = jasmine.createSpy('remove').andCallFake(function() {
        return {
          id: 3,
          name: 'test'
        };
      });
      _this.FeedModel.removeById = jasmine.createSpy('remove').andCallFake(function() {
        return {
          id: 5,
          name: 'test',
          folderId: 3
        };
      });
      _this.persistence.deleteFolder = jasmine.createSpy('deletequery');
      _this.FolderBusinessLayer["delete"](3);
      expect(_this.FolderModel.removeById).toHaveBeenCalledWith(3);
      expect(_this.FeedModel.removeById).toHaveBeenCalledWith(5);
      return expect(_this.persistence.deleteFolder).toHaveBeenCalledWith(3);
    });
    it('should return true when folder has feeds', function() {
      _this.FeedModel.add({
        id: 5,
        unreadCount: 2,
        folderId: 2,
        url: 'a1'
      });
      expect(_this.FolderBusinessLayer.hasFeeds(3)).toBeFalsy();
      _this.FeedModel.add({
        id: 2,
        unreadCount: 35,
        folderId: 3,
        url: 'a2'
      });
      return expect(_this.FolderBusinessLayer.hasFeeds(3)).toBeTruthy();
    });
    it('should toggle folder', function() {
      _this.persistence.openFolder = jasmine.createSpy('open');
      _this.persistence.collapseFolder = jasmine.createSpy('collapse');
      _this.FolderModel.add({
        id: 3,
        opened: false,
        name: 'ho'
      });
      _this.FolderBusinessLayer.toggleFolder(4);
      expect(_this.FolderModel.getById(3).opened).toBeFalsy();
      _this.FolderBusinessLayer.toggleFolder(3);
      expect(_this.FolderModel.getById(3).opened).toBeTruthy();
      expect(_this.persistence.openFolder).toHaveBeenCalledWith(3);
      _this.FolderBusinessLayer.toggleFolder(3);
      expect(_this.FolderModel.getById(3).opened).toBeFalsy();
      return expect(_this.persistence.collapseFolder).toHaveBeenCalledWith(3);
    });
    it('should mark folder as read', function() {
      var item1, item2;
      _this.NewestItem.handle(25);
      _this.persistence.setFolderRead = jasmine.createSpy('setFeedRead');
      item1 = {
        id: 3,
        feedId: 5,
        guidHash: 'a3',
        status: 0
      };
      _this.ItemModel.add(item1);
      item1.setUnread();
      item2 = {
        id: 2,
        feedId: 3,
        guidHash: 'a3',
        status: 0
      };
      _this.ItemModel.add(item2);
      item2.setUnread();
      _this.FolderModel.add({
        id: 3,
        opened: false,
        name: 'ho'
      });
      _this.FeedModel.add({
        id: 3,
        unreadCount: 134,
        folderId: 3,
        url: 'a1'
      });
      _this.FeedModel.add({
        id: 5,
        unreadCount: 2,
        folderId: 2,
        url: 'a2'
      });
      _this.FeedModel.add({
        id: 1,
        unreadCount: 12,
        folderId: 3,
        url: 'a3'
      });
      _this.FolderBusinessLayer.markRead(3);
      expect(_this.FeedModel.getById(3).unreadCount).toBe(0);
      expect(_this.FeedModel.getById(1).unreadCount).toBe(0);
      expect(_this.FeedModel.getById(5).unreadCount).toBe(2);
      expect(item1.isRead()).toBe(false);
      expect(item2.isRead()).toBe(true);
      return expect(_this.persistence.setFolderRead).toHaveBeenCalledWith(3, 25);
    });
    it('should not mark folder read when no highest item id', function() {
      _this.FolderModel.add({
        id: 5,
        opened: false,
        name: 'ho'
      });
      _this.persistence.setFolderRead = jasmine.createSpy('setFolderRead');
      _this.FolderBusinessLayer.markRead(5);
      return expect(_this.persistence.setFolderRead).not.toHaveBeenCalled();
    });
    it('should get the correct unread count', function() {
      _this.FeedModel.add({
        id: 5,
        unreadCount: 2,
        folderId: 2,
        url: 'a1'
      });
      _this.FeedModel.add({
        id: 6,
        unreadCount: 3,
        folderId: 3,
        url: 'a2'
      });
      _this.FeedModel.add({
        id: 7,
        unreadCount: 4,
        folderId: 2,
        url: 'a3'
      });
      return expect(_this.FolderBusinessLayer.getUnreadCount(2)).toBe(6);
    });
    it('should be visible if show all is true', function() {
      expect(_this.FolderBusinessLayer.isVisible(3)).toBe(false);
      _this.ShowAll.setShowAll(true);
      return expect(_this.FolderBusinessLayer.isVisible(3)).toBe(true);
    });
    it('should be visible if its active', function() {
      _this.ActiveFeed.handle({
        type: _this.FeedType.Folder,
        id: 3
      });
      return expect(_this.FolderBusinessLayer.isVisible(3)).toBe(true);
    });
    it('should be visible if one of its subfeeds is active', function() {
      _this.FeedModel.add({
        id: 5,
        unreadCount: 0,
        folderId: 2,
        url: 'a1'
      });
      _this.FeedModel.add({
        id: 6,
        unreadCount: 0,
        folderId: 3,
        url: 'a2'
      });
      _this.FeedModel.add({
        id: 7,
        unreadCount: 0,
        folderId: 2,
        url: 'a3'
      });
      _this.ActiveFeed.handle({
        type: _this.FeedType.Feed,
        id: 6
      });
      return expect(_this.FolderBusinessLayer.isVisible(3)).toBe(true);
    });
    it('should be visible if showAll is false and it has unread items', function() {
      _this.FeedModel.add({
        id: 5,
        unreadCount: 2,
        folderId: 2,
        url: 'a1'
      });
      _this.FeedModel.add({
        id: 6,
        unreadCount: 3,
        folderId: 3,
        url: 'a2'
      });
      _this.FeedModel.add({
        id: 7,
        unreadCount: 4,
        folderId: 2,
        url: 'a3'
      });
      _this.ActiveFeed.handle({
        type: _this.FeedType.Folder,
        id: 2
      });
      return expect(_this.FolderBusinessLayer.isVisible(3)).toBe(true);
    });
    it('should return all folders', function() {
      var item1, item2;
      item1 = {
        id: 3,
        open: false,
        name: 'ho'
      };
      item2 = {
        id: 4,
        open: true,
        name: 'hod'
      };
      _this.FolderModel.add(item1);
      _this.FolderModel.add(item2);
      expect(_this.FolderBusinessLayer.getAll()).toContain(item1);
      return expect(_this.FolderBusinessLayer.getAll()).toContain(item2);
    });
    it('should not create a folder if it already exists', function() {
      var item1;
      item1 = {
        id: 4,
        open: true,
        name: 'john'
      };
      _this.FolderModel.add(item1);
      expect(function() {
        return _this.FolderBusinessLayer.create('john');
      }).toThrow(new _this._ExistsError('Exists already'));
      return expect(function() {
        return _this.FolderBusinessLayer.create('johns');
      }).not.toThrow(new _this._ExistsError('Exists already'));
    });
    it('should not create folders that are empty', function() {
      return expect(function() {
        return _this.FolderBusinessLayer.create('   ');
      }).toThrow(new Error('Folder name must not be empty'));
    });
    it('should create a folder before theres a response from the server', function() {
      _this.persistence.createFolder = jasmine.createSpy('create folder');
      _this.FolderBusinessLayer.create('johns');
      expect(_this.FolderModel.size()).toBe(1);
      return expect(_this.FolderModel.getByName('johns').opened).toBe(true);
    });
    it('should make a create folder request', function() {
      _this.persistence.createFolder = jasmine.createSpy('add folder');
      _this.FolderBusinessLayer.create(' johns ');
      return expect(_this.persistence.createFolder).toHaveBeenCalledWith('johns', 0, jasmine.any(Function));
    });
    it('should call the onSuccess function on response status ok', function() {
      var onSuccess;
      onSuccess = jasmine.createSpy('Success');
      _this.persistence.createFolder = jasmine.createSpy('add folder');
      _this.persistence.createFolder.andCallFake(function(folderName, parentId, success) {
        _this.response = {
          status: 'ok',
          data: 'jooo'
        };
        return success(_this.response);
      });
      _this.FolderBusinessLayer.create(' johns ', onSuccess);
      return expect(onSuccess).toHaveBeenCalledWith(_this.response.data);
    });
    it('should call the handle a response error when creating a folder', function() {
      var onFailure, onSuccess;
      onSuccess = jasmine.createSpy('Success');
      onFailure = jasmine.createSpy('Failure');
      _this.persistence.createFolder = jasmine.createSpy('add folder');
      _this.persistence.createFolder.andCallFake(function(folderName, parentId, success) {
        _this.response = {
          status: 'error',
          msg: 'this is an error'
        };
        return success(_this.response);
      });
      _this.FolderBusinessLayer.create(' johns ', onSuccess, onFailure);
      expect(onSuccess).not.toHaveBeenCalled();
      expect(onFailure).toHaveBeenCalled();
      return expect(_this.FolderModel.getByName('johns').error).toBe(_this.response.msg);
    });
    it('should mark a folder error as read by removing it', function() {
      _this.FolderModel.add({
        id: 3,
        name: 'john'
      });
      _this.FolderBusinessLayer.markErrorRead('John');
      expect(_this.FolderModel.size()).toBe(0);
      return expect(_this.FolderModel.getByName('john')).toBe(void 0);
    });
    it('should return the corret folder for id', function() {
      var item;
      item = {
        id: 3,
        name: 'john'
      };
      _this.FolderModel.add(item);
      return expect(_this.FolderBusinessLayer.getById(3)).toBe(item);
    });
    it('should open a folder', function() {
      _this.persistence.openFolder = jasmine.createSpy('open');
      _this.FolderModel.add({
        id: 3,
        opened: false,
        name: 'ho'
      });
      _this.FolderBusinessLayer.open(3);
      expect(_this.FolderModel.getById(3).opened).toBeTruthy();
      return expect(_this.persistence.openFolder).toHaveBeenCalledWith(3);
    });
    it('should not import on empty opml', function() {
      var xml;
      _this.persistence.createFolder = jasmine.createSpy('create folder');
      _this.persistence.createFeed = jasmine.createSpy('create feed');
      xml = '<?xml version="1.0" ?>\
			<opml version="1.1">\
			  <!--Generated by NewsBlur - www.newsblur.com-->\
			  <head>\
			    <title>\
			      NewsBlur Feeds\
			    </title>\
			    <dateCreated>\
			      2013-03-14 16:44:01.356965\
			    </dateCreated>\
			    <dateModified>\
			      2013-03-14 16:44:01.356965\
			    </dateModified>\
			  </head>\
			  <body>\
\
			  </body>\
			</opml>';
      _this.FolderBusinessLayer["import"](xml);
      expect(_this.persistence.createFolder).not.toHaveBeenCalled();
      return expect(_this.persistence.createFeed).not.toHaveBeenCalled();
    });
    it('should import a folder', function() {
      var xml;
      _this.persistence.createFolder = jasmine.createSpy('create folder');
      _this.persistence.createFeed = jasmine.createSpy('create feed');
      xml = '<?xml version="1.0" ?>\
			<opml version="1.1">\
			  <!--Generated by NewsBlur - www.newsblur.com-->\
			  <head>\
			    <title>\
			      NewsBlur Feeds\
			    </title>\
			    <dateCreated>\
			      2013-03-14 16:44:01.356965\
			    </dateCreated>\
			    <dateModified>\
			      2013-03-14 16:44:01.356965\
			    </dateModified>\
			  </head>\
			  <body>\
			  		<outline text="Design" title="Design" />\
			  		<outline text="test" title="test"></outline>\
			  </body>\
			</opml>';
      _this.FolderBusinessLayer["import"](xml);
      expect(_this.persistence.createFolder).toHaveBeenCalledWith('test', 0, jasmine.any(Function));
      return expect(_this.persistence.createFeed).not.toHaveBeenCalled();
    });
    it('should import a feed', function() {
      var xml;
      _this.persistence.createFolder = jasmine.createSpy('create folder');
      _this.persistence.createFeed = jasmine.createSpy('create feed');
      xml = '<?xml version="1.0" ?>\
			<opml version="1.1">\
			  <!--Generated by NewsBlur - www.newsblur.com-->\
			  <head>\
			    <title>\
			      NewsBlur Feeds\
			    </title>\
			    <dateCreated>\
			      2013-03-14 16:44:01.356965\
			    </dateCreated>\
			    <dateModified>\
			      2013-03-14 16:44:01.356965\
			    </dateModified>\
			  </head>\
			  <body>\
			  		<outline htmlUrl="http://worrydream.com/" text=\
			      "&lt;div&gt;Bret Victor\'s website&lt;/div&gt;"\
			      title="&lt;div&gt;Bret Victor\'s website&lt;/div&gt;"\
			      type="rss"\
			      version="RSS" xmlUrl="http://worrydream.com/feed.xml"/>\
			  </body>\
			</opml>';
      _this.FolderBusinessLayer["import"](xml);
      expect(_this.persistence.createFolder).not.toHaveBeenCalled();
      return expect(_this.persistence.createFeed).toHaveBeenCalledWith('http://worrydream.com/feed.xml', 0, jasmine.any(Function));
    });
    it('should import nested folders', function() {
      var xml;
      _this.persistence.createFolder = jasmine.createSpy('create folder');
      _this.persistence.createFolder.andCallFake(function(name, parentId, onSuccess) {
        var data;
        data = {
          data: {
            folders: [
              {
                id: 3
              }
            ]
          }
        };
        return onSuccess(data);
      });
      _this.persistence.createFeed = jasmine.createSpy('create feed');
      xml = '<?xml version="1.0" ?>\
			<opml version="1.1">\
			  <!--Generated by NewsBlur - www.newsblur.com-->\
			  <head>\
			    <title>\
			      NewsBlur Feeds\
			    </title>\
			    <dateCreated>\
			      2013-03-14 16:44:01.356965\
			    </dateCreated>\
			    <dateModified>\
			      2013-03-14 16:44:01.356965\
			    </dateModified>\
			  </head>\
			  <body>\
			  	<outline text="Design" title="Design">\
			  		<outline htmlUrl="http://worrydream.com/" text=\
			      "&lt;div&gt;Bret Victor\'s website&lt;/div&gt;"\
			      title="&lt;div&gt;Bret Victor\'s website&lt;/div&gt;"\
			      type="rss"\
			      version="RSS" xmlUrl="http://worrydream.com/feed.xml"/>\
			    </outline>\
			  </body>\
			</opml>';
      _this.FolderBusinessLayer["import"](xml);
      expect(_this.persistence.createFolder).toHaveBeenCalledWith('Design', 0, jasmine.any(Function));
      return expect(_this.persistence.createFeed).toHaveBeenCalledWith('http://worrydream.com/feed.xml', 3, jasmine.any(Function));
    });
    it('should use an existing folder when importing a folder', function() {
      var folder, xml;
      _this.persistence.createFolder = jasmine.createSpy('create folder');
      _this.persistence.createFeed = jasmine.createSpy('create feed');
      _this.persistence.openFolder = jasmine.createSpy('open');
      folder = {
        id: 2,
        name: 'design',
        opened: false
      };
      _this.FolderModel.add(folder);
      xml = '<?xml version="1.0" ?>\
			<opml version="1.1">\
			  <!--Generated by NewsBlur - www.newsblur.com-->\
			  <head>\
			    <title>\
			      NewsBlur Feeds\
			    </title>\
			    <dateCreated>\
			      2013-03-14 16:44:01.356965\
			    </dateCreated>\
			    <dateModified>\
			      2013-03-14 16:44:01.356965\
			    </dateModified>\
			  </head>\
			  <body>\
			  	<outline text="Design" title="Design">\
			  		<outline htmlUrl="http://worrydream.com/" text=\
			      "&lt;div&gt;Bret Victor\'s website&lt;/div&gt;"\
			      title="&lt;div&gt;Bret Victor\'s website&lt;/div&gt;"\
			      type="rss"\
			      version="RSS" xmlUrl="http://worrydream.com/feed.xml"/>\
			    </outline>\
			  </body>\
			</opml>';
      _this.FolderBusinessLayer["import"](xml);
      expect(_this.persistence.createFolder).not.toHaveBeenCalled();
      expect(_this.persistence.createFeed).toHaveBeenCalledWith('http://worrydream.com/feed.xml', 2, jasmine.any(Function));
      expect(folder.opened).toBe(true);
      return expect(_this.persistence.openFolder).toHaveBeenCalled();
    });
    return it('should not import a feed if it already exists', function() {
      var xml;
      _this.persistence.createFolder = jasmine.createSpy('create folder');
      _this.persistence.createFeed = jasmine.createSpy('create feed');
      _this.FeedModel.add({
        url: 'http://worrydream.com/feed.xml'
      });
      xml = '<?xml version="1.0" ?>\
			<opml version="1.1">\
			  <!--Generated by NewsBlur - www.newsblur.com-->\
			  <head>\
			    <title>\
			      NewsBlur Feeds\
			    </title>\
			    <dateCreated>\
			      2013-03-14 16:44:01.356965\
			    </dateCreated>\
			    <dateModified>\
			      2013-03-14 16:44:01.356965\
			    </dateModified>\
			  </head>\
			  <body>\
			  		<outline htmlUrl="http://worrydream.com/" text=\
			      "&lt;div&gt;Bret Victor\'s website&lt;/div&gt;"\
			      title="&lt;div&gt;Bret Victor\'s website&lt;/div&gt;"\
			      type="rss"\
			      version="RSS" xmlUrl="http://worrydream.com/feed.xml"/>\
			  </body>\
			</opml>';
      _this.FolderBusinessLayer["import"](xml);
      expect(_this.persistence.createFolder).not.toHaveBeenCalled();
      return expect(_this.persistence.createFeed).not.toHaveBeenCalled();
    });
  });

}).call(this);
