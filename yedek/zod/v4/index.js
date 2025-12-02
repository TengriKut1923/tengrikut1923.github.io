import z4 from "./classic/index.js";
export * from "./classic/index.js";
export default z4;

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
export const ZodPipeline = (typeof z !== 'undefined' && z['ZodPipeline']) ? z['ZodPipeline'] : {};
export const ZodEffects = (typeof z !== 'undefined' && z['ZodEffects']) ? z['ZodEffects'] : {};
export const ZodVoid = (typeof z !== 'undefined' && z['ZodVoid']) ? z['ZodVoid'] : {};
export const ZodUndefined = (typeof z !== 'undefined' && z['ZodUndefined']) ? z['ZodUndefined'] : {};
export const ZodBigInt = (typeof z !== 'undefined' && z['ZodBigInt']) ? z['ZodBigInt'] : {};
export const ZodSymbol = (typeof z !== 'undefined' && z['ZodSymbol']) ? z['ZodSymbol'] : {};
export const ZodFunction = (typeof z !== 'undefined' && z['ZodFunction']) ? z['ZodFunction'] : {};
