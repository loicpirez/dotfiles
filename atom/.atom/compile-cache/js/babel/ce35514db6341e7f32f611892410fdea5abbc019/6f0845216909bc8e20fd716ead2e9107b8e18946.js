function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libSuperVala = require('../lib/super-vala');

var _libSuperVala2 = _interopRequireDefault(_libSuperVala);

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

'use babel';

describe('SuperVala', function () {
  var workspaceElement = undefined,
      activationPromise = undefined;

  beforeEach(function () {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('super-vala');
  });

  describe('when the super-vala:toggle event is triggered', function () {
    it('hides and shows the modal panel', function () {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.super-vala')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'super-vala:toggle');

      waitsForPromise(function () {
        return activationPromise;
      });

      runs(function () {
        expect(workspaceElement.querySelector('.super-vala')).toExist();

        var superValaElement = workspaceElement.querySelector('.super-vala');
        expect(superValaElement).toExist();

        var superValaPanel = atom.workspace.panelForItem(superValaElement);
        expect(superValaPanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'super-vala:toggle');
        expect(superValaPanel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', function () {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.super-vala')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'super-vala:toggle');

      waitsForPromise(function () {
        return activationPromise;
      });

      runs(function () {
        // Now we can test for view visibility
        var superValaElement = workspaceElement.querySelector('.super-vala');
        expect(superValaElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'super-vala:toggle');
        expect(superValaElement).not.toBeVisible();
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2xvaWMvLmF0b20vcGFja2FnZXMvc3VwZXItdmFsYS9zcGVjL3N1cGVyLXZhbGEtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs0QkFFc0IsbUJBQW1COzs7Ozs7Ozs7QUFGekMsV0FBVyxDQUFDOztBQVNaLFFBQVEsQ0FBQyxXQUFXLEVBQUUsWUFBTTtBQUMxQixNQUFJLGdCQUFnQixZQUFBO01BQUUsaUJBQWlCLFlBQUEsQ0FBQzs7QUFFeEMsWUFBVSxDQUFDLFlBQU07QUFDZixvQkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdEQscUJBQWlCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUM7R0FDakUsQ0FBQyxDQUFDOztBQUVILFVBQVEsQ0FBQywrQ0FBK0MsRUFBRSxZQUFNO0FBQzlELE1BQUUsQ0FBQyxpQ0FBaUMsRUFBRSxZQUFNOzs7QUFHMUMsWUFBTSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7OztBQUlwRSxVQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDOztBQUU5RCxxQkFBZSxDQUFDLFlBQU07QUFDcEIsZUFBTyxpQkFBaUIsQ0FBQztPQUMxQixDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLFlBQU07QUFDVCxjQUFNLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7O0FBRWhFLFlBQUksZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3JFLGNBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUVuQyxZQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ25FLGNBQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUMsWUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztBQUM5RCxjQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQ2hELENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsMEJBQTBCLEVBQUUsWUFBTTs7Ozs7OztBQU9uQyxhQUFPLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7O0FBRXRDLFlBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7Ozs7QUFJcEUsVUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsbUJBQW1CLENBQUMsQ0FBQzs7QUFFOUQscUJBQWUsQ0FBQyxZQUFNO0FBQ3BCLGVBQU8saUJBQWlCLENBQUM7T0FDMUIsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxZQUFNOztBQUVULFlBQUksZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3JFLGNBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ3ZDLFlBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLG1CQUFtQixDQUFDLENBQUM7QUFDOUQsY0FBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO09BQzVDLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS9sb2ljLy5hdG9tL3BhY2thZ2VzL3N1cGVyLXZhbGEvc3BlYy9zdXBlci12YWxhLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IFN1cGVyVmFsYSBmcm9tICcuLi9saWIvc3VwZXItdmFsYSc7XG5cbi8vIFVzZSB0aGUgY29tbWFuZCBgd2luZG93OnJ1bi1wYWNrYWdlLXNwZWNzYCAoY21kLWFsdC1jdHJsLXApIHRvIHJ1biBzcGVjcy5cbi8vXG4vLyBUbyBydW4gYSBzcGVjaWZpYyBgaXRgIG9yIGBkZXNjcmliZWAgYmxvY2sgYWRkIGFuIGBmYCB0byB0aGUgZnJvbnQgKGUuZy4gYGZpdGBcbi8vIG9yIGBmZGVzY3JpYmVgKS4gUmVtb3ZlIHRoZSBgZmAgdG8gdW5mb2N1cyB0aGUgYmxvY2suXG5cbmRlc2NyaWJlKCdTdXBlclZhbGEnLCAoKSA9PiB7XG4gIGxldCB3b3Jrc3BhY2VFbGVtZW50LCBhY3RpdmF0aW9uUHJvbWlzZTtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB3b3Jrc3BhY2VFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKTtcbiAgICBhY3RpdmF0aW9uUHJvbWlzZSA9IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdzdXBlci12YWxhJyk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aGVuIHRoZSBzdXBlci12YWxhOnRvZ2dsZSBldmVudCBpcyB0cmlnZ2VyZWQnLCAoKSA9PiB7XG4gICAgaXQoJ2hpZGVzIGFuZCBzaG93cyB0aGUgbW9kYWwgcGFuZWwnLCAoKSA9PiB7XG4gICAgICAvLyBCZWZvcmUgdGhlIGFjdGl2YXRpb24gZXZlbnQgdGhlIHZpZXcgaXMgbm90IG9uIHRoZSBET00sIGFuZCBubyBwYW5lbFxuICAgICAgLy8gaGFzIGJlZW4gY3JlYXRlZFxuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLnN1cGVyLXZhbGEnKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgLy8gVGhpcyBpcyBhbiBhY3RpdmF0aW9uIGV2ZW50LCB0cmlnZ2VyaW5nIGl0IHdpbGwgY2F1c2UgdGhlIHBhY2thZ2UgdG8gYmVcbiAgICAgIC8vIGFjdGl2YXRlZC5cbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ3N1cGVyLXZhbGE6dG9nZ2xlJyk7XG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBhY3RpdmF0aW9uUHJvbWlzZTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLnN1cGVyLXZhbGEnKSkudG9FeGlzdCgpO1xuXG4gICAgICAgIGxldCBzdXBlclZhbGFFbGVtZW50ID0gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc3VwZXItdmFsYScpO1xuICAgICAgICBleHBlY3Qoc3VwZXJWYWxhRWxlbWVudCkudG9FeGlzdCgpO1xuXG4gICAgICAgIGxldCBzdXBlclZhbGFQYW5lbCA9IGF0b20ud29ya3NwYWNlLnBhbmVsRm9ySXRlbShzdXBlclZhbGFFbGVtZW50KTtcbiAgICAgICAgZXhwZWN0KHN1cGVyVmFsYVBhbmVsLmlzVmlzaWJsZSgpKS50b0JlKHRydWUpO1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdzdXBlci12YWxhOnRvZ2dsZScpO1xuICAgICAgICBleHBlY3Qoc3VwZXJWYWxhUGFuZWwuaXNWaXNpYmxlKCkpLnRvQmUoZmFsc2UpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnaGlkZXMgYW5kIHNob3dzIHRoZSB2aWV3JywgKCkgPT4ge1xuICAgICAgLy8gVGhpcyB0ZXN0IHNob3dzIHlvdSBhbiBpbnRlZ3JhdGlvbiB0ZXN0IHRlc3RpbmcgYXQgdGhlIHZpZXcgbGV2ZWwuXG5cbiAgICAgIC8vIEF0dGFjaGluZyB0aGUgd29ya3NwYWNlRWxlbWVudCB0byB0aGUgRE9NIGlzIHJlcXVpcmVkIHRvIGFsbG93IHRoZVxuICAgICAgLy8gYHRvQmVWaXNpYmxlKClgIG1hdGNoZXJzIHRvIHdvcmsuIEFueXRoaW5nIHRlc3RpbmcgdmlzaWJpbGl0eSBvciBmb2N1c1xuICAgICAgLy8gcmVxdWlyZXMgdGhhdCB0aGUgd29ya3NwYWNlRWxlbWVudCBpcyBvbiB0aGUgRE9NLiBUZXN0cyB0aGF0IGF0dGFjaCB0aGVcbiAgICAgIC8vIHdvcmtzcGFjZUVsZW1lbnQgdG8gdGhlIERPTSBhcmUgZ2VuZXJhbGx5IHNsb3dlciB0aGFuIHRob3NlIG9mZiBET00uXG4gICAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHdvcmtzcGFjZUVsZW1lbnQpO1xuXG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc3VwZXItdmFsYScpKS5ub3QudG9FeGlzdCgpO1xuXG4gICAgICAvLyBUaGlzIGlzIGFuIGFjdGl2YXRpb24gZXZlbnQsIHRyaWdnZXJpbmcgaXQgY2F1c2VzIHRoZSBwYWNrYWdlIHRvIGJlXG4gICAgICAvLyBhY3RpdmF0ZWQuXG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdzdXBlci12YWxhOnRvZ2dsZScpO1xuXG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICByZXR1cm4gYWN0aXZhdGlvblByb21pc2U7XG4gICAgICB9KTtcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIC8vIE5vdyB3ZSBjYW4gdGVzdCBmb3IgdmlldyB2aXNpYmlsaXR5XG4gICAgICAgIGxldCBzdXBlclZhbGFFbGVtZW50ID0gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc3VwZXItdmFsYScpO1xuICAgICAgICBleHBlY3Qoc3VwZXJWYWxhRWxlbWVudCkudG9CZVZpc2libGUoKTtcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnc3VwZXItdmFsYTp0b2dnbGUnKTtcbiAgICAgICAgZXhwZWN0KHN1cGVyVmFsYUVsZW1lbnQpLm5vdC50b0JlVmlzaWJsZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=
//# sourceURL=/home/loic/.atom/packages/super-vala/spec/super-vala-spec.js
