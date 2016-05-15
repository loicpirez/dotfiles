(function() {
  var RsenseClient, RsenseProvider;

  RsenseClient = require('./autocomplete-ruby-client.coffee');

  String.prototype.regExpEscape = function() {
    return this.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  };

  module.exports = RsenseProvider = (function() {
    RsenseProvider.prototype.id = 'autocomplete-ruby-rubyprovider';

    RsenseProvider.prototype.selector = '.source.ruby';

    RsenseProvider.prototype.rsenseClient = null;

    function RsenseProvider() {
      this.rsenseClient = new RsenseClient();
      this.lastSuggestions = [];
    }

    RsenseProvider.prototype.requestHandler = function(options) {
      return new Promise((function(_this) {
        return function(resolve) {
          var col, completions, row;
          row = options.cursor.getBufferRow() + 1;
          col = options.cursor.getBufferColumn() + 1;
          return completions = _this.rsenseClient.checkCompletion(options.editor, options.buffer, row, col, function(completions) {
            var suggestions;
            suggestions = _this.findSuggestions(options.prefix, completions);
            if ((suggestions != null ? suggestions.length : void 0)) {
              _this.lastSuggestions = suggestions;
            }
            if (options.prefix === '.' || options.prefix === '::') {
              return resolve(_this.lastSuggestions);
            }
            return resolve(_this.filterSuggestions(options.prefix, _this.lastSuggestions));
          });
        };
      })(this));
    };

    RsenseProvider.prototype.findSuggestions = function(prefix, completions) {
      var completion, kind, suggestion, suggestions, _i, _len;
      if (completions != null) {
        suggestions = [];
        for (_i = 0, _len = completions.length; _i < _len; _i++) {
          completion = completions[_i];
          kind = completion.kind.toLowerCase();
          suggestion = {
            word: completion.name,
            prefix: prefix,
            label: "" + kind + " (" + completion.qualified_name + ")"
          };
          suggestions.push(suggestion);
        }
        return suggestions;
      }
      return [];
    };

    RsenseProvider.prototype.filterSuggestions = function(prefix, suggestions) {
      var expression, suggestion, suggestionBuffer, _i, _len;
      suggestionBuffer = [];
      if (!(prefix != null ? prefix.length : void 0) || !(suggestions != null ? suggestions.length : void 0)) {
        return [];
      }
      expression = new RegExp("^" + prefix.regExpEscape(), "i");
      for (_i = 0, _len = suggestions.length; _i < _len; _i++) {
        suggestion = suggestions[_i];
        if (expression.test(suggestion.word)) {
          suggestion.prefix = prefix;
          suggestionBuffer.push(suggestion);
        }
      }
      return suggestionBuffer;
    };

    RsenseProvider.prototype.dispose = function() {};

    return RsenseProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbG9pYy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcnVieS9saWIvYXV0b2NvbXBsZXRlLXJ1YnktcHJvdmlkZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRCQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxtQ0FBUixDQUFmLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsU0FBUyxDQUFDLFlBQWpCLEdBQWdDLFNBQUEsR0FBQTtBQUM5QixXQUFPLElBQUMsQ0FBQSxPQUFELENBQVMscUNBQVQsRUFBZ0QsTUFBaEQsQ0FBUCxDQUQ4QjtFQUFBLENBRmhDLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osNkJBQUEsRUFBQSxHQUFJLGdDQUFKLENBQUE7O0FBQUEsNkJBQ0EsUUFBQSxHQUFVLGNBRFYsQ0FBQTs7QUFBQSw2QkFFQSxZQUFBLEdBQWMsSUFGZCxDQUFBOztBQUlhLElBQUEsd0JBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLFlBQUQsR0FBb0IsSUFBQSxZQUFBLENBQUEsQ0FBcEIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGVBQUQsR0FBbUIsRUFEbkIsQ0FEVztJQUFBLENBSmI7O0FBQUEsNkJBUUEsY0FBQSxHQUFnQixTQUFDLE9BQUQsR0FBQTtBQUNkLGFBQVcsSUFBQSxPQUFBLENBQVEsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsT0FBRCxHQUFBO0FBRWpCLGNBQUEscUJBQUE7QUFBQSxVQUFBLEdBQUEsR0FBTSxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQWYsQ0FBQSxDQUFBLEdBQWdDLENBQXRDLENBQUE7QUFBQSxVQUNBLEdBQUEsR0FBTSxPQUFPLENBQUMsTUFBTSxDQUFDLGVBQWYsQ0FBQSxDQUFBLEdBQW1DLENB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

//# sourceURL=/home/loic/.atom/packages/autocomplete-ruby/lib/autocomplete-ruby-provider.coffee
