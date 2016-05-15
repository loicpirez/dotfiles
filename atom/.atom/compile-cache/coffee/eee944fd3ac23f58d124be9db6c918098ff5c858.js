(function() {
  var LessThanSlash;

  LessThanSlash = require('../lib/less-than-slash');

  describe("LessThanSlash", function() {
    var activationPromise, workspaceElement;
    activationPromise = null;
    workspaceElement = null;
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('less-than-slash');
    });
    describe("onSlash", function() {
      it("returns the appropriate closing tag", function() {
        var getCheckText, getText;
        getCheckText = function() {
          return '<div class="moo"><a href="/cows">More cows!</';
        };
        getText = function() {
          return '<div class="moo"><a href="/cows">More cows!<';
        };
        expect(LessThanSlash.onSlash(getCheckText, getText)).toBe('</a>');
        getCheckText = function() {
          return '<div class="moo"><a href="/cows">More cows!</a></';
        };
        getText = function() {
          return '<div class="moo"><a href="/cows">More cows!</a><';
        };
        return expect(LessThanSlash.onSlash(getCheckText, getText)).toBe('</div>');
      });
      it("also works for comments", function() {
        var getCheckText, getText;
        getCheckText = function() {
          return '<!--<div class="moo"><a href="/cows">More cows!</a></div></';
        };
        getText = function() {
          return '<!--<div class="moo"><a href="/cows">More cows!</a></div><';
        };
        expect(LessThanSlash.onSlash(getCheckText, getText)).toBe('-->');
        getCheckText = function() {
          return '<div class="moo"><a href="/cows"><!--More cows!--></';
        };
        getText = function() {
          return '<div class="moo"><a href="/cows"><!--More cows!--><';
        };
        return expect(LessThanSlash.onSlash(getCheckText, getText)).toBe('</a>');
      });
      it("also works inside comments", function() {
        var getCheckText, getText;
        getCheckText = function() {
          return '<!--<div class="moo"><a href="/cows">More cows!</a></';
        };
        getText = function() {
          return '<!--<div class="moo"><a href="/cows">More cows!</a><';
        };
        return expect(LessThanSlash.onSlash(getCheckText, getText)).toBe('</div>');
      });
      it("also works for XML CDATA", function() {
        var getCheckText, getText;
        getCheckText = function() {
          return '<![CDATA[<div class="moo"><a href="/cows">More cows!</a></div></';
        };
        getText = function() {
          return '<![CDATA[<div class="moo"><a href="/cows">More cows!</a></div><';
        };
        expect(LessThanSlash.onSlash(getCheckText, getText)).toBe(']]>');
        getCheckText = function() {
          return '<div class="moo"><a href="/cows"><![CDATA[More cows!]]></';
        };
        getText = function() {
          return '<div class="moo"><a href="/cows"><![CDATA[More cows!]]><';
        };
        return expect(LessThanSlash.onSlash(getCheckText, getText)).toBe('</a>');
      });
      it("also works inside XML CDATA", function() {
        var getCheckText, getText;
        getCheckText = function() {
          return '<![CDATA[<div class="moo"><a href="/cows">More cows!</a></';
        };
        getText = function() {
          return '<![CDATA[<div class="moo"><a href="/cows">More cows!</a><';
        };
        return expect(LessThanSlash.onSlash(getCheckText, getText)).toBe('</div>');
      });
      it("returns null if there are no tags to close", function() {
        var getCheckText, getText;
        getCheckText = function() {
          return '<div class="moo"><a href="/cows">More cows!</a></div></';
        };
        getText = function() {
          return '<div class="moo"><a href="/cows">More cows!</a></div><';
        };
        expect(LessThanSlash.onSlash(getCheckText, getText)).toBe(null);
        getCheckText = function() {
          return '</';
        };
        getText = function() {
          return '<';
        };
        return expect(LessThanSlash.onSlash(getCheckText, getText)).toBe(null);
      });
      return it("works around mismatched tags", function() {
        var getCheckText, getText;
        getCheckText = function() {
          return '<div class="moo"><a href="/cows">More cows!</i></';
        };
        getText = function() {
          return '<div class="moo"><a href="/cows">More cows!</i><';
        };
        expect(LessThanSlash.onSlash(getCheckText, getText)).toBe('</a>');
        getCheckText = function() {
          return '<div class="moo"><a href="/cows"><em>More cows!</i></a></';
        };
        getText = function() {
          return '<div class="moo"><a href="/cows"><em>More cows!</i></a><';
        };
        return expect(LessThanSlash.onSlash(getCheckText, getText)).toBe('</div>');
      });
    });
    describe("getNextCloseableTag", function() {
      it("returns the next closeable tag", function() {
        var text;
        text = "<div>";
        expect(LessThanSlash.getNextCloseableTag(text)).toEqual({
          element: "div",
          type: "xml"
        });
        text = "<div><a><br></a><ul><li></li><li></li></ul>";
        return expect(LessThanSlash.getNextCloseableTag(text)).toEqual({
          element: "div",
          type: "xml"
        });
      });
      return it("returns null when all tags are closed", function() {
        var text;
        text = "<div><a></a></div>";
        return expect(LessThanSlash.getNextCloseableTag(text)).toBe(null);
      });
    });
    describe("findUnclosedTags", function() {
      it("returns a list of unclosed tags", function() {
        var text;
        text = "<div><a></a><em>";
        expect(LessThanSlash.findUnclosedTags(text)).toEqual([
          {
            element: "div",
            type: "xml"
          }, {
            element: "em",
            type: "xml"
          }
        ]);
        text = "<div><a></a></div>";
        return expect(LessThanSlash.findUnclosedTags(text)).toEqual([]);
      });
      return it("still works around mismatched tags", function() {
        var text;
        text = "<div></i><a>";
        return expect(LessThanSlash.findUnclosedTags(text)).toEqual([
          {
            element: "div",
            type: "xml"
          }, {
            element: "a",
            type: "xml"
          }
        ]);
      });
    });
    describe("handleNextTag", function() {
      it("consumes the next tag and places it in the stack", function() {
        var text, unclosedTags;
        text = "<div><a>";
        unclosedTags = [];
        expect(LessThanSlash.handleNextTag(text, unclosedTags)).toBe("<a>");
        return expect(unclosedTags).toEqual([
          {
            element: "div",
            type: "xml"
          }
        ]);
      });
      it("consumes the next closing tag and removes it from the stack", function() {
        var text, unclosedTags;
        text = "</a></div>";
        unclosedTags = [
          {
            element: "div",
            type: "xml"
          }, {
            element: "a",
            type: "xml"
          }
        ];
        expect(LessThanSlash.handleNextTag(text, unclosedTags)).toBe("</div>");
        return expect(unclosedTags).toEqual([
          {
            element: "div",
            type: "xml"
          }
        ]);
      });
      return it("discards mismatched tags", function() {
        var text, unclosedTags;
        text = "</em></a></div>";
        unclosedTags = [
          {
            element: "div",
            type: "xml"
          }, {
            element: "a",
            type: "xml"
          }
        ];
        expect(LessThanSlash.handleNextTag(text, unclosedTags)).toBe("</a></div>");
        return expect(unclosedTags).toEqual([
          {
            element: "div",
            type: "xml"
          }, {
            element: "a",
            type: "xml"
          }
        ]);
      });
    });
    describe("parseNextTag", function() {
      return it("parses tags, comments, and cdata", function() {
        var text;
        text = "<div>";
        expect(LessThanSlash.parseNextTag(text)).toEqual({
          opening: true,
          closing: false,
          selfClosing: false,
          element: 'div',
          type: 'xml',
          length: 5
        });
        text = "<!--";
        expect(LessThanSlash.parseNextTag(text)).toEqual({
          opening: true,
          closing: false,
          selfClosing: false,
          element: '-->',
          type: 'xml-comment',
          length: 4
        });
        text = "<![CDATA[";
        return expect(LessThanSlash.parseNextTag(text)).toEqual({
          opening: true,
          closing: false,
          selfClosing: false,
          element: ']]>',
          type: 'xml-cdata',
          length: 9
        });
      });
    });
    describe("parseXMLTag", function() {
      it("parses an opening tag", function() {
        var text;
        text = "<div>";
        return expect(LessThanSlash.parseXMLTag(text)).toEqual({
          opening: true,
          closing: false,
          selfClosing: false,
          element: 'div',
          type: 'xml',
          length: 5
        });
      });
      it("parses a closing tag", function() {
        var text;
        text = "</div>";
        return expect(LessThanSlash.parseXMLTag(text)).toEqual({
          opening: false,
          closing: true,
          selfClosing: false,
          element: 'div',
          type: 'xml',
          length: 6
        });
      });
      it("parses self closing tags", function() {
        var text;
        text = "<br/>";
        return expect(LessThanSlash.parseXMLTag(text)).toEqual({
          opening: false,
          closing: false,
          selfClosing: true,
          element: 'br',
          type: 'xml',
          length: 5
        });
      });
      it("returns null when there is no tag", function() {
        var text;
        text = "No tag here!";
        return expect(LessThanSlash.parseXMLTag(text)).toBe(null);
      });
      it("works around element properties", function() {
        var text;
        text = "<div class=\"container\">";
        return expect(LessThanSlash.parseXMLTag(text)).toEqual({
          opening: true,
          closing: false,
          selfClosing: false,
          element: 'div',
          type: 'xml',
          length: 23
        });
      });
      it("doesn't care which quotes you use", function() {
        var text;
        text = "<div class='container'>";
        expect(LessThanSlash.parseXMLTag(text)).toEqual({
          opening: true,
          closing: false,
          selfClosing: false,
          element: 'div',
          type: 'xml',
          length: 23
        });
        text = "<div class=`container`>";
        return expect(LessThanSlash.parseXMLTag(text)).toEqual({
          opening: true,
          closing: false,
          selfClosing: false,
          element: 'div',
          type: 'xml',
          length: 23
        });
      });
      it("plays nicely with JSX curly brace property values", function() {
        var text;
        text = "<input type=\"text\" disabled={this.props.isDisabled}/>";
        return expect(LessThanSlash.parseXMLTag(text)).toEqual({
          opening: false,
          closing: false,
          selfClosing: true,
          element: 'input',
          type: 'xml',
          length: 53
        });
      });
      it("plays nicely with multiline namespaced attributes", function() {
        var text;
        text = "<elem\n ns1:attr1=\"text\"\n  ns2:attr2=\"text\"\n>";
        return expect(LessThanSlash.parseXMLTag(text)).toEqual({
          opening: true,
          closing: false,
          selfClosing: false,
          element: 'elem',
          type: 'xml',
          length: 44
        });
      });
      it("works around weird spacing", function() {
        var text;
        text = "<div  class=\"container\" \n  foo=\"bar\">";
        return expect(LessThanSlash.parseXMLTag(text)).toEqual({
          opening: true,
          closing: false,
          selfClosing: false,
          element: 'div',
          type: 'xml',
          length: 37
        });
      });
      it("works around lone properties", function() {
        var text;
        text = "<input type=\"text\" required/>";
        return expect(LessThanSlash.parseXMLTag(text)).toEqual({
          opening: false,
          closing: false,
          selfClosing: true,
          element: 'input',
          type: 'xml',
          length: 29
        });
      });
      it("doesn't have a cow when properties contain a '>'", function() {
        var text;
        text = "<p ng-show=\"3 > 5\">Uh oh!";
        return expect(LessThanSlash.parseXMLTag(text)).toEqual({
          opening: true,
          closing: false,
          selfClosing: false,
          element: 'p',
          type: 'xml',
          length: 19
        });
      });
      it("finds the expected tag when tags are nested", function() {
        var text;
        text = "<a><i>";
        return expect(LessThanSlash.parseXMLTag(text)).toEqual({
          opening: true,
          closing: false,
          selfClosing: false,
          element: 'a',
          type: 'xml',
          length: 3
        });
      });
      it("finds the expected tag when tags with attributes are nested", function() {
        var text;
        text = "<a href=\"#\"><i class=\"fa fa-home\">";
        return expect(LessThanSlash.parseXMLTag(text)).toEqual({
          opening: true,
          closing: false,
          selfClosing: false,
          element: 'a',
          type: 'xml',
          length: 12
        });
      });
      return it("does not consume leading tag openings (<)", function() {
        var text;
        text = "<<a>";
        return expect(LessThanSlash.parseXMLTag(text)).toBe(null);
      });
    });
    describe("parseXMLComment", function() {
      return it("parses comments as if they were tags", function() {
        var text;
        text = "<!--";
        expect(LessThanSlash.parseXMLComment(text)).toEqual({
          opening: true,
          closing: false,
          selfClosing: false,
          element: '-->',
          type: 'xml-comment',
          length: 4
        });
        text = "-->";
        return expect(LessThanSlash.parseXMLComment(text)).toEqual({
          opening: false,
          closing: true,
          selfClosing: false,
          element: '-->',
          type: 'xml-comment',
          length: 3
        });
      });
    });
    describe("parseXMLCDATA", function() {
      return it("parses CDATA as if they were tags", function() {
        var text;
        text = "<![CDATA[";
        expect(LessThanSlash.parseXMLCDATA(text)).toEqual({
          opening: true,
          closing: false,
          selfClosing: false,
          element: ']]>',
          type: 'xml-cdata',
          length: 9
        });
        text = "]]>";
        return expect(LessThanSlash.parseXMLCDATA(text)).toEqual({
          opening: false,
          closing: true,
          selfClosing: false,
          element: ']]>',
          type: 'xml-cdata',
          length: 3
        });
      });
    });
    describe("isEmpty", function() {
      it("is true when it isEmpty", function() {
        return expect(LessThanSlash.isEmpty("br")).toBe(true);
      });
      return it("is false when not isEmpty", function() {
        return expect(LessThanSlash.isEmpty("div")).toBe(false);
      });
    });
    describe("minIndex", function() {
      it("returns the lower number", function() {
        var lower;
        lower = LessThanSlash.minIndex(3, 5);
        expect(lower).toBe(3);
        lower = LessThanSlash.minIndex(5, 3);
        return expect(lower).toBe(3);
      });
      it("discards a negative index", function() {
        var lower;
        lower = LessThanSlash.minIndex(3, -1);
        expect(lower).toBe(3);
        lower = LessThanSlash.minIndex(-1, 3);
        return expect(lower).toBe(3);
      });
      return it("passes on double negative indicies", function() {
        var lower;
        lower = LessThanSlash.minIndex(-1, -1);
        return expect(lower).toBe(-1);
      });
    });
    describe("stringEndsWith", function() {
      it("returns true if the first string ends in the second", function() {
        var a, b;
        a = "don't have a cow, man!";
        b = "man!";
        return expect(LessThanSlash.stringEndsWith(a, b)).toBe(true);
      });
      return it("returns false if the first string does not end in the second", function() {
        var a, b;
        a = "chunky bacon";
        b = "chunky";
        return expect(LessThanSlash.stringEndsWith(a, b)).toBe(false);
      });
    });
    return describe("stringStartsWith", function() {
      it("returns true if the first string ends starts with the second", function() {
        var a, b;
        a = "chunky bacon";
        b = "chunky";
        return expect(LessThanSlash.stringStartsWith(a, b)).toBe(true);
      });
      return it("returns false if the first string does not start with the second", function() {
        var a, b;
        a = "don't have a cow, man!";
        b = "man!";
        return expect(LessThanSlash.stringStartsWith(a, b)).toBe(false);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbG9pYy8uYXRvbS9wYWNrYWdlcy9sZXNzLXRoYW4tc2xhc2gvc3BlYy9sZXNzLXRoYW4tc2xhc2gtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFJQTtBQUFBLE1BQUEsYUFBQTs7QUFBQSxFQUFBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLHdCQUFSLENBQWhCLENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMsZUFBVCxFQUEwQixTQUFBLEdBQUE7QUFDeEIsUUFBQSxtQ0FBQTtBQUFBLElBQUEsaUJBQUEsR0FBb0IsSUFBcEIsQ0FBQTtBQUFBLElBQ0EsZ0JBQUEsR0FBbUIsSUFEbkIsQ0FBQTtBQUFBLElBR0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFuQixDQUFBO2FBQ0EsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGlCQUE5QixFQUZYO0lBQUEsQ0FBWCxDQUhBLENBQUE7QUFBQSxJQU9BLFFBQUEsQ0FBUyxTQUFULEVBQW9CLFNBQUEsR0FBQTtBQUNsQixNQUFBLEVBQUEsQ0FBRyxxQ0FBSCxFQUEwQyxTQUFBLEdBQUE7QUFDeEMsWUFBQSxxQkFBQTtBQUFBLFFBQUEsWUFBQSxHQUFlLFNBQUEsR0FBQTtpQkFDYixnREFEYTtRQUFBLENBQWYsQ0FBQTtBQUFBLFFBRUEsT0FBQSxHQUFVLFNBQUEsR0FBQTtpQkFDUiwrQ0FEUTtRQUFBLENBRlYsQ0FBQTtBQUFBLFFBSUEsTUFBQSxDQUFPLGFBQWEsQ0FBQyxPQUFkLENBQXNCLFlBQXRCLEVBQW9DLE9BQXBDLENBQVAsQ0FBb0QsQ0FBQyxJQUFyRCxDQUEwRCxNQUExRCxDQUpBLENBQUE7QUFBQSxRQU1BLFlBQUEs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

//# sourceURL=/home/loic/.atom/packages/less-than-slash/spec/less-than-slash-spec.coffee
