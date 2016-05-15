Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

'use babel';

var ValaProvider = (function () {
    function ValaProvider() {
        var _this = this;

        _classCallCheck(this, ValaProvider);

        var vapiDir = atom.config.get('super-vala.vapiDir');

        // autocomplete-plus
        this.selector = '.source.vala';
        this.inclusionPriority = 1;
        this.excludeLowerPriority = true;

        // loading symbols from .vapi
        this.knownSymbols = [];
        fs.readdir(vapiDir, function (err, files) {
            if (err) {
                console.log(err);
                return;
            }

            files.forEach(function (file) {
                if (file.endsWith('.vapi')) {
                    fs.readFile(vapiDir + file, 'utf-8', function (err, content) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        _this.knownSymbols = _this.knownSymbols.concat(_this.loadSymbols(content, file));
                    });
                }
            });
        });
    }

    _createClass(ValaProvider, [{
        key: 'getSuggestions',
        value: function getSuggestions(_ref) {
            var _this2 = this;

            var editor = _ref.editor;
            var bufferPosition = _ref.bufferPosition;
            var scopeDescriptor = _ref.scopeDescriptor;
            var prefix = _ref.prefix;
            var activatedManually = _ref.activatedManually;

            var line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
            var fileSymbols = this.loadSymbols(editor.getText(), editor.getTitle());
            var usings = ['GLib'];
            editor.getText().split('\n').forEach(function (line) {
                usings.concat(fileSymbols.filter(function (symbol) {
                    return symbol.type == 'namespace';
                }));
                var usingRe = /^using (.*);/;
                var usingMatch = line.match(usingRe);
                if (usingMatch) {
                    usings.push(usingMatch[1]);
                }
            });

            return new Promise(function (resolve) {
                var suggestions = [];
                // if writing a new using directive
                if (line.match(/^using /)) {
                    _this2.knownSymbols.forEach(function (symbol) {
                        // adding namespace suggestions only
                        if (symbol.type == 'namespace' && symbol.shortName.match(prefix)) {
                            var suggestion = {
                                text: symbol.shortName,
                                type: 'import',
                                leftLabel: symbol.name,
                                description: 'You should compile with the ' + symbol.file.replace('.vapi', '') + ' package.',
                                descriptionMoreURL: 'http://valadoc.org/#!api=' + symbol.file.replace('.vapi', '') + '/' + symbol.name
                            };
                            suggestions.push(suggestion);
                        }
                    });
                } else {
                    suggestions = suggestions.concat(_this2.suggest(_this2.knownSymbols, prefix, usings));
                }

                if ('this'.match(prefix)) {
                    suggestions.unshift({
                        text: 'this',
                        type: 'type'
                    });
                }

                if (line.match('this.')) {
                    //prefix = line.replace ('this.', '').replace ('\t', '');
                    var currentThis; // = 'vMarkdown.Parser';
                    fileSymbols.forEach(function (symbol) {
                        if (symbol.type == 'class') {
                            var currentLine = editor.getSelectedScreenRange().start.row;
                            if (symbol.start < currentLine && symbol.end > currentLine) {
                                currentThis = symbol.completeName;
                            }
                        }
                    });
                    suggestions = _this2.suggest(fileSymbols, prefix, usings);
                }

                // just keep the classes if we are creating a new instance
                if (line.match('new ')) {
                    suggestions = suggestions.filter(function (suggestion) {
                        if (suggestion.type == 'class') {
                            return true;
                        } else {
                            return false;
                        }
                    });
                }

                resolve(suggestions);
            });
        }
    }, {
        key: 'suggest',
        value: function suggest(symbols, prefix, usings) {
            var suggestions = [];
            var maxSuggestions = 20;
            symbols.forEach(function (symbol) {
                if (symbol.shortName.match(prefix) && suggestions.length <= maxSuggestions) {
                    // if there is already the include directive
                    if (usings.includes(symbol.namespace)) {
                        var description;
                        if (symbol.type == 'method') {
                            description = 'Returns : ' + symbol.valueType;
                        }
                        var suggestion = {
                            text: symbol.shortName,
                            type: symbol.type,
                            leftLabel: symbol.name,
                            description: description,
                            descriptionMoreURL: 'http://valadoc.org/#!api=' + symbol.file.replace('.vapi', '') + '/' + symbol.name
                        };
                        suggestions.unshift(suggestion);
                    } else {
                        var description;
                        if (symbol.type == 'method') {
                            description = 'Returns : ' + symbol.valueType;
                        } else {
                            description = 'You should add : using ' + symbol.namespace + ', in this file.';
                        }
                        var suggestion = {
                            text: symbol.shortName,
                            type: symbol.type,
                            leftLabel: symbol.name,
                            description: description,
                            descriptionMoreURL: 'http://valadoc.org/#!api=' + symbol.file.replace('.vapi', '') + '/' + symbol.name
                        };
                        suggestions.push(suggestion);
                        // TODO : ajouter les usings qui vont bien automatiquement
                    }
                }
            });
            return suggestions;
        }
    }, {
        key: 'loadSymbols',
        value: function loadSymbols(vala, file) {
            var res = [];
            if (!vala) {
                return;
            }

            var nsLevel = 0;
            var lastCls = 0;

            var inNs = false,
                inClass = false,
                inEnum = false;

            var ns = '',
                cls = '',
                enm = '';

            var nsRe = /namespace (.*) {/,
                clsRe = /public class (.*) (: (.*))?{/,
                enmRe = /public enum (.*) {/;

            var propRe = /(public|private|internal) (.*) (.*) {.*}/,
                methodRe = /(public|private|internal) (?!delegate )(?!signal )(.*) (.*) \((.*)\)/,
                signalRe = /(public|private|internal) signal (.*) (.*) \((.*)\)/,
                delegateRe = /(public|private|internal) delegate (.*) (.*) \((.*)\)/;

            var lineNum = 0;
            vala.split('\n').forEach(function (line, arr, index) {
                line = line.replace('\t', '');

                var nsMatch = line.match(nsRe);
                if (nsMatch) {
                    if (inNs) {
                        var i = 0,
                            parentNs;
                        ns.split('.').forEach(function (part) {
                            if (i <= nsLevel) {
                                if (parentNs) {
                                    parentNs += '.' + part;
                                } else {
                                    parentNs = part;
                                }
                            }
                            i++;
                        });
                        nsLevel++;
                        ns = parentNs + '.' + nsMatch[1];
                    } else {
                        nsLevel++;
                        ns = nsMatch[1];
                        inNs = true;
                    }

                    res.push({
                        type: 'namespace',
                        name: ns,
                        shortName: ns,
                        file: file
                    });
                }

                var clsMatch = line.match(clsRe);
                if (clsMatch) {
                    cls = clsMatch[1];
                    if (cls.match(' ')) {
                        cls = cls.split(' ')[0];
                    }
                    inClass = true;

                    lastCls = res.push({
                        type: 'class',
                        name: ns + '.' + cls,
                        shortName: cls,
                        namespace: ns,
                        start: lineNum,
                        file: file
                    });
                }

                var enmMatch = line.match(enmRe);
                if (enmMatch) {
                    inEnum = true;
                }

                var propMatch = line.match(propRe);
                if (propMatch) {
                    var prefix = '';
                    if (inNs) {
                        prefix += ns;
                    }
                    if (inClass) {
                        if (prefix) {
                            prefix += '.' + cls;
                        } else {
                            prefix = cls;
                        }
                    }
                    var visibility = propMatch[1];
                    var type = propMatch[2];
                    var propName = propMatch[3];

                    var completeName = '';
                    if (prefix != '') {
                        completeName = prefix + '.' + propName;
                    } else {
                        completeName = propName;
                    }

                    if (visibility == 'public') {
                        res.push({
                            type: 'property',
                            name: completeName,
                            shortName: propName,
                            valueType: type,
                            namespace: ns,
                            file: file
                        });
                    }
                }

                var methodMatch = line.match(methodRe);
                if (methodMatch) {
                    var prefix = '';
                    if (inNs) {
                        prefix += ns;
                    }
                    if (inClass) {
                        if (prefix != '') {
                            prefix += '.' + cls;
                        } else {
                            prefix = cls;
                        }
                    }
                    var visibility = methodMatch[1];
                    var type = methodMatch[2];
                    var methodName = methodMatch[3];

                    var completeName = '';
                    if (prefix != '') {
                        completeName = prefix + '.' + methodName;
                    } else {
                        completeName = methodName;
                    }

                    if (visibility == 'public') {
                        res.push({
                            type: 'method',
                            name: completeName,
                            shortName: methodName,
                            valueType: type,
                            namespace: ns,
                            file: file
                        });
                    }
                }

                var signalMatch = line.match(signalRe);
                if (signalMatch) {
                    var prefix = '';
                    if (inNs) {
                        prefix += ns;
                    }
                    if (inClass) {
                        if (prefix != '') {
                            prefix += '.' + cls;
                        } else {
                            prefix = cls;
                        }
                    }
                    var visibility = signalMatch[1];
                    var type = signalMatch[2];
                    var signalName = signalMatch[3];

                    var completeName = '';
                    if (prefix != '') {
                        completeName = prefix + '.' + signalName;
                    } else {
                        completeName = signalName;
                    }

                    if (visibility == 'public') {
                        res.push({
                            type: 'type',
                            name: completeName,
                            shortName: signalName,
                            valueType: type,
                            namespace: ns,
                            file: file
                        });
                    }
                }

                var delegateMatch = line.match(delegateRe);
                if (delegateMatch) {
                    var prefix = '';
                    if (inNs) {
                        prefix += ns;
                    }
                    if (inClass) {
                        if (prefix != '') {
                            prefix += '.' + cls;
                        } else {
                            prefix = cls;
                        }
                    }
                    var visibility = delegateMatch[1];
                    var type = delegateMatch[2];
                    var delegateName = delegateMatch[3];

                    var completeName = '';
                    if (prefix != '') {
                        completeName = prefix + '.' + delegateName;
                    } else {
                        completeName = delegateName;
                    }

                    if (visibility == 'public') {
                        res.push({
                            type: 'type',
                            name: completeName,
                            shortName: delegateName,
                            valueType: type,
                            namespace: ns,
                            file: file
                        });
                    }
                }

                if (line.match(/^}$/)) {
                    if (inEnum) {
                        inEnum = false;
                    } else if (inClass) {
                        inClass = false;
                        res[lastCls - 1].end = lineNum;
                    } else if (inNs) {
                        nsLevel--;
                        if (nsLevel == 0) {
                            inNs = false;
                        }
                    }
                }
                lineNum++;
            });
            return res;
        }
    }]);

    return ValaProvider;
})();

exports['default'] = ValaProvider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2xvaWMvLmF0b20vcGFja2FnZXMvc3VwZXItdmFsYS9saWIvcHJvdmlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztrQkFFb0IsSUFBSTs7SUFBWixFQUFFOztBQUZkLFdBQVcsQ0FBQzs7SUFJUyxZQUFZO0FBQ2xCLGFBRE0sWUFBWSxHQUNmOzs7OEJBREcsWUFBWTs7QUFFekIsWUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQzs7O0FBR3RELFlBQUksQ0FBQyxRQUFRLEdBQUcsY0FBYyxDQUFDO0FBQy9CLFlBQUksQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUM7QUFDM0IsWUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQzs7O0FBR2pDLFlBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFVBQUUsQ0FBQyxPQUFPLENBQUUsT0FBTyxFQUFFLFVBQUMsR0FBRyxFQUFFLEtBQUssRUFBSztBQUNqQyxnQkFBSSxHQUFHLEVBQUU7QUFDTCx1QkFBTyxDQUFDLEdBQUcsQ0FBRSxHQUFHLENBQUMsQ0FBQztBQUNsQix1QkFBTzthQUNWOztBQUVELGlCQUFLLENBQUMsT0FBTyxDQUFFLFVBQUMsSUFBSSxFQUFLO0FBQ3JCLG9CQUFJLElBQUksQ0FBQyxRQUFRLENBQUUsT0FBTyxDQUFDLEVBQUU7QUFDekIsc0JBQUUsQ0FBQyxRQUFRLENBQUUsT0FBTyxHQUFHLElBQUksRUFBRSxPQUFPLEVBQUUsVUFBQyxHQUFHLEVBQUUsT0FBTyxFQUFLO0FBQ3BELDRCQUFJLEdBQUcsRUFBRTtBQUNMLG1DQUFPLENBQUMsR0FBRyxDQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLG1DQUFPO3lCQUNWO0FBQ0QsOEJBQUssWUFBWSxHQUFHLE1BQUssWUFBWSxDQUFDLE1BQU0sQ0FBQyxNQUFLLFdBQVcsQ0FBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FB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O3lCQUNiLENBQUMsQ0FBQztxQkFDTjtpQkFDSjs7QUFFRCxvQkFBSSxJQUFJLENBQUMsS0FBSyxDQUFFLEtBQUssQ0FBQyxFQUFFO0FBQ3BCLHdCQUFJLE1BQU0sRUFBRTtBQUNSLDhCQUFNLEdBQUcsS0FBSyxDQUFDO3FCQUNsQixNQUFNLElBQUksT0FBTyxFQUFFO0FBQ2hCLCtCQUFPLEdBQUcsS0FBSyxDQUFDO0FBQ2hCLDJCQUFHLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUM7cUJBQ2xDLE1BQU0sSUFBSSxJQUFJLEVBQUU7QUFDYiwrQkFBTyxFQUFFLENBQUM7QUFDViw0QkFBSSxPQUFPLElBQUksQ0FBQyxFQUFFO0FBQ2QsZ0NBQUksR0FBRyxLQUFLLENBQUM7eUJBQ2hCO3FCQUNKO2lCQUNKO0FBQ0QsdUJBQU8sRUFBRSxDQUFDO2FBQ2IsQ0FBQyxDQUFDO0FBQ0gsbUJBQU8sR0FBRyxDQUFDO1NBQ2Q7OztXQXJZZ0IsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoiL2hvbWUvbG9pYy8uYXRvbS9wYWNrYWdlcy9zdXBlci12YWxhL2xpYi9wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZhbGFQcm92aWRlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIGNvbnN0IHZhcGlEaXIgPSBhdG9tLmNvbmZpZy5nZXQoJ3N1cGVyLXZhbGEudmFwaURpcicpO1xuXG4gICAgICAgIC8vIGF1dG9jb21wbGV0ZS1wbHVzXG4gICAgICAgIHRoaXMuc2VsZWN0b3IgPSAnLnNvdXJjZS52YWxhJztcbiAgICAgICAgdGhpcy5pbmNsdXNpb25Qcmlvcml0eSA9IDE7XG4gICAgICAgIHRoaXMuZXhjbHVkZUxvd2VyUHJpb3JpdHkgPSB0cnVlO1xuXG4gICAgICAgIC8vIGxvYWRpbmcgc3ltYm9scyBmcm9tIC52YXBpXG4gICAgICAgIHRoaXMua25vd25TeW1ib2xzID0gW107XG4gICAgICAgIGZzLnJlYWRkaXIgKHZhcGlEaXIsIChlcnIsIGZpbGVzKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cgKGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmaWxlcy5mb3JFYWNoICgoZmlsZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChmaWxlLmVuZHNXaXRoICgnLnZhcGknKSkge1xuICAgICAgICAgICAgICAgICAgICBmcy5yZWFkRmlsZSAodmFwaURpciArIGZpbGUsICd1dGYtOCcsIChlcnIsIGNvbnRlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyAoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmtub3duU3ltYm9scyA9IHRoaXMua25vd25TeW1ib2xzLmNvbmNhdCh0aGlzLmxvYWRTeW1ib2xzIChjb250ZW50LCBmaWxlKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRTdWdnZXN0aW9ucyh7ZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgc2NvcGVEZXNjcmlwdG9yLCBwcmVmaXgsIGFjdGl2YXRlZE1hbnVhbGx5fSkge1xuICAgICAgICB2YXIgbGluZSA9IGVkaXRvci5nZXRUZXh0SW5SYW5nZShbW2J1ZmZlclBvc2l0aW9uLnJvdywgMF0sIGJ1ZmZlclBvc2l0aW9uXSk7XG4gICAgICAgIHZhciBmaWxlU3ltYm9scyA9IHRoaXMubG9hZFN5bWJvbHMoZWRpdG9yLmdldFRleHQgKCksIGVkaXRvci5nZXRUaXRsZSgpKTtcbiAgICAgICAgdmFyIHVzaW5ncyA9IFsnR0xpYiddO1xuICAgICAgICBlZGl0b3IuZ2V0VGV4dCgpLnNwbGl0KCdcXG4nKS5mb3JFYWNoKChsaW5lKSA9PiB7XG4gICAgICAgICAgICB1c2luZ3MuY29uY2F0IChmaWxlU3ltYm9scy5maWx0ZXIoKHN5bWJvbCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBzeW1ib2wudHlwZSA9PSAnbmFtZXNwYWNlJztcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHZhciB1c2luZ1JlID0gL151c2luZyAoLiopOy87XG4gICAgICAgICAgICB2YXIgdXNpbmdNYXRjaCA9IGxpbmUubWF0Y2ggKHVzaW5nUmUpO1xuICAgICAgICAgICAgaWYgKHVzaW5nTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICB1c2luZ3MucHVzaCh1c2luZ01hdGNoWzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UgKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICB2YXIgc3VnZ2VzdGlvbnMgPSBbXTtcbiAgICAgICAgICAgIC8vIGlmIHdyaXRpbmcgYSBuZXcgdXNpbmcgZGlyZWN0aXZlXG4gICAgICAgICAgICBpZiAobGluZS5tYXRjaCgvXnVzaW5nIC8pKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5rbm93blN5bWJvbHMuZm9yRWFjaCAoKHN5bWJvbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBhZGRpbmcgbmFtZXNwYWNlIHN1Z2dlc3Rpb25zIG9ubHlcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN5bWJvbC50eXBlID09ICduYW1lc3BhY2UnICYmIHN5bWJvbC5zaG9ydE5hbWUubWF0Y2gocHJlZml4KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN1Z2dlc3Rpb24gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogc3ltYm9sLnNob3J0TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW1wb3J0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0TGFiZWw6IHN5bWJvbC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnWW91IHNob3VsZCBjb21waWxlIHdpdGggdGhlICcgKyBzeW1ib2wuZmlsZS5yZXBsYWNlICgnLnZhcGknLCAnJykgKyAnIHBhY2thZ2UuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbk1vcmVVUkw6ICdodHRwOi8vdmFsYWRvYy5vcmcvIyFhcGk9JyArIHN5bWJvbC5maWxlLnJlcGxhY2UgKCcudmFwaScsICcnKSArICcvJyArIHN5bWJvbC5uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGlvbnMucHVzaCAoc3VnZ2VzdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbnMgPSBzdWdnZXN0aW9ucy5jb25jYXQodGhpcy5zdWdnZXN0ICh0aGlzLmtub3duU3ltYm9scywgcHJlZml4LCB1c2luZ3MpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCd0aGlzJy5tYXRjaCAocHJlZml4KSkge1xuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25zLnVuc2hpZnQgKHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogJ3RoaXMnLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAndHlwZSdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGxpbmUubWF0Y2goJ3RoaXMuJykpIHtcbiAgICAgICAgICAgICAgICAvL3ByZWZpeCA9IGxpbmUucmVwbGFjZSAoJ3RoaXMuJywgJycpLnJlcGxhY2UgKCdcXHQnLCAnJyk7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRUaGlzOy8vID0gJ3ZNYXJrZG93bi5QYXJzZXInO1xuICAgICAgICAgICAgICAgIGZpbGVTeW1ib2xzLmZvckVhY2ggKChzeW1ib2wpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN5bWJvbC50eXBlID09ICdjbGFzcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW50TGluZSA9IGVkaXRvci5nZXRTZWxlY3RlZFNjcmVlblJhbmdlKCkuc3RhcnQucm93O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN5bWJvbC5zdGFydCA8IGN1cnJlbnRMaW5lICYmIHN5bWJvbC5lbmQgPiBjdXJyZW50TGluZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUaGlzID0gc3ltYm9sLmNvbXBsZXRlTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25zID0gdGhpcy5zdWdnZXN0IChmaWxlU3ltYm9scywgcHJlZml4LCB1c2luZ3MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBqdXN0IGtlZXAgdGhlIGNsYXNzZXMgaWYgd2UgYXJlIGNyZWF0aW5nIGEgbmV3IGluc3RhbmNlXG4gICAgICAgICAgICBpZiAobGluZS5tYXRjaCgnbmV3ICcpKSB7XG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbnMgPSBzdWdnZXN0aW9ucy5maWx0ZXIgKChzdWdnZXN0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdWdnZXN0aW9uLnR5cGUgPT0gJ2NsYXNzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVzb2x2ZShzdWdnZXN0aW9ucyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHN1Z2dlc3QgKHN5bWJvbHMsIHByZWZpeCwgdXNpbmdzKSB7XG4gICAgICAgIHZhciBzdWdnZXN0aW9ucyA9IFtdO1xuICAgICAgICBjb25zdCBtYXhTdWdnZXN0aW9ucyA9IDIwO1xuICAgICAgICBzeW1ib2xzLmZvckVhY2ggKChzeW1ib2wpID0+IHtcbiAgICAgICAgICAgIGlmIChzeW1ib2wuc2hvcnROYW1lLm1hdGNoKHByZWZpeCkgJiYgc3VnZ2VzdGlvbnMubGVuZ3RoIDw9IG1heFN1Z2dlc3Rpb25zKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgYWxyZWFkeSB0aGUgaW5jbHVkZSBkaXJlY3RpdmVcbiAgICAgICAgICAgICAgICBpZiAodXNpbmdzLmluY2x1ZGVzKHN5bWJvbC5uYW1lc3BhY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkZXNjcmlwdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN5bWJvbC50eXBlID09ICdtZXRob2QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9ICdSZXR1cm5zIDogJyArIHN5bWJvbC52YWx1ZVR5cGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIHN1Z2dlc3Rpb24gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBzeW1ib2wuc2hvcnROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogc3ltYm9sLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0TGFiZWw6IHN5bWJvbC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb25Nb3JlVVJMOiAnaHR0cDovL3ZhbGFkb2Mub3JnLyMhYXBpPScgKyBzeW1ib2wuZmlsZS5yZXBsYWNlICgnLnZhcGknLCAnJykgKyAnLycgKyBzeW1ib2wubmFtZVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBzdWdnZXN0aW9ucy51bnNoaWZ0IChzdWdnZXN0aW9uKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGVzY3JpcHRpb247XG4gICAgICAgICAgICAgICAgICAgIGlmIChzeW1ib2wudHlwZSA9PSAnbWV0aG9kJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb24gPSAnUmV0dXJucyA6ICcgKyBzeW1ib2wudmFsdWVUeXBlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb24gPSAnWW91IHNob3VsZCBhZGQgOiB1c2luZyAnICsgc3ltYm9sLm5hbWVzcGFjZSArICcsIGluIHRoaXMgZmlsZS4nO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdWdnZXN0aW9uID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogc3ltYm9sLnNob3J0TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHN5bWJvbC50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdExhYmVsOiBzeW1ib2wubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uTW9yZVVSTDogJ2h0dHA6Ly92YWxhZG9jLm9yZy8jIWFwaT0nICsgc3ltYm9sLmZpbGUucmVwbGFjZSAoJy52YXBpJywgJycpICsgJy8nICsgc3ltYm9sLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGlvbnMucHVzaCAoc3VnZ2VzdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE8gOiBham91dGVyIGxlcyB1c2luZ3MgcXVpIHZvbnQgYmllbiBhdXRvbWF0aXF1ZW1lbnRcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBzdWdnZXN0aW9ucztcbiAgICB9XG5cbiAgICBsb2FkU3ltYm9scyh2YWxhLCBmaWxlKSB7XG4gICAgICAgIHZhciByZXMgPSBbXTtcbiAgICAgICAgaWYgKCF2YWxhKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbnNMZXZlbCA9IDA7XG4gICAgICAgIHZhciBsYXN0Q2xzID0gMDtcblxuICAgICAgICB2YXIgaW5OcyA9IGZhbHNlLFxuICAgICAgICAgICAgaW5DbGFzcyA9IGZhbHNlLFxuICAgICAgICAgICAgaW5FbnVtID0gZmFsc2U7XG5cbiAgICAgICAgdmFyIG5zID0gJycsXG4gICAgICAgICAgICBjbHMgPSAnJyxcbiAgICAgICAgICAgIGVubSA9ICcnO1xuXG4gICAgICAgIHZhciBuc1JlID0gL25hbWVzcGFjZSAoLiopIHsvLFxuICAgICAgICAgICAgY2xzUmUgPSAvcHVibGljIGNsYXNzICguKikgKDogKC4qKSk/ey8sXG4gICAgICAgICAgICBlbm1SZSA9IC9wdWJsaWMgZW51bSAoLiopIHsvO1xuXG4gICAgICAgIHZhciBwcm9wUmUgPSAvKHB1YmxpY3xwcml2YXRlfGludGVybmFsKSAoLiopICguKikgey4qfS8sXG4gICAgICAgICAgICBtZXRob2RSZSA9IC8ocHVibGljfHByaXZhdGV8aW50ZXJuYWwpICg/IWRlbGVnYXRlICkoPyFzaWduYWwgKSguKikgKC4qKSBcXCgoLiopXFwpLyxcbiAgICAgICAgICAgIHNpZ25hbFJlID0gLyhwdWJsaWN8cHJpdmF0ZXxpbnRlcm5hbCkgc2lnbmFsICguKikgKC4qKSBcXCgoLiopXFwpLyxcbiAgICAgICAgICAgIGRlbGVnYXRlUmUgPSAvKHB1YmxpY3xwcml2YXRlfGludGVybmFsKSBkZWxlZ2F0ZSAoLiopICguKikgXFwoKC4qKVxcKS87XG5cbiAgICAgICAgdmFyIGxpbmVOdW0gPSAwO1xuICAgICAgICB2YWxhLnNwbGl0KCdcXG4nKS5mb3JFYWNoKChsaW5lLCBhcnIsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBsaW5lID0gbGluZS5yZXBsYWNlICgnXFx0JywgJycpO1xuXG4gICAgICAgICAgICB2YXIgbnNNYXRjaCA9IGxpbmUubWF0Y2ggKG5zUmUpXG4gICAgICAgICAgICBpZiAobnNNYXRjaCkge1xuICAgICAgICAgICAgICAgIGlmIChpbk5zKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpID0gMCwgcGFyZW50TnM7XG4gICAgICAgICAgICAgICAgICAgIG5zLnNwbGl0KCcuJykuZm9yRWFjaCgocGFydCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPD0gbnNMZXZlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnROcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnROcyArPSAnLicgKyBwYXJ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudE5zID0gcGFydDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBuc0xldmVsKys7XG4gICAgICAgICAgICAgICAgICAgIG5zID0gcGFyZW50TnMgKyAnLicgKyBuc01hdGNoWzFdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5zTGV2ZWwrKztcbiAgICAgICAgICAgICAgICAgICAgbnMgPSBuc01hdGNoWzFdO1xuICAgICAgICAgICAgICAgICAgICBpbk5zID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICduYW1lc3BhY2UnLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBucyxcbiAgICAgICAgICAgICAgICAgICAgc2hvcnROYW1lIDogbnMsXG4gICAgICAgICAgICAgICAgICAgIGZpbGU6IGZpbGVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGNsc01hdGNoID0gbGluZS5tYXRjaCAoY2xzUmUpO1xuICAgICAgICAgICAgaWYgKGNsc01hdGNoKSB7XG4gICAgICAgICAgICAgICAgY2xzID0gY2xzTWF0Y2hbMV07XG4gICAgICAgICAgICAgICAgaWYgKGNscy5tYXRjaCAoJyAnKSkge1xuICAgICAgICAgICAgICAgICAgICBjbHMgPSBjbHMuc3BsaXQgKCcgJylbMF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGluQ2xhc3MgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgbGFzdENscyA9IHJlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NsYXNzJyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbnMgKyAnLicgKyBjbHMsXG4gICAgICAgICAgICAgICAgICAgIHNob3J0TmFtZSA6IGNscyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlOiBucyxcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IGxpbmVOdW0sXG4gICAgICAgICAgICAgICAgICAgIGZpbGU6IGZpbGVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGVubU1hdGNoID0gbGluZS5tYXRjaCAoZW5tUmUpO1xuICAgICAgICAgICAgaWYgKGVubU1hdGNoKSB7XG4gICAgICAgICAgICAgICAgaW5FbnVtID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHByb3BNYXRjaCA9IGxpbmUubWF0Y2gocHJvcFJlKTtcbiAgICAgICAgICAgIGlmIChwcm9wTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJlZml4ID0gJyc7XG4gICAgICAgICAgICAgICAgaWYgKGluTnMpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJlZml4ICs9IG5zO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaW5DbGFzcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJlZml4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVmaXggKz0gJy4nICsgY2xzO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZml4ID0gY2xzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB2aXNpYmlsaXR5ID0gcHJvcE1hdGNoWzFdO1xuICAgICAgICAgICAgICAgIHZhciB0eXBlID0gcHJvcE1hdGNoWzJdO1xuICAgICAgICAgICAgICAgIHZhciBwcm9wTmFtZSA9IHByb3BNYXRjaFszXTtcblxuICAgICAgICAgICAgICAgIHZhciBjb21wbGV0ZU5hbWUgPSAnJztcbiAgICAgICAgICAgICAgICBpZiAocHJlZml4ICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlTmFtZSA9IHByZWZpeCArICcuJyArIHByb3BOYW1lO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlTmFtZSA9IHByb3BOYW1lO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh2aXNpYmlsaXR5ID09ICdwdWJsaWMnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwcm9wZXJ0eScsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBjb21wbGV0ZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG9ydE5hbWU6IHByb3BOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVUeXBlOiB0eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlOiBucyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IGZpbGVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbWV0aG9kTWF0Y2ggPSBsaW5lLm1hdGNoIChtZXRob2RSZSk7XG4gICAgICAgICAgICBpZiAobWV0aG9kTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJlZml4ID0gJyc7XG4gICAgICAgICAgICAgICAgaWYgKGluTnMpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJlZml4ICs9IG5zO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaW5DbGFzcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJlZml4ICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVmaXggKz0gJy4nICsgY2xzO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZml4ID0gY2xzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB2aXNpYmlsaXR5ID0gbWV0aG9kTWF0Y2hbMV07XG4gICAgICAgICAgICAgICAgdmFyIHR5cGUgPSBtZXRob2RNYXRjaFsyXTtcbiAgICAgICAgICAgICAgICB2YXIgbWV0aG9kTmFtZSA9IG1ldGhvZE1hdGNoWzNdO1xuXG4gICAgICAgICAgICAgICAgdmFyIGNvbXBsZXRlTmFtZSA9ICcnO1xuICAgICAgICAgICAgICAgIGlmIChwcmVmaXggIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGVOYW1lID0gcHJlZml4ICsgJy4nICsgbWV0aG9kTmFtZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZU5hbWUgPSBtZXRob2ROYW1lO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh2aXNpYmlsaXR5ID09ICdwdWJsaWMnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdtZXRob2QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogY29tcGxldGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvcnROYW1lOiBtZXRob2ROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVUeXBlOiB0eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlOiBucyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IGZpbGVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgc2lnbmFsTWF0Y2ggPSBsaW5lLm1hdGNoIChzaWduYWxSZSk7XG4gICAgICAgICAgICBpZiAoc2lnbmFsTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJlZml4ID0gJyc7XG4gICAgICAgICAgICAgICAgaWYgKGluTnMpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJlZml4ICs9IG5zO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaW5DbGFzcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJlZml4ICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVmaXggKz0gJy4nICsgY2xzO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZml4ID0gY2xzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB2aXNpYmlsaXR5ID0gc2lnbmFsTWF0Y2hbMV07XG4gICAgICAgICAgICAgICAgdmFyIHR5cGUgPSBzaWduYWxNYXRjaFsyXTtcbiAgICAgICAgICAgICAgICB2YXIgc2lnbmFsTmFtZSA9IHNpZ25hbE1hdGNoWzNdO1xuXG4gICAgICAgICAgICAgICAgdmFyIGNvbXBsZXRlTmFtZSA9ICcnO1xuICAgICAgICAgICAgICAgIGlmIChwcmVmaXggIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGVOYW1lID0gcHJlZml4ICsgJy4nICsgc2lnbmFsTmFtZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZU5hbWUgPSBzaWduYWxOYW1lO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh2aXNpYmlsaXR5ID09ICdwdWJsaWMnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0eXBlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGNvbXBsZXRlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3J0TmFtZTogc2lnbmFsTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlVHlwZTogdHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBmaWxlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRlbGVnYXRlTWF0Y2ggPSBsaW5lLm1hdGNoIChkZWxlZ2F0ZVJlKTtcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZU1hdGNoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHByZWZpeCA9ICcnO1xuICAgICAgICAgICAgICAgIGlmIChpbk5zKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZWZpeCArPSBucztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGluQ2xhc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByZWZpeCAhPSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZml4ICs9ICcuJyArIGNscztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWZpeCA9IGNscztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgdmlzaWJpbGl0eSA9IGRlbGVnYXRlTWF0Y2hbMV07XG4gICAgICAgICAgICAgICAgdmFyIHR5cGUgPSBkZWxlZ2F0ZU1hdGNoWzJdO1xuICAgICAgICAgICAgICAgIHZhciBkZWxlZ2F0ZU5hbWUgPSBkZWxlZ2F0ZU1hdGNoWzNdO1xuXG4gICAgICAgICAgICAgICAgdmFyIGNvbXBsZXRlTmFtZSA9ICcnO1xuICAgICAgICAgICAgICAgIGlmIChwcmVmaXggIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGVOYW1lID0gcHJlZml4ICsgJy4nICsgZGVsZWdhdGVOYW1lO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlTmFtZSA9IGRlbGVnYXRlTmFtZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodmlzaWJpbGl0eSA9PSAncHVibGljJykge1xuICAgICAgICAgICAgICAgICAgICByZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndHlwZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBjb21wbGV0ZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG9ydE5hbWU6IGRlbGVnYXRlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlVHlwZTogdHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBmaWxlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGxpbmUubWF0Y2ggKC9efSQvKSkge1xuICAgICAgICAgICAgICAgIGlmIChpbkVudW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaW5FbnVtID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbkNsYXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIGluQ2xhc3MgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcmVzW2xhc3RDbHMgLSAxXS5lbmQgPSBsaW5lTnVtO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5Ocykge1xuICAgICAgICAgICAgICAgICAgICBuc0xldmVsLS07XG4gICAgICAgICAgICAgICAgICAgIGlmIChuc0xldmVsID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluTnMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxpbmVOdW0rKztcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxufVxuIl19
//# sourceURL=/home/loic/.atom/packages/super-vala/lib/provider.js
