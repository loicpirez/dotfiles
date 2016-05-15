(function() {
  var AutocompleteRuby;

  AutocompleteRuby = require('../lib/autocomplete-ruby');

  describe("AutocompleteRuby", function() {
    var activationPromise, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('autocomplete-ruby');
    });
    return describe("autocomplete-ruby", function() {
      return it("contains spec with an expectation", function() {
        return expect(true).toBe(true);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbG9pYy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcnVieS9zcGVjL2F1dG9jb21wbGV0ZS1ydWJ5LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdCQUFBOztBQUFBLEVBQUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLDBCQUFSLENBQW5CLENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLFFBQUEseUNBQUE7QUFBQSxJQUFBLE9BQXdDLEVBQXhDLEVBQUMsMEJBQUQsRUFBbUIsMkJBQW5CLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBbkIsQ0FBQTthQUNBLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixtQkFBOUIsRUFGWDtJQUFBLENBQVgsQ0FGQSxDQUFBO1dBTUEsUUFBQSxDQUFTLG1CQUFULEVBQThCLFNBQUEsR0FBQTthQUM1QixFQUFBLENBQUcsbUNBQUgsRUFBd0MsU0FBQSxHQUFBO2VBQ3RDLE1BQUEsQ0FBTyxJQUFQLENBQVksQ0FBQyxJQUFiLENBQWtCLElBQWxCLEVBRHNDO01BQUEsQ0FBeEMsRUFENEI7SUFBQSxDQUE5QixFQVAyQjtFQUFBLENBQTdCLENBRkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/loic/.atom/packages/autocomplete-ruby/spec/autocomplete-ruby-spec.coffee
