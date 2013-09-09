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
  describe('StatusFlag', function() {
    var _this = this;
    beforeEach(module('News'));
    beforeEach(inject(function(StatusFlag) {
      _this.StatusFlag = StatusFlag;
    }));
    return it('should have the correct status flags', function() {
      expect(_this.StatusFlag.UNREAD).toBe(0x02);
      expect(_this.StatusFlag.STARRED).toBe(0x04);
      expect(_this.StatusFlag.DELETED).toBe(0x08);
      return expect(_this.StatusFlag.UPDATED).toBe(0x16);
    });
  });

}).call(this);
