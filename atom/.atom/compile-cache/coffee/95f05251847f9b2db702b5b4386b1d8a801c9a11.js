(function() {
  describe('Indie', function() {
    var Indie, Validate, indie;
    Validate = require('../lib/validate');
    Indie = require('../lib/indie');
    indie = null;
    beforeEach(function() {
      if (indie != null) {
        indie.dispose();
      }
      return indie = new Indie({});
    });
    describe('Validations', function() {
      return it('just cares about a name', function() {
        var linter;
        linter = {};
        Validate.linter(linter, true);
        expect(linter.name).toBe(null);
        linter.name = 'a';
        Validate.linter(linter, true);
        expect(linter.name).toBe('a');
        linter.name = 2;
        return expect(function() {
          return Validate.linter(linter, true);
        }).toThrow();
      });
    });
    describe('constructor', function() {
      return it('sets a scope for message registry to know', function() {
        return expect(indie.scope).toBe('project');
      });
    });
    describe('{set, delete}Messages', function() {
      return it('notifies the event listeners of the change', function() {
        var listener, messages;
        listener = jasmine.createSpy('indie.listener');
        messages = [{}];
        indie.onDidUpdateMessages(listener);
        indie.setMessages(messages);
        expect(listener).toHaveBeenCalled();
        expect(listener.calls.length).toBe(1);
        expect(listener).toHaveBeenCalledWith(messages);
        indie.deleteMessages();
        expect(listener.calls.length).toBe(2);
        expect(listener.mostRecentCall.args[0] instanceof Array);
        return expect(listener.mostRecentCall.args[0].length).toBe(0);
      });
    });
    return describe('dispose', function() {
      return it('triggers the onDidDestroy event', function() {
        var listener;
        listener = jasmine.createSpy('indie.destroy');
        indie.onDidDestroy(listener);
        indie.dispose();
        return expect(listener).toHaveBeenCalled();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbG9pYy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvc3BlYy9pbmRpZS1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxRQUFBLENBQVMsT0FBVCxFQUFrQixTQUFBLEdBQUE7QUFDaEIsUUFBQSxzQkFBQTtBQUFBLElBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxpQkFBUixDQUFYLENBQUE7QUFBQSxJQUNBLEtBQUEsR0FBUSxPQUFBLENBQVEsY0FBUixDQURSLENBQUE7QUFBQSxJQUVBLEtBQUEsR0FBUSxJQUZSLENBQUE7QUFBQSxJQUlBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7O1FBQ1QsS0FBSyxDQUFFLE9BQVAsQ0FBQTtPQUFBO2FBQ0EsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFNLEVBQU4sRUFGSDtJQUFBLENBQVgsQ0FKQSxDQUFBO0FBQUEsSUFRQSxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBLEdBQUE7YUFDdEIsRUFBQSxDQUFHLHlCQUFILEVBQThCLFNBQUEsR0FBQTtBQUM1QixZQUFBLE1BQUE7QUFBQSxRQUFBLE1BQUEsR0FBUyxFQUFULENBQUE7QUFBQSxRQUNBLFFBQVEsQ0FBQyxNQUFULENBQWdCLE1BQWhCLEVBQXdCLElBQXhCLENBREEsQ0FBQTtBQUFBLFFBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxJQUFkLENBQW1CLENBQUMsSUFBcEIsQ0FBeUIsSUFBekIsQ0FGQSxDQUFBO0FBQUEsUUFHQSxNQUFNLENBQUMsSUFBUCxHQUFjLEdBSGQsQ0FBQTtBQUFBLFFBSUEsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsTUFBaEIsRUFBd0IsSUFBeEIsQ0FKQSxDQUFBO0FBQUEsUUFLQSxNQUFBLENBQU8sTUFBTSxDQUFDLElBQWQsQ0FBbUIsQ0FBQyxJQUFwQixDQUF5QixHQUF6QixDQUxBLENBQUE7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

//# sourceURL=/home/loic/.atom/packages/linter/spec/indie-spec.coffee
