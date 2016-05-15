Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _superValaView = require('./super-vala-view');

var _superValaView2 = _interopRequireDefault(_superValaView);

var _atom = require('atom');

var _provider = require('./provider');

var _provider2 = _interopRequireDefault(_provider);

'use babel';

exports['default'] = {

    config: {
        vapiDir: {
            type: 'string',
            'default': 'C:\\ProgramData\\vala-0.20\\vapi\\',
            title: 'Vapi files directory'
        }
    },

    superValaView: null,
    modalPanel: null,
    subscriptions: null,

    activate: function activate(state) {
        var _this = this;

        this.superValaView = new _superValaView2['default'](state.superValaViewState);
        this.modalPanel = atom.workspace.addModalPanel({
            item: this.superValaView.getElement(),
            visible: false
        });

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new _atom.CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'super-vala:toggle': function superValaToggle() {
                return _this.toggle();
            }
        }));
    },

    deactivate: function deactivate() {
        this.modalPanel.destroy();
        this.subscriptions.dispose();
        this.superValaView.destroy();
    },

    serialize: function serialize() {
        return {
            superValaViewState: this.superValaView.serialize()
        };
    },

    toggle: function toggle() {
        console.log('SuperVala was toggled!');
        return this.modalPanel.isVisible() ? this.modalPanel.hide() : this.modalPanel.show();
    },

    getProvider: function getProvider() {
        var provider = new _provider2['default']();
        return provider;
    }

};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2xvaWMvLmF0b20vcGFja2FnZXMvc3VwZXItdmFsYS9saWIvc3VwZXItdmFsYS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7NkJBRTBCLG1CQUFtQjs7OztvQkFDVCxNQUFNOzt3QkFDakIsWUFBWTs7OztBQUpyQyxXQUFXLENBQUM7O3FCQU1HOztBQUVYLFVBQU0sRUFBRTtBQUNKLGVBQU8sRUFBRTtBQUNMLGdCQUFJLEVBQUUsUUFBUTtBQUNkLHVCQUFTLG9DQUFvQztBQUM3QyxpQkFBSyxFQUFFLHNCQUFzQjtTQUNoQztLQUNKOztBQUVELGlCQUFhLEVBQUUsSUFBSTtBQUNuQixjQUFVLEVBQUUsSUFBSTtBQUNoQixpQkFBYSxFQUFFLElBQUk7O0FBRW5CLFlBQVEsRUFBQSxrQkFBQyxLQUFLLEVBQUU7OztBQUNaLFlBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQWtCLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ2pFLFlBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUM7QUFDM0MsZ0JBQUksRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRTtBQUNyQyxtQkFBTyxFQUFFLEtBQUs7U0FDakIsQ0FBQyxDQUFDOzs7QUFHSCxZQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFDOzs7QUFHL0MsWUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7QUFDdkQsK0JBQW1CLEVBQUU7dUJBQU0sTUFBSyxNQUFNLEVBQUU7YUFBQTtTQUMzQyxDQUFDLENBQUMsQ0FBQztLQUNQOztBQUVELGNBQVUsRUFBQSxzQkFBRztBQUNULFlBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDMUIsWUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM3QixZQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ2hDOztBQUVELGFBQVMsRUFBQSxxQkFBRztBQUNSLGVBQU87QUFDSCw4QkFBa0IsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRTtTQUNyRCxDQUFDO0tBQ0w7O0FBRUQsVUFBTSxFQUFBLGtCQUFHO0FBQ0wsZUFBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ3RDLGVBQ0ksSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsR0FDM0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsR0FDdEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FDeEI7S0FDTDs7QUFFRCxlQUFXLEVBQUEsdUJBQUc7QUFDVixZQUFJLFFBQVEsR0FBRywyQkFBa0IsQ0FBQztBQUNsQyxlQUFPLFFBQVEsQ0FBQztLQUNuQjs7Q0FFSiIsImZpbGUiOiIvaG9tZS9sb2ljLy5hdG9tL3BhY2thZ2VzL3N1cGVyLXZhbGEvbGliL3N1cGVyLXZhbGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IFN1cGVyVmFsYVZpZXcgZnJvbSAnLi9zdXBlci12YWxhLXZpZXcnO1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IFZhbGFQcm92aWRlciBmcm9tICcuL3Byb3ZpZGVyJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gICAgY29uZmlnOiB7XG4gICAgICAgIHZhcGlEaXI6IHtcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgZGVmYXVsdDogJ0M6XFxcXFByb2dyYW1EYXRhXFxcXHZhbGEtMC4yMFxcXFx2YXBpXFxcXCcsXG4gICAgICAgICAgICB0aXRsZTogJ1ZhcGkgZmlsZXMgZGlyZWN0b3J5JyxcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzdXBlclZhbGFWaWV3OiBudWxsLFxuICAgIG1vZGFsUGFuZWw6IG51bGwsXG4gICAgc3Vic2NyaXB0aW9uczogbnVsbCxcblxuICAgIGFjdGl2YXRlKHN0YXRlKSB7XG4gICAgICAgIHRoaXMuc3VwZXJWYWxhVmlldyA9IG5ldyBTdXBlclZhbGFWaWV3KHN0YXRlLnN1cGVyVmFsYVZpZXdTdGF0ZSk7XG4gICAgICAgIHRoaXMubW9kYWxQYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoe1xuICAgICAgICAgICAgaXRlbTogdGhpcy5zdXBlclZhbGFWaWV3LmdldEVsZW1lbnQoKSxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEV2ZW50cyBzdWJzY3JpYmVkIHRvIGluIGF0b20ncyBzeXN0ZW0gY2FuIGJlIGVhc2lseSBjbGVhbmVkIHVwIHdpdGggYSBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICAgICAgLy8gUmVnaXN0ZXIgY29tbWFuZCB0aGF0IHRvZ2dsZXMgdGhpcyB2aWV3XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgICAgICAgJ3N1cGVyLXZhbGE6dG9nZ2xlJzogKCkgPT4gdGhpcy50b2dnbGUoKVxuICAgICAgICB9KSk7XG4gICAgfSxcblxuICAgIGRlYWN0aXZhdGUoKSB7XG4gICAgICAgIHRoaXMubW9kYWxQYW5lbC5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgICAgIHRoaXMuc3VwZXJWYWxhVmlldy5kZXN0cm95KCk7XG4gICAgfSxcblxuICAgIHNlcmlhbGl6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN1cGVyVmFsYVZpZXdTdGF0ZTogdGhpcy5zdXBlclZhbGFWaWV3LnNlcmlhbGl6ZSgpXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIHRvZ2dsZSgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1N1cGVyVmFsYSB3YXMgdG9nZ2xlZCEnKTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHRoaXMubW9kYWxQYW5lbC5pc1Zpc2libGUoKSA/XG4gICAgICAgICAgICB0aGlzLm1vZGFsUGFuZWwuaGlkZSgpIDpcbiAgICAgICAgICAgIHRoaXMubW9kYWxQYW5lbC5zaG93KClcbiAgICAgICAgKTtcbiAgICB9LFxuXG4gICAgZ2V0UHJvdmlkZXIoKSB7XG4gICAgICAgIHZhciBwcm92aWRlciA9IG5ldyBWYWxhUHJvdmlkZXIoKTtcbiAgICAgICAgcmV0dXJuIHByb3ZpZGVyO1xuICAgIH1cblxufTtcbiJdfQ==
//# sourceURL=/home/loic/.atom/packages/super-vala/lib/super-vala.js
