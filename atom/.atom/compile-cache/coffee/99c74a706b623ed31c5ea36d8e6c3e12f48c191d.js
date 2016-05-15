(function() {
  var __slice = [].slice;

  module.exports = {
    emptyTags: [],
    disposable: {},
    config: {
      emptyTags: {
        type: "string",
        "default": "!doctype, br, hr, img, input, link, meta, area, base, col, command, embed, keygen, param, source, track, wbr"
      }
    },
    deactivate: function(state) {
      var key, _i, _len, _ref, _results;
      _ref = Object.keys(this.disposable);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        this.disposable[key].dispose();
        _results.push(delete this.disposable[key]);
      }
      return _results;
    },
    activate: function(state) {
      atom.config.observe("less-than-slash.emptyTags", (function(_this) {
        return function(value) {
          var tag;
          return _this.emptyTags = (function() {
            var _i, _len, _ref, _results;
            _ref = value.split(/\s*[\s,|]+\s*/);
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              tag = _ref[_i];
              _results.push(tag.toLowerCase());
            }
            return _results;
          })();
        };
      })(this));
      return this.disposable._root = atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var buffer;
          buffer = editor.getBuffer();
          if (!_this.disposable[buffer.id]) {
            _this.disposable[buffer.id] = buffer.onDidChange(function(event) {
              var getCheckText, getText, textToInsert;
              if (event.newText === "/") {
                if (event.newRange.start.column > 0) {
                  getCheckText = function() {
                    return buffer.getTextInRange([[event.newRange.start.row, 0], event.newRange.end]);
                  };
                  getText = function() {
                    return buffer.getTextInRange([[0, 0], event.oldRange.end]);
                  };
                  if (textToInsert = _this.onSlash(getCheckText, getText)) {
                    buffer["delete"]([[event.newRange.end.row, event.newRange.end.column - 2], event.newRange.end]);
                    return buffer.insert([event.newRange.end.row, event.newRange.end.column - 2], textToInsert);
                  }
                }
              }
            });
            return buffer.onDidDestroy(function(event) {
              if (_this.disposable[buffer.id]) {
                _this.disposable[buffer.id].dispose();
                return delete _this.disposable[buffer.id];
              }
            });
          }
        };
      })(this));
    },
    onSlash: function(getCheckText, getText) {
      var checkText, tag, text;
      checkText = getCheckText();
      if (this.stringEndsWith(checkText, '</')) {
        text = getText();
        if (tag = this.getNextCloseableTag(text)) {
          if (tag.type === "xml") {
            return "</" + tag.element + ">";
          } else {
            return "" + tag.element;
          }
        }
      }
      return null;
    },
    getNextCloseableTag: function(text) {
      var nextCloseableTag, unclosedTags;
      unclosedTags = this.findUnclosedTags(text);
      if (nextCloseableTag = unclosedTags.pop()) {
        return nextCloseableTag;
      }
      return null;
    },
    findUnclosedTags: function(text) {
      var index, unclosedTags;
      unclosedTags = [];
      while (text !== '') {
        if (this.preTests.indexOf(text[0]) > -1) {
          text = this.handleNextTag(text, unclosedTags);
        } else {
          index = this.preTests.map(function(testChar) {
            return text.indexOf(testChar);
          }).reduce(this.minIndex);
          if (!!~index) {
            text = text.substr(index);
          }
        }
      }
      return unclosedTags;
    },
    handleNextTag: function(text, unclosedTags) {
      var currentTag, foundMatchingTag, tag, _unclosedTags;
      if (tag = this.parseNextTag(text)) {
        if (tag.opening) {
          if (!this.isEmpty(tag.element)) {
            unclosedTags.push({
              element: tag.element,
              type: tag.type
            });
          }
        } else if (tag.closing) {
          _unclosedTags = unclosedTags.slice();
          foundMatchingTag = false;
          while (unclosedTags.length) {
            currentTag = unclosedTags.pop();
            if (currentTag.element === tag.element && currentTag.type === tag.type) {
              foundMatchingTag = true;
              break;
            }
          }
          if (!foundMatchingTag) {
            unclosedTags.splice.apply(unclosedTags, [0, 0].concat(__slice.call(_unclosedTags)));
          }
        } else if (tag.selfClosing) {

        } else {
          console.error("This should be impossible...");
        }
        return text.substr(tag.length);
      } else {
        return text.substr(1);
      }
    },
    parseNextTag: function(text) {
      var parser, test, _i, _j, _len, _len1, _ref, _ref1;
      _ref = this.parsers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        parser = _ref[_i];
        _ref1 = parser.test;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          test = _ref1[_j];
          if (this.stringStartsWith(text, test)) {
            return this[parser.parse](text);
          }
        }
      }
      return null;
    },
    parsers: [
      {
        test: ["<!--", "-->"],
        parse: 'parseXMLComment'
      }, {
        test: ["<![CDATA[", "]]>"],
        parse: 'parseXMLCDATA'
      }, {
        test: ["<%=", "%>"],
        parse: 'parseNoOp'
      }, {
        test: ["<"],
        parse: 'parseXMLTag'
      }
    ],
    preTests: ["<", "]", "-"],
    parseNoOp: function(text) {
      return null;
    },
    parseXMLTag: function(text) {
      var match, result;
      result = {
        opening: false,
        closing: false,
        selfClosing: false,
        element: '',
        type: 'xml',
        length: 0
      };
      match = text.match(/^<(\/)?([^\s\/<>]+)(\s+([\w-:]+)(=["'`{](.*?)["'`}])?)*\s*(\/)?>/i);
      if (match) {
        result.element = match[2];
        result.length = match[0].length;
        result.opening = match[1] || match[7] ? false : true;
        result.closing = match[1] ? true : false;
        result.selfClosing = match[7] ? true : false;
        return result;
      } else {
        return null;
      }
    },
    parseXMLComment: function(text) {
      var match, result;
      result = {
        opening: false,
        closing: false,
        selfClosing: false,
        element: '-->',
        type: 'xml-comment',
        length: 0
      };
      match = text.match(/(<!--)|(-->)/);
      if (match) {
        result.length = match[0].length;
        result.opening = match[1] ? true : false;
        result.closing = match[2] ? true : false;
        return result;
      } else {
        return null;
      }
    },
    parseXMLCDATA: function(text) {
      var match, result;
      result = {
        opening: false,
        closing: false,
        selfClosing: false,
        element: ']]>',
        type: 'xml-cdata',
        length: 0
      };
      match = text.match(/(<!\[CDATA\[)|(\]\]>)/i);
      if (match) {
        result.length = match[0].length;
        result.opening = match[1] ? true : false;
        result.closing = match[2] ? true : false;
        return result;
      } else {
        return null;
      }
    },
    isEmpty: function(tag) {
      if (tag) {
        return this.emptyTags.indexOf(tag.toLowerCase()) > -1;
      } else {
        return false;
      }
    },
    minIndex: function(a, b) {
      if (a === b) {
        return a;
      }
      if (b < 0) {
        return a;
      }
      if (a < 0) {
        return b;
      }
      if (a < b) {
        return a;
      }
      if (b < a) {
        return b;
      }
    },
    stringEndsWith: function(a, b) {
      return a.substr(a.length - b.length, a.length) === b;
    },
    stringStartsWith: function(a, b) {
      return a.substr(0, b.length) === b;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbG9pYy8uYXRvbS9wYWNrYWdlcy9sZXNzLXRoYW4tc2xhc2gvbGliL2xlc3MtdGhhbi1zbGFzaC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFJQTtBQUFBLE1BQUEsa0JBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxTQUFBLEVBQVcsRUFBWDtBQUFBLElBRUEsVUFBQSxFQUFZLEVBRlo7QUFBQSxJQUlBLE1BQUEsRUFDRTtBQUFBLE1BQUEsU0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLDhHQURUO09BREY7S0FMRjtBQUFBLElBU0EsVUFBQSxFQUFZLFNBQUMsS0FBRCxHQUFBO0FBQ1YsVUFBQSw2QkFBQTtBQUFBO0FBQUE7V0FBQSwyQ0FBQTt1QkFBQTtBQUNFLFFBQUEsSUFBQyxDQUFBLFVBQVcsQ0FBQSxHQUFBLENBQUksQ0FBQyxPQUFqQixDQUFBLENBQUEsQ0FBQTtBQUFBLHNCQUNBLE1BQUEsQ0FBQSxJQUFRLENBQUEsVUFBVyxDQUFBLEdBQUEsRUFEbkIsQ0FERjtBQUFBO3NCQURVO0lBQUEsQ0FUWjtBQUFBLElBY0EsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBRVIsTUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsMkJBQXBCLEVBQWlELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEtBQUQsR0FBQTtBQUMvQyxjQUFBLEdBQUE7aUJBQUEsS0FBQyxDQUFBLFNBQUQ7O0FBQWM7QUFBQTtpQkFBQSwyQ0FBQTs2QkFBQTtBQUFBLDRCQUFBLEdBQUcsQ0FBQyxXQUFKLENBQUEsRUFBQSxDQUFBO0FBQUE7O2VBRGlDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakQsQ0FBQSxDQUFB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

//# sourceURL=/home/loic/.atom/packages/less-than-slash/lib/less-than-slash.coffee
