(function() {
  var LinterProvider, child_process, fs, path,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  child_process = require('child_process');

  path = require('path');

  fs = require('fs');

  module.exports = LinterProvider = (function() {
    var getCommand, lintFile, lintOnFly, lintOnSave;

    function LinterProvider() {
      this.lint = __bind(this.lint, this);
    }

    getCommand = function(textEditor, fileName) {
      var cmd;
      cmd = atom.config.get('epitech-norm-linter.a_pythonPath');
      cmd += " ../norminette/norm.py -libc";
      cmd += " " + fileName;
      cmd += " -nocheat -malloc";
      if (!atom.config.get('epitech-norm-linter.c_verifyComment')) {
        cmd += " -comment";
      }
      if (atom.config.get('epitech-norm-linter.e_verifyLibc')) {
        cmd += " -libc";
      }
      if (atom.config.get('epitech-norm-linter.f_showDebug')) {
        console.log("Epitech-norm-linter: " + cmd);
      }
      return cmd;
    };

    lintFile = function(textEditor, fileName) {
      return new Promise(function(resolve) {
        var cmd, data, process;
        data = '';
        cmd = getCommand(textEditor, fileName);
        process = child_process.exec(cmd, {
          cwd: __dirname
        });
        process.stdout.on('data', function(d) {
          return data = d.toString();
        });
        return process.on('close', function() {
          var error, line, linenb, toReturn, _i, _len, _ref;
          toReturn = [];
          if (atom.config.get('epitech-norm-linter.f_showDebug')) {
            console.log("Output norminette: " + data);
          }
          _ref = data.split('\n');
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            line = _ref[_i];
            if (line.match(/^Erreur/i)) {
              linenb = (line.split(' ')[6]).split(':')[0];
              error = (line.split(':')[1]).split("=>")[0];
              toReturn.push({
                type: "Norme",
                text: "Faute de norme à la ligne " + linenb + " : " + error,
                range: [[parseInt(linenb, 10) - 1, 0], [parseInt(linenb, 10) - 1, 1000000]],
                filePath: textEditor.getPath()
              });
            }
          }
          return resolve(toReturn);
        });
      });
    };

    lintOnFly = function(textEditor) {
      path = __dirname + "/../norminette/tempNormLinter.c";
      fs.writeFile(path, textEditor.getText().toString(), function(err) {
        if (err) {
          throw err;
        }
      });
      if (atom.config.get('epitech-norm-linter.f_showDebug')) {
        console.log("File saved ! Path: " + path);
      }
      return lintFile(textEditor, path);
    };

    lintOnSave = function(textEditor) {
      return lintFile(textEditor, textEditor.getPath());
    };

    LinterProvider.prototype.lint = function(textEditor) {
      if (atom.config.get('epitech-norm-linter.b_lintOnFly')) {
        return lintOnFly(textEditor);
      } else {
        return lintOnSave(textEditor);
      }
    };

    return LinterProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbG9pYy8uYXRvbS9wYWNrYWdlcy9lcGl0ZWNoLW5vcm0tbGludGVyL2xpYi9wcm92aWRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUNBQUE7SUFBQSxrRkFBQTs7QUFBQSxFQUFBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGVBQVIsQ0FBaEIsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFFckIsUUFBQSwyQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsVUFBQSxHQUFhLFNBQUMsVUFBRCxFQUFhLFFBQWIsR0FBQTtBQUNYLFVBQUEsR0FBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixrQ0FBaEIsQ0FBTixDQUFBO0FBQUEsTUFDQSxHQUFBLElBQU8sOEJBRFAsQ0FBQTtBQUFBLE1BRUEsR0FBQSxJQUFPLEdBQUEsR0FBTSxRQUZiLENBQUE7QUFBQSxNQUdBLEdBQUEsSUFBTyxtQkFIUCxDQUFBO0FBSUEsTUFBQSxJQUFJLENBQUEsSUFBSyxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHFDQUFoQixDQUFMO0FBQ0UsUUFBQSxHQUFBLElBQU8sV0FBUCxDQURGO09BSkE7QUFNQSxNQUFBLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGtDQUFoQixDQUFKO0FBQ0UsUUFBQSxHQUFBLElBQU8sUUFBUCxDQURGO09BTkE7QUFRQSxNQUFBLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlDQUFoQixDQUFKO0FBQ0UsUUFBQSxPQUFPLENB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

//# sourceURL=/home/loic/.atom/packages/epitech-norm-linter/lib/provider.coffee
