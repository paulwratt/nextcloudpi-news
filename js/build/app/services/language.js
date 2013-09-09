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
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  angular.module('News').factory('Language', function() {
    var Language;
    Language = (function() {
      function Language() {
        this._language = 'en';
        this._langs = ['ar-ma', 'ar', 'bg', 'ca', 'cs', 'cv', 'da', 'de', 'el', 'en-ca', 'en-gb', 'eo', 'es', 'et', 'eu', 'fi', 'fr-ca', 'fr', 'gl', 'he', 'hi', 'hu', 'id', 'is', 'it', 'ja', 'ka', 'ko', 'lv', 'ms-my', 'nb', 'ne', 'nl', 'pl', 'pt-br', 'pt', 'ro', 'ru', 'sk', 'sl', 'sv', 'th', 'tr', 'tzm-la', 'tzm', 'uk', 'zh-cn', 'zh-tw'];
      }

      Language.prototype.handle = function(data) {
        data = data.replace('_', '-').toLowerCase();
        if (!(__indexOf.call(this._langs, data) >= 0)) {
          data = data.split('-')[0];
        }
        if (!(__indexOf.call(this._langs, data) >= 0)) {
          data = 'en';
        }
        return this._language = data;
      };

      Language.prototype.getLanguage = function() {
        return this._language;
      };

      Language.prototype.getMomentFromTimestamp = function(timestamp) {
        return moment.unix(timestamp).lang(this._language);
      };

      return Language;

    })();
    return new Language();
  });

}).call(this);
