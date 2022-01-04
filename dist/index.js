"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@babel/core");
var core_2 = require("@svgr/core");
var svgo_1 = require("svgo");
var fs_1 = require("fs");
var preset_react_1 = require("@babel/preset-react");
var preset_env_1 = require("@babel/preset-env");
var plugin_transform_react_constant_elements_1 = require("@babel/plugin-transform-react-constant-elements");
module.exports = function (_snowpackConfig, _pluginOptions) {
    return {
        name: "snowpack-svgr-plugin",
        resolve: {
            input: [".svg"],
            output: [".js"],
        },
        load: function (_a) {
            var filePath = _a.filePath;
            return __awaiter(this, void 0, void 0, function () {
                var contents, optimized, code, babelOptions, babelConfig, transformOptions, result;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, fs_1.promises.readFile(filePath, "utf-8")];
                        case 1:
                            contents = _b.sent();
                            optimized = (0, svgo_1.optimize)(contents);
                            return [4 /*yield*/, (0, core_2.transform)(optimized.data, {
                                    icon: true,
                                    exportType: "named",
                                }, { componentName: "ReactComponent" })];
                        case 2:
                            code = _b.sent();
                            babelOptions = {
                                babelrc: false,
                                configFile: false,
                                presets: [
                                    (0, core_1.createConfigItem)(preset_react_1.default, { type: "preset" }),
                                    (0, core_1.createConfigItem)([preset_env_1.default, { modules: false }], { type: "preset" }),
                                ],
                                plugins: [(0, core_1.createConfigItem)(plugin_transform_react_constant_elements_1.default)],
                            };
                            babelConfig = (0, core_1.loadPartialConfig)(__assign({ filename: filePath }, babelOptions));
                            transformOptions = babelConfig === null || babelConfig === void 0 ? void 0 : babelConfig.options;
                            return [4 /*yield*/, (0, core_1.transformAsync)(code, transformOptions)];
                        case 3:
                            result = (_b.sent()) || {};
                            return [2 /*return*/, "\n      ".concat(result.code, "\n      const _svg = ").concat(optimized.data, ";\n      export default _svg;\n      ")];
                    }
                });
            });
        },
    };
};
