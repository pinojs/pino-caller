"use strict";
function _makeCallSiteGetter(pinoInstance, level) {
    return function () {
        var child = pinoInstance.child({
            caller: Error().stack.split('\n')[2].trim().replace('at ', '')
        });
        return child[level].apply(child, arguments);
    };
}
function traceCaller(pinoInstance) {
    var facade = Object.create(pinoInstance);
    Object.keys(pinoInstance.levels.values).forEach(function (level) {
        facade[level] = _makeCallSiteGetter(pinoInstance, level);
    });
    return facade;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = traceCaller;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBS0EsNkJBQThCLFlBQWtCLEVBQUUsS0FBYTtJQUMzRCxNQUFNLENBQUM7UUFDSCxJQUFNLEtBQUssR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDO1lBQzdCLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDO1NBQ2pFLENBQUMsQ0FBQTtRQUVGLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQTtJQUMvQyxDQUFDLENBQUE7QUFDTCxDQUFDO0FBRUQscUJBQW9DLFlBQWtCO0lBQ2xELElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUE7SUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFTLEtBQWE7UUFDbEUsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLG1CQUFtQixDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQTtJQUM1RCxDQUFDLENBQUMsQ0FBQTtJQUVGLE1BQU0sQ0FBQyxNQUFNLENBQUE7QUFDakIsQ0FBQzs7QUFQRCw4QkFPQyJ9