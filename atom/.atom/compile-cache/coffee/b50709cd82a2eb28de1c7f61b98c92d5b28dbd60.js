(function() {
  var ActivatePowerMode, CompositeDisposable, configSchema, random, throttle;

  throttle = require("lodash.throttle");

  random = require("lodash.random");

  CompositeDisposable = require("atom").CompositeDisposable;

  configSchema = require("./config-schema");

  module.exports = ActivatePowerMode = {
    config: configSchema,
    subscriptions: null,
    active: false,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add("atom-workspace", {
        "activate-power-mode:toggle": (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      }));
      this.activeItemSubscription = atom.workspace.onDidStopChangingActivePaneItem((function(_this) {
        return function() {
          return _this.subscribeToActiveTextEditor();
        };
      })(this));
      if (this.getConfig("autoToggle")) {
        return this.toggle();
      }
    },
    deactivate: function() {
      var _ref, _ref1, _ref2, _ref3;
      if ((_ref = this.editorChangeSubscription) != null) {
        _ref.dispose();
      }
      if ((_ref1 = this.activeItemSubscription) != null) {
        _ref1.dispose();
      }
      if ((_ref2 = this.subscriptions) != null) {
        _ref2.dispose();
      }
      this.subscriptions = null;
      this.active = false;
      if ((_ref3 = this.canvas) != null) {
        _ref3.parentNode.removeChild(this.canvas);
      }
      return this.canvas = null;
    },
    getConfig: function(config) {
      return atom.config.get("activate-power-mode." + config);
    },
    subscribeToActiveTextEditor: function() {
      var _ref;
      this.throttledShake = throttle(this.shake.bind(this), 100, {
        trailing: false
      });
      this.throttledSpawnParticles = throttle(this.spawnParticles.bind(this), 25, {
        trailing: false
      });
      this.editor = atom.workspace.getActiveTextEditor();
      if (!this.editor) {
        return;
      }
      this.editorElement = atom.views.getView(this.editor);
      this.editorElement.classList.add("power-mode");
      if ((_ref = this.editorChangeSubscription) != null) {
        _ref.dispose();
      }
      this.editorChangeSubscription = this.editor.getBuffer().onDidChange(this.onChange.bind(this));
      if (!this.canvas) {
        this.setupCanvas();
      }
      this.editorElement.parentNode.appendChild(this.canvas);
      return this.canvas.style.display = "block";
    },
    setupCanvas: function() {
      this.canvas = document.createElement("canvas");
      this.context = this.canvas.getContext("2d");
      return this.canvas.classList.add("power-mode-canvas");
    },
    calculateCursorOffset: function() {
      var editorRect, scrollViewRect;
      editorRect = this.editorElement.getBoundingClientRect();
      scrollViewRect = this.editorElement.shadowRoot.querySelector(".scroll-view").getBoundingClientRect();
      return {
        top: scrollViewRect.top - editorRect.top + this.editor.getLineHeightInPixels() / 2,
        left: scrollViewRect.left - editorRect.left
      };
    },
    onChange: function(e) {
      var range, spawnParticles;
      if (!this.active) {
        return;
      }
      spawnParticles = true;
      if (e.newText) {
        spawnParticles = e.newText !== "\n";
        range = e.newRange.end;
      } else {
        range = e.newRange.start;
      }
      if (spawnParticles && this.getConfig("particles.enabled")) {
        this.throttledSpawnParticles(range);
      }
      if (this.getConfig("screenShake.enabled")) {
        return this.throttledShake();
      }
    },
    shake: function() {
      var max, min, x, y;
      min = this.getConfig("screenShake.minIntensity");
      max = this.getConfig("screenShake.maxIntensity");
      x = this.shakeIntensity(min, max);
      y = this.shakeIntensity(min, max);
      this.editorElement.style.top = "" + y + "px";
      this.editorElement.style.left = "" + x + "px";
      return setTimeout((function(_this) {
        return function() {
          _this.editorElement.style.top = "";
          return _this.editorElement.style.left = "";
        };
      })(this), 75);
    },
    shakeIntensity: function(min, max) {
      var direction;
      direction = Math.random() > 0.5 ? -1 : 1;
      return random(min, max, true) * direction;
    },
    spawnParticles: function(range) {
      var color, cursorOffset, left, numParticles, screenPosition, top, _ref, _results;
      screenPosition = this.editor.screenPositionForBufferPosition(range);
      cursorOffset = this.calculateCursorOffset();
      _ref = this.editorElement.pixelPositionForScreenPosition(screenPosition), left = _ref.left, top = _ref.top;
      left += cursorOffset.left - this.editorElement.getScrollLeft();
      top += cursorOffset.top - this.editorElement.getScrollTop();
      color = this.getColorAtPosition(left, top);
      numParticles = random(this.getConfig("particles.spawnCount.min"), this.getConfig("particles.spawnCount.max"));
      _results = [];
      while (numParticles--) {
        this.particles[this.particlePointer] = this.createParticle(left, top, color);
        _results.push(this.particlePointer = (this.particlePointer + 1) % this.getConfig("particles.totalCount.max"));
      }
      return _results;
    },
    getColorAtPosition: function(left, top) {
      var el, offset;
      offset = this.editorElement.getBoundingClientRect();
      el = atom.views.getView(this.editor).shadowRoot.elementFromPoint(left + offset.left, top + offset.top);
      if (el) {
        return getComputedStyle(el).color;
      } else {
        return "rgb(255, 255, 255)";
      }
    },
    createParticle: function(x, y, color) {
      return {
        x: x,
        y: y,
        alpha: 1,
        color: color,
        velocity: {
          x: -1 + Math.random() * 2,
          y: -3.5 + Math.random() * 2
        }
      };
    },
    drawParticles: function() {
      var gco, particle, size, _i, _len, _ref;
      if (this.active) {
        requestAnimationFrame(this.drawParticles.bind(this));
      }
      if (!this.canvas) {
        return;
      }
      this.canvas.width = this.editorElement.offsetWidth;
      this.canvas.height = this.editorElement.offsetHeight;
      gco = this.context.globalCompositeOperation;
      this.context.globalCompositeOperation = "lighter";
      _ref = this.particles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        particle = _ref[_i];
        if (particle.alpha <= 0.1) {
          continue;
        }
        particle.velocity.y += 0.075;
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;
        particle.alpha *= 0.96;
        this.context.fillStyle = "rgba(" + particle.color.slice(4, -1) + ", " + particle.alpha + ")";
        size = random(this.getConfig("particles.size.min"), this.getConfig("particles.size.max"), true);
        this.context.fillRect(Math.round(particle.x - size / 2), Math.round(particle.y - size / 2), size, size);
      }
      return this.context.globalCompositeOperation = gco;
    },
    toggle: function() {
      this.active = !this.active;
      this.particlePointer = 0;
      this.particles = [];
      return requestAnimationFrame(this.drawParticles.bind(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbG9pYy8uYXRvbS9wYWNrYWdlcy9hY3RpdmF0ZS1wb3dlci1tb2RlL2xpYi9hY3RpdmF0ZS1wb3dlci1tb2RlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzRUFBQTs7QUFBQSxFQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsaUJBQVIsQ0FBWCxDQUFBOztBQUFBLEVBQ0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxlQUFSLENBRFQsQ0FBQTs7QUFBQSxFQUdDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFIRCxDQUFBOztBQUFBLEVBS0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQUxmLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUFpQixpQkFBQSxHQUNmO0FBQUEsSUFBQSxNQUFBLEVBQVEsWUFBUjtBQUFBLElBQ0EsYUFBQSxFQUFlLElBRGY7QUFBQSxJQUVBLE1BQUEsRUFBUSxLQUZSO0FBQUEsSUFJQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDakI7QUFBQSxRQUFBLDRCQUFBLEVBQThCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxNQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlCO09BRGlCLENBQW5CLENBREEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLHNCQUFELEdBQTBCLElBQUksQ0FBQyxTQUFTLENBQUMsK0JBQWYsQ0FBK0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDdkUsS0FBQyxDQUFBLDJCQUFELENBQUEsRUFEdUU7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvQyxDQUoxQixDQUFBO0FBT0EsTUFBQSxJQUFHLElBQUMsQ0FBQSxTQUFELENBQVcsWUFBWCxDQUFIO2VBQ0UsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQURGO09BUlE7SUFBQSxDQUpWO0FBQUEsSUFlQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSx5QkFBQTs7WUFBeUIsQ0FBRSxPQUEzQixDQUFBO09BQUE7O2FBQ3VCLENBQUUsT0FBekIsQ0FBQTtPQURBOzthQUVjLENBQUUsT0FBaEIsQ0FBQTtPQUZBO0FBQUEsTUFHQSxJQUFDLENBQUEsYUFBRCxHQUFpQixJQUhqQixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsTUFBRCxHQUFVLEtBSlYsQ0FBQTs7YUFLTyxDQUFFLFVBQVUsQ0FBQyxXQUFwQixDQUFnQyxJQUFDLENBQUEsTUFBakM7T0FMQTthQU1BLElBQUMsQ0FBQSxNQUFELEdBQVUsS0FQQTtJQUFBLENBZlo7QUFBQSxJQXdCQSxTQUFBLEVBQVcsU0FBQyxNQUFELEdBQUE7YUFDVCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBaUIsc0JBQUEsR0FBc0IsTUFBdkMsRUFEUztJQUFBLENBeEJYO0FBQUEsSUEyQkEsMkJBQUEsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGNBQUQsR0FBa0IsUUFBQSxDQUFTLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFZLElBQVosQ0FBVCxFQUE0QixHQUE1QixFQUFpQztBQUFBLFFBQUEsUUFBQSxFQUFVLEtBQVY7T0FBakMsQ0FBbEIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLHVCQUFELEdBQTJCLFFBQUEsQ0FBUyxJQUFDLENBQUEsY0FBYyxDQUFDLElBQWhCLENBQXFCLElBQXJCLENBQVQsRUFBcUMsRUFBckMsRUFBeUM7QUFBQSxRQUFBLFFBQUEsRUFBVSxLQUFWO09BQXpDLENBRDNCLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBSFYsQ0FBQTtBQUlBLE1BQUEsSUFBQSxDQUFBLElBQWUsQ0FBQSxNQUFmO0FBQUEsY0FBQSxDQUFBO09BSkE7QUFBQSxNQU1BLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFDLENBQUEsTUFBcEIsQ0FOakIsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBekIsQ0FBNkIsWUFBN0IsQ0FQQSxDQUFBOztZQVN5QixDQUFFLE9BQTNCLENBQUE7T0FUQTtBQUFBLE1BVUEsSUFBQyxDQUFBLHdCQUFELEdBQTRCLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixDQUFBLENBQW1CLENBQUMsV0FBcEIsQ0FBZ0MsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWUsSUFBZixDQUFoQyxDQVY1QixDQUFBO0FBWUEsTUFBQSxJQUFrQixDQUFBLElBQUssQ0FBQSxNQUF2QjtBQUFBLFFBQUEsSUFBQyxDQUFBLFdBQUQsQ0FBQSxDQUFBLENBQUE7T0FaQTtBQUFBLE1BYUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxVQUFVLENBQUMsV0FBMUIsQ0FBc0MsSUFBQyxDQUFBLE1BQXZDLENBYkEsQ0FBQTthQWNBLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQWQsR0FBd0IsUUFmRztJQUFBLENBM0I3QjtBQUFBLElBNENBLFdBQUEsRUFBYSxTQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBVixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFtQixJQUFuQixDQURYLENBQUE7YUFFQSxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFsQixDQUFzQixtQkFBdEIsRUFIVztJQUFBLENBNUNiO0FBQUEsSUFpREEscUJBQUEsRUFBdUIsU0FBQSxHQUFBO0FBQ3JCLFVBQUEsMEJBQUE7QUFBQSxNQUFBLFVBQUEsR0FBYSxJQUFDLENBQUEsYUFBYSxDQUFDLHFCQUFmLENBQUEsQ0FBYixDQUFBO0FBQUEsTUFDQSxjQUFBLEdBQWlCLElBQUMsQ0FBQSxhQUFhLENBQUMsVUFBVSxDQUFDLGFBQTFCLENBQXdDLGNBQXhDLENBQXVELENBQUMscUJBQXhELENBQUEsQ0FEakIsQ0FBQTthQUdBO0FBQUEsUUFBQSxHQUFBLEVBQUssY0FBYyxDQUFDLEdBQWYsR0FBcUIsVUFBVSxDQUFDLEdBQWhDLEdBQXNDLElBQUMsQ0FBQSxNQUFNLENBQUMscUJBQVIsQ0FBQSxDQUFBLEdBQWtDLENBQTdFO0FBQUEsUUFDQSxJQUFBLEVBQU0sY0FBYyxDQUFDLElBQWYsR0FBc0IsVUFBVSxDQUFDLElBRHZDO1FBSnFCO0lBQUEsQ0FqRHZCO0FBQUEsSUF3REEsUUFBQSxFQUFVLFNBQUMsQ0FBRCxHQUFBO0FBQ1IsVUFBQSxxQkFBQTtBQUFBLE1BQUEsSUFBVSxDQUFBLElBQUssQ0FBQSxNQUFmO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFBQSxNQUNBLGNBQUEsR0FBaUIsSUFEakIsQ0FBQTtBQUVBLE1BQUEsSUFBRyxDQUFDLENBQUMsT0FBTDtBQUNFLFFBQUEsY0FBQSxHQUFpQixDQUFDLENBQUMsT0FBRixLQUFlLElBQWhDLENBQUE7QUFBQSxRQUNBLEtBQUEsR0FBUSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBRG5CLENBREY7T0FBQSxNQUFBO0FBSUUsUUFBQSxLQUFBLEdBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFuQixDQUpGO09BRkE7QUFRQSxNQUFBLElBQUcsY0FBQSxJQUFtQixJQUFDLENBQUEsU0FBRCxDQUFXLG1CQUFYLENBQXRCO0FBQ0UsUUFBQSxJQUFDLENBQUEsdUJBQUQsQ0FBeUIsS0FBekIsQ0FBQSxDQURGO09BUkE7QUFVQSxNQUFBLElBQUcsSUFBQyxDQUFBLFNBQUQsQ0FBVyxxQkFBWCxDQUFIO2VBQ0UsSUFBQyxDQUFBLGNBQUQsQ0FBQSxFQURGO09BWFE7SUFBQSxDQXhEVjtBQUFBLElBc0VBLEtBQUEsRUFBTyxTQUFBLEdBQUE7QUFDTCxVQUFBLGNBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxJQUFDLENBQUEsU0FBRCxDQUFXLDBCQUFYLENBQU4sQ0FBQTtBQUFBLE1BQ0EsR0FBQSxHQUFNLElBQUMsQ0FBQSxTQUFELENBQVcsMEJBQVgsQ0FETixDQUFBO0FBQUEsTUFHQSxDQUFBLEdBQUksSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsQ0FISixDQUFBO0FBQUEsTUFJQSxDQUFBLEdBQUksSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsQ0FKSixDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFyQixHQUEyQixFQUFBLEdBQUcsQ0FBSCxHQUFLLElBTmhDLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxhQUFhLENBQUMsS0FBSyxDQUFDLElBQXJCLEdBQTRCLEVBQUEsR0FBRyxDQUFILEdBQUssSUFQakMsQ0FBQTthQVNBLFVBQUEsQ0FBVyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ1QsVUFBQSxLQUFDLENBQUEsYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFyQixHQUEyQixFQUEzQixDQUFBO2lCQUNBLEtBQUMsQ0FBQSxhQUFhLENBQUMsS0FBSyxDQUFDLElBQXJCLEdBQTRCLEdBRm5CO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWCxFQUdFLEVBSEYsRUFWSztJQUFBLENBdEVQO0FBQUEsSUFxRkEsY0FBQSxFQUFnQixTQUFDLEdBQUQsRUFBTSxHQUFOLEdBQUE7QUFDZCxVQUFBLFNBQUE7QUFBQSxNQUFBLFNBQUEsR0FBZSxJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBZ0IsR0FBbkIsR0FBNEIsQ0FBQSxDQUE1QixHQUFvQyxDQUFoRCxDQUFBO2FBQ0EsTUFBQSxDQUFPLEdBQVAsRUFBWSxHQUFaLEVBQWlCLElBQWpCLENBQUEsR0FBeUIsVUFGWDtJQUFBLENBckZoQjtBQUFBLElBeUZBLGNBQUEsRUFBZ0IsU0FBQyxLQUFELEdBQUE7QUFDZCxVQUFBLDRFQUFBO0FBQUEsTUFBQSxjQUFBLEdBQWlCLElBQUMsQ0FBQSxNQUFNLENBQUMsK0JBQVIsQ0FBd0MsS0FBeEMsQ0FBakIsQ0FBQTtBQUFBLE1BQ0EsWUFBQSxHQUFlLElBQUMsQ0FBQSxxQkFBRCxDQUFBLENBRGYsQ0FBQTtBQUFBLE1BR0EsT0FBYyxJQUFDLENBQUEsYUFBYSxDQUFDLDhCQUFmLENBQThDLGNBQTlDLENBQWQsRUFBQyxZQUFBLElBQUQsRUFBTyxXQUFBLEdBSFAsQ0FBQTtBQUFBLE1BSUEsSUFBQSxJQUFRLFlBQVksQ0FBQyxJQUFiLEdBQW9CLElBQUMsQ0FBQSxhQUFhLENBQUMsYUFBZixDQUFBLENBSjVCLENBQUE7QUFBQSxNQUtBLEdBQUEsSUFBTyxZQUFZLENBQUMsR0FBYixHQUFtQixJQUFDLENBQUEsYUFBYSxDQUFDLFlBQWYsQ0FBQSxDQUwxQixDQUFBO0FBQUEsTUFPQSxLQUFBLEdBQVEsSUFBQyxDQUFBLGtCQUFELENBQW9CLElBQXBCLEVBQTBCLEdBQTFCLENBUFIsQ0FBQTtBQUFBLE1BUUEsWUFBQSxHQUFlLE1BQUEsQ0FBTyxJQUFDLENBQUEsU0FBRCxDQUFXLDBCQUFYLENBQVAsRUFBK0MsSUFBQyxDQUFBLFNBQUQsQ0FBVywwQkFBWCxDQUEvQyxDQVJmLENBQUE7QUFTQTthQUFNLFlBQUEsRUFBTixHQUFBO0FBQ0UsUUFBQSxJQUFDLENBQUEsU0FBVSxDQUFBLElBQUMsQ0FBQSxlQUFELENBQVgsR0FBK0IsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBaEIsRUFBc0IsR0FBdEIsRUFBMkIsS0FBM0IsQ0FBL0IsQ0FBQTtBQUFBLHNCQUNBLElBQUMsQ0FBQSxlQUFELEdBQW1CLENBQUMsSUFBQyxDQUFBLGVBQUQsR0FBbUIsQ0FBcEIsQ0FBQSxHQUF5QixJQUFDLENBQUEsU0FBRCxDQUFXLDBCQUFYLEVBRDVDLENBREY7TUFBQSxDQUFBO3NCQVZjO0lBQUEsQ0F6RmhCO0FBQUEsSUF1R0Esa0JBQUEsRUFBb0IsU0FBQyxJQUFELEVBQU8sR0FBUCxHQUFBO0FBQ2xCLFVBQUEsVUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxhQUFhLENBQUMscUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxNQUNBLEVBQUEsR0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBQyxDQUFBLE1BQXBCLENBQTJCLENBQUMsVUFBVSxDQUFDLGdCQUF2QyxDQUNILElBQUEsR0FBTyxNQUFNLENBQUMsSUFEWCxFQUVILEdBQUEsR0FBTSxNQUFNLENBQUMsR0FGVixDQURMLENBQUE7QUFNQSxNQUFBLElBQUcsRUFBSDtlQUNFLGdCQUFBLENBQWlCLEVBQWpCLENBQW9CLENBQUMsTUFEdkI7T0FBQSxNQUFBO2VBR0UscUJBSEY7T0FQa0I7SUFBQSxDQXZHcEI7QUFBQSxJQW1IQSxjQUFBLEVBQWdCLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxLQUFQLEdBQUE7YUFDZDtBQUFBLFFBQUEsQ0FBQSxFQUFHLENBQUg7QUFBQSxRQUNBLENBQUEsRUFBRyxDQURIO0FBQUEsUUFFQSxLQUFBLEVBQU8sQ0FGUDtBQUFBLFFBR0EsS0FBQSxFQUFPLEtBSFA7QUFBQSxRQUlBLFFBQUEsRUFDRTtBQUFBLFVBQUEsQ0FBQSxFQUFHLENBQUEsQ0FBQSxHQUFLLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FBQSxHQUFnQixDQUF4QjtBQUFBLFVBQ0EsQ0FBQSxFQUFHLENBQUEsR0FBQSxHQUFPLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FBQSxHQUFnQixDQUQxQjtTQUxGO1FBRGM7SUFBQSxDQW5IaEI7QUFBQSxJQTRIQSxhQUFBLEVBQWUsU0FBQSxHQUFBO0FBQ2IsVUFBQSxtQ0FBQTtBQUFBLE1BQUEsSUFBbUQsSUFBQyxDQUFBLE1BQXBEO0FBQUEsUUFBQSxxQkFBQSxDQUFzQixJQUFDLENBQUEsYUFBYSxDQUFDLElBQWYsQ0FBb0IsSUFBcEIsQ0FBdEIsQ0FBQSxDQUFBO09BQUE7QUFDQSxNQUFBLElBQUEsQ0FBQSxJQUFlLENBQUEsTUFBZjtBQUFBLGNBQUEsQ0FBQTtPQURBO0FBQUEsTUFHQSxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsR0FBZ0IsSUFBQyxDQUFBLGFBQWEsQ0FBQyxXQUgvQixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxZQUpoQyxDQUFBO0FBQUEsTUFLQSxHQUFBLEdBQU0sSUFBQyxDQUFBLE9BQU8sQ0FBQyx3QkFMZixDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsT0FBTyxDQUFDLHdCQUFULEdBQW9DLFNBTnBDLENBQUE7QUFRQTtBQUFBLFdBQUEsMkNBQUE7NEJBQUE7QUFDRSxRQUFBLElBQVksUUFBUSxDQUFDLEtBQVQsSUFBa0IsR0FBOUI7QUFBQSxtQkFBQTtTQUFBO0FBQUEsUUFFQSxRQUFRLENBQUMsUUFBUSxDQUFDLENBQWxCLElBQXVCLEtBRnZCLENBQUE7QUFBQSxRQUdBLFFBQVEsQ0FBQyxDQUFULElBQWMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUhoQyxDQUFBO0FBQUEsUUFJQSxRQUFRLENBQUMsQ0FBVCxJQUFjLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FKaEMsQ0FBQTtBQUFBLFFBS0EsUUFBUSxDQUFDLEtBQVQsSUFBa0IsSUFMbEIsQ0FBQTtBQUFBLFFBT0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULEdBQXNCLE9BQUEsR0FBTyxRQUFRLENBQUMsS0FBTSxhQUF0QixHQUE4QixJQUE5QixHQUFrQyxRQUFRLENBQUMsS0FBM0MsR0FBaUQsR0FQdkUsQ0FBQTtBQUFBLFFBUUEsSUFBQSxHQUFPLE1BQUEsQ0FBTyxJQUFDLENBQUEsU0FBRCxDQUFXLG9CQUFYLENBQVAsRUFBeUMsSUFBQyxDQUFBLFNBQUQsQ0FBVyxvQkFBWCxDQUF6QyxFQUEyRSxJQUEzRSxDQVJQLENBQUE7QUFBQSxRQVNBLElBQUMsQ0FBQSxPQUFPLENBQUMsUUFBVCxDQUNFLElBQUksQ0FBQyxLQUFMLENBQVcsUUFBUSxDQUFDLENBQVQsR0FBYSxJQUFBLEdBQU8sQ0FBL0IsQ0FERixFQUVFLElBQUksQ0FBQyxLQUFMLENBQVcsUUFBUSxDQUFDLENBQVQsR0FBYSxJQUFBLEdBQU8sQ0FBL0IsQ0FGRixFQUdFLElBSEYsRUFHUSxJQUhSLENBVEEsQ0FERjtBQUFBLE9BUkE7YUF3QkEsSUFBQyxDQUFBLE9BQU8sQ0FBQyx3QkFBVCxHQUFvQyxJQXpCdkI7SUFBQSxDQTVIZjtBQUFBLElBdUpBLE1BQUEsRUFBUSxTQUFBLEdBQUE7QUFDTixNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsQ0FBQSxJQUFLLENBQUEsTUFBZixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsZUFBRCxHQUFtQixDQURuQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsU0FBRCxHQUFhLEVBRmIsQ0FBQTthQUlBLHFCQUFBLENBQXNCLElBQUMsQ0FBQSxhQUFhLENBQUMsSUFBZixDQUFvQixJQUFwQixDQUF0QixFQUxNO0lBQUEsQ0F2SlI7R0FSRixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/loic/.atom/packages/activate-power-mode/lib/activate-power-mode.coffee
