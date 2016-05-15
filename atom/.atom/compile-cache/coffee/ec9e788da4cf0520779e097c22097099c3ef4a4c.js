(function() {
  var EpitechNormLinter;

  module.exports = EpitechNormLinter = {
    config: {
      a_pythonPath: {
        title: 'Python Executable Path',
        type: 'string',
        description: 'Path to Python. Edit this only if Epitech-norm-linter doesn\'t work by default. If so, use another version of Python.\n\nEg: Python2, Python3.3, Python3.4, Python3.5 etc...',
        "default": 'python3'
      },
      b_lintOnFly: {
        title: 'Lint on fly',
        description: 'When enabled, lints your code while typing. When disabled, lints your code while saving.',
        type: 'boolean',
        "default": true
      },
      c_verifyComment: {
        title: 'Enable comments verification',
        description: 'Counts comments as a norm error, and displays a message.',
        type: 'boolean',
        "default": true
      },
      e_verifyLibc: {
        title: 'Verify libc functions',
        description: 'Will search for some libc forbidden functions.\n\nThe fobidden functions are: printf, atof, atoi, atol, strcmp, strlen, strcat, strncat, strncmp, strcpy, strncpy, fprintf, strstr, strtoc, sprintf, asprintf, perror, strtod, strtol, strtoul.',
        type: 'boolean',
        "default": true
      },
      f_showDebug: {
        title: 'Print logs on console',
        description: 'Enable this only if you\'re having an issue and want to help the developer solve it.',
        type: 'boolean',
        "default": false
      }
    },
    activate: function() {
      return require('atom-package-deps').install('epitech-norm-linter');
    },
    provideLinter: function() {
      var LinterProvider;
      LinterProvider = require('./provider');
      this.provider = new LinterProvider();
      return {
        grammarScopes: ['source.c'],
        scope: 'file',
        lint: this.provider.lint,
        lintOnFly: true
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbG9pYy8uYXRvbS9wYWNrYWdlcy9lcGl0ZWNoLW5vcm0tbGludGVyL2xpYi9lcGl0ZWNoLW5vcm0tbGludGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpQkFBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGlCQUFBLEdBQ2Y7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsWUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sd0JBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsUUFFQSxXQUFBLEVBQWEsOEtBRmI7QUFBQSxRQUdBLFNBQUEsRUFBUyxTQUhUO09BREY7QUFBQSxNQUtBLFdBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLGFBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSwwRkFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxJQUhUO09BTkY7QUFBQSxNQVVBLGVBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLDhCQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsMERBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsSUFIVDtPQVhGO0FBQUEsTUFlQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyx1QkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLGlQQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLElBSFQ7T0FoQkY7QUFBQSxNQW9CQSxXQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyx1QkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLHNGQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLEtBSFQ7T0FyQkY7S0FERjtBQUFBLElBMkJBLFFBQUEsRUFBVSxTQUFBLEdBQUE7YUFDUixPQUFBLENBQVEsbUJBQVIsQ0FBNEIsQ0FBQyxPQUE3QixDQUFxQyxxQkFBckMsRUFEUTtJQUFBLENBM0JWO0FBQUEsSUE4QkEsYUFBQSxFQUFlLFNBQUEsR0FBQTtBQUNiLFVBQUEsY0FBQTtBQUFBLE1BQUEsY0FBQSxHQUFpQixPQUFBLENBQVEsWUFBUixDQUFqQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsUUFBRCxHQUFnQixJQUFBLGNBQUEsQ0FBQSxDQURoQixDQUFBO0FBRUEsYUFBTztBQUFBLFFBQ0wsYUFBQSxFQUFlLENBQUMsVUFBRCxDQURWO0FBQUEsUUFFTCxLQUFBLEVBQU8sTUFGRjtBQUFBLFFBR0wsSUFBQSxFQUFNLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFIWDtBQUFBLFFBSUwsU0FBQSxFQUFXLElBSk47T0FBUCxDQUhhO0lBQUEsQ0E5QmY7R0FERixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/loic/.atom/packages/epitech-norm-linter/lib/epitech-norm-linter.coffee
