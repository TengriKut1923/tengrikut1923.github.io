"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = __importDefault(require("./classic/index.cjs"));
__exportStar(require("./classic/index.cjs"), exports);
exports.default = index_js_1.default;

    // [ASTRO PATCH] Miniflare Polyfill & Returns Shim
    (function() {
      try {
        var _z = (typeof z !== 'undefined') ? z : (typeof module !== 'undefined' ? module.exports : {});
        
        // Miniflare types
        if (_z && typeof _z.string === 'function') {
             if (!_z.ostring) _z.ostring = function() { return _z.string().optional(); };
             if (!_z.onumber) _z.onumber = function() { return _z.number().optional(); };
             if (!_z.oboolean) _z.oboolean = function() { return _z.boolean().optional(); };
        }

        // Returns Shim for ZodFunction
        if (_z && _z.ZodFunction && _z.ZodFunction.prototype) {
             if (!_z.ZodFunction.prototype.returns) {
                 _z.ZodFunction.prototype.returns = function(returnType) { 
                     return this.args().returns(returnType); // Mock implementation or just return this
                 };
             }
        }
      } catch (e) {}
    })();
             // [ASTRO PATCH] Exports
             (function() {
               var keys = ["ZodPipeline","ZodEffects","ZodVoid","ZodUndefined","ZodBigInt","ZodSymbol","ZodFunction"];
               var _z = (typeof z !== 'undefined') ? z : (module.exports || {});
               keys.forEach(function(key) {
                 try { if (!(key in exports)) exports[key] = (_z[key] || {}); } catch(e) {}
               });
             })();
             