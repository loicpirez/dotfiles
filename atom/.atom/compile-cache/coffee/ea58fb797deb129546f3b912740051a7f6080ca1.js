(function() {
  var $, Dialog, TextEditorView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  module.exports = Dialog = (function(_super) {
    __extends(Dialog, _super);

    function Dialog(_arg) {
      var editor, onConfirm, text, _ref1;
      _ref1 = _arg != null ? _arg : {}, editor = _ref1.editor, text = _ref1.text, onConfirm = _ref1.onConfirm;
      this.editor = editor;
      this.text = text;
      this.onConfirm = onConfirm;
      Dialog.__super__.constructor.apply(this, arguments);
    }

    Dialog.content = function() {
      return this.div({
        "class": 'tree-view-dialog'
      }, (function(_this) {
        return function() {
          _this.label("Enter project name:", {
            "class": 'icon',
            outlet: 'promptText'
          });
          _this.subview('miniEditor', new TextEditorView({
            mini: true
          }));
          return _this.div({
            "class": 'error-message',
            outlet: 'errorMessage'
          });
        };
      })(this));
    };

    Dialog.prototype.initialize = function() {
      atom.commands.add(this.element, {
        'core:confirm': (function(_this) {
          return function() {
            return _this.onConfirm(_this.editor, _this.text, _this.miniEditor.getText(), _this.close);
          };
        })(this),
        'core:cancel': (function(_this) {
          return function() {
            return _this.cancel();
          };
        })(this)
      });
      this.miniEditor.on('blur', (function(_this) {
        return function() {
          return _this.close();
        };
      })(this));
      return this.miniEditor.getModel().onDidChange((function(_this) {
        return function() {
          return _this.showError();
        };
      })(this));
    };

    Dialog.prototype.attach = function(onSuccess) {
      this.panel = atom.workspace.addModalPanel({
        item: this.element
      });
      this.miniEditor.focus();
      return this.miniEditor.getModel().scrollToCursorPosition();
    };

    Dialog.prototype.close = function() {
      var panelToDestroy;
      panelToDestroy = this.panel;
      this.panel = null;
      if (panelToDestroy != null) {
        panelToDestroy.destroy();
      }
      return atom.workspace.getActivePane().activate();
    };

    Dialog.prototype.cancel = function() {
      this.close();
      return $('.tree-view').focus();
    };

    Dialog.prototype.showError = function(message) {
      if (message == null) {
        message = '';
      }
      this.errorMessage.text(message);
      if (message) {
        return this.flashError();
      }
    };

    return Dialog;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbG9pYy8uYXRvbS9wYWNrYWdlcy9lcGl0ZWNoLWhlYWRlcnMvbGliL2RpYWxvZy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscUNBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQTRCLE9BQUEsQ0FBUSxzQkFBUixDQUE1QixFQUFDLFNBQUEsQ0FBRCxFQUFJLHNCQUFBLGNBQUosRUFBb0IsWUFBQSxJQUFwQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDZCQUFBLENBQUE7O0FBQWEsSUFBQSxnQkFBQyxJQUFELEdBQUE7QUFDWCxVQUFBLDhCQUFBO0FBQUEsNkJBRFksT0FBNEIsSUFBM0IsZUFBQSxRQUFRLGFBQUEsTUFBTSxrQkFBQSxTQUMzQixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLE1BQVYsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLElBQUQsR0FBUSxJQURSLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxTQUFELEdBQWEsU0FGYixDQUFBO0FBQUEsTUFHQSx5Q0FBQSxTQUFBLENBSEEsQ0FEVztJQUFBLENBQWI7O0FBQUEsSUFNQSxNQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxrQkFBUDtPQUFMLEVBQWdDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDOUIsVUFBQSxLQUFDLENBQUEsS0FBRCxDQUFPLHFCQUFQLEVBQThCO0FBQUEsWUFBQSxPQUFBLEVBQU8sTUFBUDtBQUFBLFlBQWUsTUFBQSxFQUFRLFlBQXZCO1dBQTlCLENBQUEsQ0FBQTtBQUFBLFVBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxZQUFULEVBQTJCLElBQUEsY0FB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

//# sourceURL=/home/loic/.atom/packages/epitech-headers/lib/dialog.coffee
