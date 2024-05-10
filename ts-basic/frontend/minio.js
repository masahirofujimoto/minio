"use strict";
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.get_data_url = exports.get_object_name = void 0;
var Minio = require("minio");
var endpoint = process.env.ENDPOINT;
var useSSL = process.env.USESSL === 'true';
var accessKey = process.env.ACCESS_KEY;
var secretKey = process.env.SECRET_ACCESS_KEY;
var minioClient = new Minio.Client({
    endPoint: endpoint,
    useSSL: useSSL,
    accessKey: accessKey,
    secretKey: secretKey,
});
//バケット内に存在するオブジェクト名の一覧を取得する
var get_object_name = function () {
    return new Promise(function (resolve, reject) {
        var objectNames = [];
        var stream = minioClient.listObjectsV2('images', '', true, '');
        stream.on('data', function (obj) {
            if (obj.name !== undefined) {
                objectNames.push(obj.name);
            }
        });
        stream.on('end', function () {
            resolve(objectNames);
        });
        stream.on('error', function (err) {
            reject(err);
        });
    });
};
exports.get_object_name = get_object_name;
//バケット内のオブジェクトにアクセスするためのURLを発行する
var get_data_url = function () { return __awaiter(void 0, void 0, void 0, function () {
    var urls, objectNames, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                urls = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, (0, exports.get_object_name)()];
            case 2:
                objectNames = _a.sent();
                console.log(objectNames);
                if (!(objectNames.length > 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, Promise.all(objectNames.map(function (objectName) { return __awaiter(void 0, void 0, void 0, function () {
                        var data_name, presignedUrl;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    data_name = objectName;
                                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                                            minioClient.presignedUrl('GET', 'images', "".concat(data_name), 1000, { prefix: 'data', 'max-keys': 500 }, function (err, url) {
                                                if (err) {
                                                    reject(err);
                                                }
                                                else {
                                                    resolve(url);
                                                }
                                            });
                                        })];
                                case 1:
                                    presignedUrl = _a.sent();
                                    urls.push(presignedUrl);
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 3:
                _a.sent();
                return [2 /*return*/, urls];
            case 4: throw new Error('No object names available.');
            case 5: return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                throw error_1;
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.get_data_url = get_data_url;
