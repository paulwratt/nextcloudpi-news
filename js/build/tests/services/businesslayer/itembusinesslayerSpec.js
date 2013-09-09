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
  describe('ItemBusinessLayer', function() {
    var _this = this;
    beforeEach(module('News'));
    beforeEach(module(function($provide) {
      _this.persistence = {};
      $provide.value('Persistence', _this.persistence);
    }));
    beforeEach(inject(function(ItemModel, ItemBusinessLayer, StatusFlag, ActiveFeed, FeedType, FeedModel, StarredBusinessLayer, NewestItem) {
      _this.ItemModel = ItemModel;
      _this.ItemBusinessLayer = ItemBusinessLayer;
      _this.StatusFlag = StatusFlag;
      _this.ActiveFeed = ActiveFeed;
      _this.FeedType = FeedType;
      _this.FeedModel = FeedModel;
      _this.StarredBusinessLayer = StarredBusinessLayer;
      _this.NewestItem = NewestItem;
      _this.item1 = {
        id: 5,
        title: 'hi',
        unreadCount: 134,
        url: 'a3',
        folderId: 3
      };
      _this.FeedModel.add(_this.item1);
      return _this.ActiveFeed.handle({
        type: _this.FeedType.Feed,
        id: 3
      });
    }));
    it('should return all items', function() {
      var item1, item2, item3, items;
      item1 = {
        id: 6,
        feedId: 5,
        guidHash: 'a1'
      };
      item2 = {
        id: 3,
        feedId: 5,
        guidHash: 'a2'
      };
      item3 = {
        id: 2,
        feedId: 5,
        guidHash: 'a3'
      };
      _this.ItemModel.add(item1);
      _this.ItemModel.add(item2);
      _this.ItemModel.add(item3);
      items = _this.ItemBusinessLayer.getAll();
      expect(items).toContain(item1);
      expect(items).toContain(item2);
      return expect(items).toContain(item3);
    });
    it('should tell if no feed is active', function() {
      _this.ActiveFeed.handle({
        type: _this.FeedType.Folder,
        id: 0
      });
      expect(_this.ItemBusinessLayer.noFeedActive()).toBe(true);
      _this.ActiveFeed.handle({
        type: _this.FeedType.Subscriptions,
        id: 0
      });
      expect(_this.ItemBusinessLayer.noFeedActive()).toBe(true);
      _this.ActiveFeed.handle({
        type: _this.FeedType.Starred,
        id: 0
      });
      expect(_this.ItemBusinessLayer.noFeedActive()).toBe(true);
      _this.ActiveFeed.handle({
        type: _this.FeedType.Shared,
        id: 0
      });
      expect(_this.ItemBusinessLayer.noFeedActive()).toBe(true);
      _this.ActiveFeed.handle({
        type: _this.FeedType.Feed,
        id: 0
      });
      return expect(_this.ItemBusinessLayer.noFeedActive()).toBe(false);
    });
    it('should return the correct feed title', function() {
      var item2;
      item2 = {
        id: 2,
        feedId: 5,
        guidHash: 'a3'
      };
      _this.ItemModel.add(item2);
      return expect(_this.ItemBusinessLayer.getFeedTitle(2)).toBe('hi');
    });
    it('should set an item unstarred', function() {
      var item2;
      _this.persistence.unstarItem = jasmine.createSpy('star item');
      item2 = {
        id: 2,
        feedId: 5,
        guidHash: 'a3',
        status: 0
      };
      _this.ItemModel.add(item2);
      item2.setStarred();
      _this.ItemBusinessLayer.toggleStarred(2);
      expect(item2.isStarred()).toBe(false);
      expect(_this.StarredBusinessLayer.getUnreadCount()).toBe(-1);
      return expect(_this.persistence.unstarItem).toHaveBeenCalledWith(5, 'a3');
    });
    it('should set an item starred', function() {
      var item2;
      _this.persistence.starItem = jasmine.createSpy('unstar item');
      item2 = {
        id: 2,
        feedId: 5,
        guidHash: 'a3',
        status: 0
      };
      _this.ItemModel.add(item2);
      item2.setUnstarred();
      _this.ItemBusinessLayer.toggleStarred(2);
      expect(item2.isStarred()).toBe(true);
      expect(_this.StarredBusinessLayer.getUnreadCount()).toBe(1);
      return expect(_this.persistence.starItem).toHaveBeenCalledWith(5, 'a3');
    });
    it('should set an item read', function() {
      var item;
      _this.persistence.readItem = jasmine.createSpy('read item');
      item = {
        id: 2,
        feedId: 5,
        guidHash: 'a3',
        status: 0
      };
      _this.ItemModel.add(item);
      item.setUnread();
      _this.ItemBusinessLayer.setRead(2);
      expect(item.isRead()).toBe(true);
      return expect(_this.persistence.readItem).toHaveBeenCalledWith(2);
    });
    it('should not set an item read if its kept unread', function() {
      var item;
      _this.persistence.readItem = jasmine.createSpy('read item');
      item = {
        id: 2,
        feedId: 5,
        guidHash: 'a3',
        status: 0,
        keptUnread: true
      };
      _this.ItemModel.add(item);
      item.setUnread();
      _this.ItemBusinessLayer.setRead(2);
      expect(item.isRead()).toBe(false);
      return expect(_this.persistence.readItem).not.toHaveBeenCalled();
    });
    it('should no set an item read if its already read', function() {
      var item;
      _this.persistence.readItem = jasmine.createSpy('read item');
      item = {
        id: 2,
        feedId: 5,
        guidHash: 'a3',
        status: 0
      };
      _this.ItemModel.add(item);
      item.setRead();
      _this.ItemBusinessLayer.setRead(2);
      return expect(_this.persistence.readItem).not.toHaveBeenCalled();
    });
    it('should return false when item kept unread does not exist', function() {
      return expect(_this.ItemBusinessLayer.isKeptUnread(2)).toBe(false);
    });
    it('should return false if an item is not kept unread', function() {
      var item;
      item = {
        id: 2,
        feedId: 5,
        guidHash: 'a3',
        status: 0
      };
      _this.ItemModel.add(item);
      return expect(_this.ItemBusinessLayer.isKeptUnread(2)).toBe(false);
    });
    it('should toggle an item as kept unread', function() {
      var item;
      _this.persistence.unreadItem = jasmine.createSpy('unread item');
      item = {
        id: 2,
        feedId: 5,
        guidHash: 'a3',
        status: 0
      };
      _this.ItemModel.add(item);
      expect(_this.ItemBusinessLayer.isKeptUnread(2)).toBe(false);
      _this.ItemBusinessLayer.toggleKeepUnread(2);
      expect(_this.ItemBusinessLayer.isKeptUnread(2)).toBe(true);
      _this.ItemBusinessLayer.toggleKeepUnread(2);
      return expect(_this.ItemBusinessLayer.isKeptUnread(2)).toBe(false);
    });
    it('should set an item as unread', function() {
      var item;
      _this.persistence.unreadItem = jasmine.createSpy('unread item');
      item = {
        id: 2,
        feedId: 5,
        guidHash: 'a3',
        status: 0
      };
      _this.ItemModel.add(item);
      item.setRead();
      _this.ItemBusinessLayer.setUnread(2);
      expect(item.isRead()).toBe(false);
      return expect(_this.persistence.unreadItem).toHaveBeenCalledWith(2);
    });
    it('should not set an item as unread if its unread', function() {
      var item;
      _this.persistence.unreadItem = jasmine.createSpy('unread item');
      item = {
        id: 2,
        feedId: 5,
        guidHash: 'a3',
        status: 0
      };
      _this.ItemModel.add(item);
      item.setUnread();
      _this.ItemBusinessLayer.setUnread(2);
      expect(item.isRead()).toBe(false);
      return expect(_this.persistence.unreadItem).not.toHaveBeenCalled();
    });
    it('should set item as unread if kept unread is toggled and it is read', function() {
      var item;
      _this.persistence.unreadItem = jasmine.createSpy('unread item');
      item = {
        id: 2,
        feedId: 5,
        guidHash: 'a3',
        status: 0
      };
      _this.ItemModel.add(item);
      item.setRead();
      _this.ItemBusinessLayer.toggleKeepUnread(2);
      expect(item.isRead()).toBe(false);
      return expect(_this.persistence.unreadItem).toHaveBeenCalledWith(2);
    });
    it('should lower the unread count of a feed when its items get read', function() {
      var item;
      _this.persistence.readItem = jasmine.createSpy('read item');
      item = {
        id: 2,
        feedId: 5,
        guidHash: 'a3',
        status: 0
      };
      _this.ItemModel.add(item);
      item.setUnread();
      _this.ItemBusinessLayer.setRead(2);
      return expect(_this.item1.unreadCount).toBe(133);
    });
    it('should increase the unread count of a feed when its items get unread', function() {
      var item;
      _this.persistence.unreadItem = jasmine.createSpy('unread item');
      item = {
        id: 2,
        feedId: 5,
        guidHash: 'a3',
        status: 0
      };
      _this.ItemModel.add(item);
      item.setRead();
      _this.ItemBusinessLayer.setUnread(2);
      return expect(_this.item1.unreadCount).toBe(135);
    });
    return it('should load the next items', function() {
      var callback;
      _this.NewestItem.handle(13);
      _this.persistence.getItems = jasmine.createSpy('autopage');
      callback = function() {};
      _this.ItemModel.add({
        id: 2,
        guidHash: 'abc',
        feedId: 2,
        status: 16
      });
      _this.ItemModel.add({
        id: 3,
        guidHash: 'abcd',
        feedId: 2,
        status: 16
      });
      _this.ItemModel.add({
        id: 1,
        guidHash: 'abce',
        feedId: 2,
        status: 16
      });
      _this.ItemModel.add({
        id: 6,
        guidHash: 'abcf',
        feedId: 2,
        status: 16
      });
      _this.ItemBusinessLayer.loadNext(callback);
      return expect(_this.persistence.getItems).toHaveBeenCalledWith(_this.FeedType.Feed, 3, 1, jasmine.any(Function));
    });
  });

}).call(this);
