(function() {
  var $, RsenseClient;

  $ = require('jquery');

  String.prototype.replaceAll = function(s, r) {
    return this.split(s).join(r);
  };

  module.exports = RsenseClient = (function() {
    RsenseClient.prototype.projectPath = null;

    RsenseClient.prototype.serverUrl = null;

    function RsenseClient() {
      var port;
      this.projectPath = atom.project.getPaths()[0];
      port = atom.config.get('autocomplete-ruby.port');
      this.serverUrl = "http://localhost:" + port;
    }

    RsenseClient.prototype.checkCompletion = function(editor, buffer, row, column, callback) {
      var code, request;
      code = buffer.getText().replaceAll('\n', '\n').replaceAll('%', '%25');
      request = {
        command: 'code_completion',
        project: this.projectPath,
        file: editor.getPath(),
        code: code,
        location: {
          row: row,
          column: column
        }
      };
      $.ajax(this.serverUrl, {
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(request),
        error: function(jqXHR, textStatus, errorThrown) {
          callback([]);
          return console.error(textStatus);
        },
        success: function(data, textStatus, jqXHR) {
          return callback(data.completions);
        }
      });
      return [];
    };

    return RsenseClient;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbG9pYy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcnVieS9saWIvYXV0b2NvbXBsZXRlLXJ1YnktY2xpZW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxlQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBakIsR0FBOEIsU0FBQyxDQUFELEVBQUcsQ0FBSCxHQUFBO1dBQVMsSUFBQyxDQUFBLEtBQUQsQ0FBTyxDQUFQLENBQVMsQ0FBQyxJQUFWLENBQWUsQ0FBZixFQUFUO0VBQUEsQ0FEOUIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiwyQkFBQSxXQUFBLEdBQWEsSUFBYixDQUFBOztBQUFBLDJCQUNBLFNBQUEsR0FBVyxJQURYLENBQUE7O0FBR2EsSUFBQSxzQkFBQSxHQUFBO0FBQ1gsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUF2QyxDQUFBO0FBQUEsTUFDQSxJQUFBLEdBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdCQUFoQixDQURQLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxTQUFELEdBQWMsbUJBQUEsR0FBbUIsSUFGakMsQ0FEVztJQUFBLENBSGI7O0FBQUEsMkJBUUEsZUFBQSxHQUFpQixTQUFDLE1BQUQsRUFBUyxNQUFULEVBQWlCLEdBQWpCLEVBQXNCLE1BQXRCLEVBQThCLFFBQTlCLEdBQUE7QUFDZixVQUFBLGFBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsVUFBakIsQ0FBNEIsSUFBNUIsRUFBa0MsSUFBbEMsQ0FBdUMsQ0FDdEIsVUFEakIsQ0FDNEIsR0FENUIsRUFDaUMsS0FEakMsQ0FBUCxDQUFBO0FBQUEsTUFHQSxPQUFBLEdBQ0U7QUFBQSxRQUFBLE9BQUEsRUFBUyxpQkFBVDtBQUFBLFFBQ0EsT0FBQSxFQUFTLElBQUMsQ0FBQSxXQURWO0FBQUEsUUFFQSxJQUFBLEVBQU0sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUZOO0FBQUEsUUFHQSxJQUFBLEVBQU0sSUFITjtBQUFBLFFBSUEsUUFBQSxFQUNFO0FBQUEsVUFBQSxHQUFBLEVBQUssR0FBTDtBQUFBLFVBQ0EsTUFBQSxFQUFRLE1BRFI7U0FMRjtPQUpGLENBQUE7QUFBQSxNQVlBLENBQUMsQ0FBQyxJQUFGLENBQU8sSUFBQyxDQUFBLFNBQVIsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLE1BQU47QUFBQSxRQUNBLFFBQUEsRUFBVSxNQURWO0FBQUEsUUFFQSxJQUFBLEVBQU0sSUFBSSxDQUFDLFNBQUwsQ0FBZSxPQUFmLENBRk47QUFBQSxRQUdBLEtBQUEsRUFBTyxTQUFDLEtBQUQsRUFBUSxVQUFSLEVBQW9CLFdBQXBCLEdBQUE7QUFHTCxVQUFBLFFBQUEsQ0FBUyxFQUFULENBQUEsQ0FBQTtpQkFDQSxPQUFPLENBQUMsS0FBUixDQUFjLFVBQWQsRUFKSztRQUFBLENBSFA7QUFBQSxRQVFBLE9BQUEsRUFBUyxTQUFDLElBQUQsRUFBTyxVQUFQLEVBQW1CLEtBQW5CLEdBQUE7aUJBQ1AsUUFBQSxDQUFTLElBQUksQ0FBQyxXQUFkLEVBRE87UUFBQSxDQVJUO09BREYsQ0FaQSxDQUFBO0FBd0JBLGFBQU8sRUFBUCxDQXpCZTtJQUFBLENBUmpCLENBQUE7O3dCQUFBOztNQUxGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/loic/.atom/packages/autocomplete-ruby/lib/autocomplete-ruby-client.coffee