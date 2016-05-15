(function() {
  var CompositeDisposable, Disposable, EpitechNorm, _ref;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable;

  EpitechNorm = require('./epitech-norm');

  module.exports = {
    config: {
      autoActivateOnCSource: {
        type: 'boolean',
        "default": true
      },
      autoActivateOnMakefileSource: {
        type: 'boolean',
        "default": true
      },
      autoActivateOnCppSource: {
        type: 'boolean',
        "default": true
      }
    },
    normByEditor: null,
    activate: function() {
      var activeEditor, getNorm;
      this.normByEditor = new WeakMap;
      atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var norm;
          if (!editor) {
            return;
          }
          norm = new EpitechNorm(editor);
          return _this.normByEditor.set(editor, norm);
        };
      })(this));
      getNorm = (function(_this) {
        return function(e) {
          if (!(e && _this.normByEditor)) {
            return null;
          }
          return _this.normByEditor.get(e);
        };
      })(this);
      activeEditor = (function(_this) {
        return function() {
          return atom.workspace.getActiveTextEditor();
        };
      })(this);
      return atom.commands.add('atom-workspace', {
        'epitech-norm:toggle': (function(_this) {
          return function() {
            var _ref1;
            return (_ref1 = getNorm(activeEditor())) != null ? _ref1.toggle() : void 0;
          };
        })(this),
        'epitech-norm:indent': (function(_this) {
          return function(e) {
            var _ref1;
            return (_ref1 = getNorm(activeEditor())) != null ? _ref1.indent(e) : void 0;
          };
        })(this),
        'epitech-norm:insertTab': (function(_this) {
          return function(e) {
            var _ref1;
            return (_ref1 = getNorm(activeEditor())) != null ? _ref1.insertTab(e) : void 0;
          };
        })(this),
        'epitech-norm:newLine': (function(_this) {
          return function(e) {
            var _ref1;
            return (_ref1 = getNorm(activeEditor())) != null ? _ref1.insertNewLine(e) : void 0;
          };
        })(this)
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbG9pYy8uYXRvbS9wYWNrYWdlcy9hdG9tLWVwaXRlY2gtbm9ybS9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0RBQUE7O0FBQUEsRUFBQSxPQUFvQyxPQUFBLENBQVEsTUFBUixDQUFwQyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGtCQUFBLFVBQXRCLENBQUE7O0FBQUEsRUFDQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBRGQsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEscUJBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BREY7QUFBQSxNQUdBLDRCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQUpGO0FBQUEsTUFNQSx1QkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FQRjtLQURGO0FBQUEsSUFXQSxZQUFBLEVBQWMsSUFYZDtBQUFBLElBYUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEscUJBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxZQUFELEdBQWdCLEdBQUEsQ0FBQSxPQUFoQixDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE1BQUQsR0FBQTtBQUNoQyxjQUFBLElBQUE7QUFBQSxVQUFBLElBQUEsQ0FBQSxNQUFBO0FBQUEsa0JBQUEsQ0FBQTtXQUFBO0FBQUEsVUFFQSxJQUFBLEdBQVcsSUFBQSxXQUFBLENBQVksTUFBWixDQUZYLENBQUE7aUJBR0EsS0FBQyxDQUFBLFlBQVksQ0FBQyxHQUFkLENBQWtCLE1BQWxCLEVBQTBCLElBQTFCLEVBSmdDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEMsQ0FGQSxDQUFBO0FBQUEsTUFRQSxPQUFBLEdBQVUsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsQ0FBRCxHQUFBO0FBQ1IsVUFBQSxJQUFBLENBQUEsQ0FBbUIsQ0FBQSxJQUFNLEtBQUMsQ0FBQSxZQUExQixDQUFBO0FBQUEsbUJBQU8sSUFBUCxDQUFBO1dBQUE7QUFDQSxpQkFBTyxLQUFDLENBQUEsWUFBWSxDQUFDLEdBQWQsQ0FBa0IsQ0FBbEIsQ0FBUCxDQUZRO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FSVixDQUFBO0FBQUEsTUFZQSxZQUFBLEdBQWUsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDYixJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsRUFEYTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBWmYsQ0FBQTthQWVBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDRTtBQUFBLFFBQUEscUJBQUEsRUFBdUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDckIsZ0JBQUEsS0FBQTtvRUFBdUIsQ0FBRSxNQUF6QixDQUFBLFdBRHFCO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkI7QUFBQSxRQUVBLHFCQUFBLEVBQXVCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxDQUFELEdBQUE7QUFDckIsZ0JBQUEsS0FBQTtvRUFBdUIsQ0FBRSxNQUF6QixDQUFnQyxDQUFoQyxXQURxQjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRnZCO0FBQUEsUUFJQSx3QkFBQSxFQUEwQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsQ0FBRCxHQUFBO0FBQ3hCLGdCQUFBLEtBQUE7b0VBQXVCLENBQUUsU0FBekIsQ0FBbUMsQ0FBbkMsV0FEd0I7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUoxQjtBQUFBLFFBTUEsc0JBQUEsRUFBd0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLENBQUQsR0FBQTtBQUN0QixnQkFBQSxLQUFBO29FQUF1QixDQUFFLGFBQXpCLENBQXVDLENBQXZDLFdBRHNCO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FOeEI7T0FERixFQWhCUTtJQUFBLENBYlY7R0FKRixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/loic/.atom/packages/atom-epitech-norm/lib/main.coffee
