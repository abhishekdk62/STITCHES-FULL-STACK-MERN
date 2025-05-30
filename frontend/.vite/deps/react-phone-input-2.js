import { require_react } from './chunk-YLDSBLSF.js';
import { __commonJS } from './chunk-DC5AMYBS.js';

// node_modules/react-phone-input-2/lib/lib.js
var require_lib = __commonJS({
  'node_modules/react-phone-input-2/lib/lib.js'(exports, module) {
    module.exports = (function (e) {
      var t = {};
      function r(n) {
        if (t[n]) return t[n].exports;
        var a = (t[n] = { i: n, l: false, exports: {} });
        return e[n].call(a.exports, a, a.exports, r), (a.l = true), a.exports;
      }
      return (
        (r.m = e),
        (r.c = t),
        (r.d = function (e2, t2, n) {
          r.o(e2, t2) ||
            Object.defineProperty(e2, t2, { enumerable: true, get: n });
        }),
        (r.r = function (e2) {
          'undefined' != typeof Symbol &&
            Symbol.toStringTag &&
            Object.defineProperty(e2, Symbol.toStringTag, { value: 'Module' }),
            Object.defineProperty(e2, '__esModule', { value: true });
        }),
        (r.t = function (e2, t2) {
          if ((1 & t2 && (e2 = r(e2)), 8 & t2)) return e2;
          if (4 & t2 && 'object' == typeof e2 && e2 && e2.__esModule) return e2;
          var n = /* @__PURE__ */ Object.create(null);
          if (
            (r.r(n),
            Object.defineProperty(n, 'default', {
              enumerable: true,
              value: e2,
            }),
            2 & t2 && 'string' != typeof e2)
          )
            for (var a in e2)
              r.d(
                n,
                a,
                function (t3) {
                  return e2[t3];
                }.bind(null, a)
              );
          return n;
        }),
        (r.n = function (e2) {
          var t2 =
            e2 && e2.__esModule
              ? function () {
                  return e2.default;
                }
              : function () {
                  return e2;
                };
          return r.d(t2, 'a', t2), t2;
        }),
        (r.o = function (e2, t2) {
          return Object.prototype.hasOwnProperty.call(e2, t2);
        }),
        (r.p = ''),
        r((r.s = 9))
      );
    })([
      function (e, t) {
        e.exports = require_react();
      },
      function (e, t, r) {
        var n;
        !(function () {
          'use strict';
          var r2 = {}.hasOwnProperty;
          function a() {
            for (var e2 = [], t2 = 0; t2 < arguments.length; t2++) {
              var n2 = arguments[t2];
              if (n2) {
                var o = typeof n2;
                if ('string' === o || 'number' === o) e2.push(n2);
                else if (Array.isArray(n2) && n2.length) {
                  var i = a.apply(null, n2);
                  i && e2.push(i);
                } else if ('object' === o)
                  for (var u in n2) r2.call(n2, u) && n2[u] && e2.push(u);
              }
            }
            return e2.join(' ');
          }
          e.exports
            ? ((a.default = a), (e.exports = a))
            : void 0 ===
                (n = function () {
                  return a;
                }.apply(t, [])) || (e.exports = n);
        })();
      },
      function (e, t, r) {
        (function (t2) {
          var r2 = /^\s+|\s+$/g,
            n = /^[-+]0x[0-9a-f]+$/i,
            a = /^0b[01]+$/i,
            o = /^0o[0-7]+$/i,
            i = parseInt,
            u = 'object' == typeof t2 && t2 && t2.Object === Object && t2,
            c =
              'object' == typeof self && self && self.Object === Object && self,
            s = u || c || Function('return this')(),
            l = Object.prototype.toString,
            f = s.Symbol,
            d = f ? f.prototype : void 0,
            p = d ? d.toString : void 0;
          function h(e2) {
            if ('string' == typeof e2) return e2;
            if (y(e2)) return p ? p.call(e2) : '';
            var t3 = e2 + '';
            return '0' == t3 && 1 / e2 == -1 / 0 ? '-0' : t3;
          }
          function m(e2) {
            var t3 = typeof e2;
            return !!e2 && ('object' == t3 || 'function' == t3);
          }
          function y(e2) {
            return (
              'symbol' == typeof e2 ||
              /* @__PURE__ */ ((function (e3) {
                return !!e3 && 'object' == typeof e3;
              })(e2) &&
                '[object Symbol]' == l.call(e2))
            );
          }
          function b(e2) {
            return e2
              ? (e2 = (function (e3) {
                  if ('number' == typeof e3) return e3;
                  if (y(e3)) return NaN;
                  if (m(e3)) {
                    var t3 =
                      'function' == typeof e3.valueOf ? e3.valueOf() : e3;
                    e3 = m(t3) ? t3 + '' : t3;
                  }
                  if ('string' != typeof e3) return 0 === e3 ? e3 : +e3;
                  e3 = e3.replace(r2, '');
                  var u2 = a.test(e3);
                  return u2 || o.test(e3)
                    ? i(e3.slice(2), u2 ? 2 : 8)
                    : n.test(e3)
                      ? NaN
                      : +e3;
                })(e2)) ===
                  1 / 0 || e2 === -1 / 0
                ? 17976931348623157e292 * (e2 < 0 ? -1 : 1)
                : e2 == e2
                  ? e2
                  : 0
              : 0 === e2
                ? e2
                : 0;
          }
          e.exports = function (e2, t3, r3) {
            var n2, a2, o2, i2;
            return (
              (e2 = null == (n2 = e2) ? '' : h(n2)),
              (a2 = (function (e3) {
                var t4 = b(e3),
                  r4 = t4 % 1;
                return t4 == t4 ? (r4 ? t4 - r4 : t4) : 0;
              })(r3)),
              (o2 = 0),
              (i2 = e2.length),
              a2 == a2 &&
                (void 0 !== i2 && (a2 = a2 <= i2 ? a2 : i2),
                void 0 !== o2 && (a2 = a2 >= o2 ? a2 : o2)),
              (r3 = a2),
              (t3 = h(t3)),
              e2.slice(r3, r3 + t3.length) == t3
            );
          };
        }).call(this, r(3));
      },
      function (e, t) {
        var r;
        r = /* @__PURE__ */ (function () {
          return this;
        })();
        try {
          r = r || new Function('return this')();
        } catch (e2) {
          'object' == typeof window && (r = window);
        }
        e.exports = r;
      },
      function (e, t, r) {
        (function (t2) {
          var r2 = /^\[object .+?Constructor\]$/,
            n = 'object' == typeof t2 && t2 && t2.Object === Object && t2,
            a =
              'object' == typeof self && self && self.Object === Object && self,
            o = n || a || Function('return this')();
          var i,
            u = Array.prototype,
            c = Function.prototype,
            s = Object.prototype,
            l = o['__core-js_shared__'],
            f = (i = /[^.]+$/.exec((l && l.keys && l.keys.IE_PROTO) || ''))
              ? 'Symbol(src)_1.' + i
              : '',
            d = c.toString,
            p = s.hasOwnProperty,
            h = s.toString,
            m = RegExp(
              '^' +
                d
                  .call(p)
                  .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
                  .replace(
                    /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
                    '$1.*?'
                  ) +
                '$'
            ),
            y = u.splice,
            b = x(o, 'Map'),
            g = x(Object, 'create');
          function v(e2) {
            var t3 = -1,
              r3 = e2 ? e2.length : 0;
            for (this.clear(); ++t3 < r3; ) {
              var n2 = e2[t3];
              this.set(n2[0], n2[1]);
            }
          }
          function C(e2) {
            var t3 = -1,
              r3 = e2 ? e2.length : 0;
            for (this.clear(); ++t3 < r3; ) {
              var n2 = e2[t3];
              this.set(n2[0], n2[1]);
            }
          }
          function _(e2) {
            var t3 = -1,
              r3 = e2 ? e2.length : 0;
            for (this.clear(); ++t3 < r3; ) {
              var n2 = e2[t3];
              this.set(n2[0], n2[1]);
            }
          }
          function w(e2, t3) {
            for (var r3, n2, a2 = e2.length; a2--; )
              if ((r3 = e2[a2][0]) === (n2 = t3) || (r3 != r3 && n2 != n2))
                return a2;
            return -1;
          }
          function S(e2) {
            return (
              !(!O(e2) || ((t3 = e2), f && f in t3)) &&
              ((function (e3) {
                var t4 = O(e3) ? h.call(e3) : '';
                return (
                  '[object Function]' == t4 ||
                  '[object GeneratorFunction]' == t4
                );
              })(e2) ||
              (function (e3) {
                var t4 = false;
                if (null != e3 && 'function' != typeof e3.toString)
                  try {
                    t4 = !!(e3 + '');
                  } catch (e4) {}
                return t4;
              })(e2)
                ? m
                : r2
              ).test(
                (function (e3) {
                  if (null != e3) {
                    try {
                      return d.call(e3);
                    } catch (e4) {}
                    try {
                      return e3 + '';
                    } catch (e4) {}
                  }
                  return '';
                })(e2)
              )
            );
            var t3;
          }
          function j(e2, t3) {
            var r3,
              n2,
              a2 = e2.__data__;
            return (
              'string' == (n2 = typeof (r3 = t3)) ||
              'number' == n2 ||
              'symbol' == n2 ||
              'boolean' == n2
                ? '__proto__' !== r3
                : null === r3
            )
              ? a2['string' == typeof t3 ? 'string' : 'hash']
              : a2.map;
          }
          function x(e2, t3) {
            var r3 = (function (e3, t4) {
              return null == e3 ? void 0 : e3[t4];
            })(e2, t3);
            return S(r3) ? r3 : void 0;
          }
          function N(e2, t3) {
            if ('function' != typeof e2 || (t3 && 'function' != typeof t3))
              throw new TypeError('Expected a function');
            var r3 = function () {
              var n2 = arguments,
                a2 = t3 ? t3.apply(this, n2) : n2[0],
                o2 = r3.cache;
              if (o2.has(a2)) return o2.get(a2);
              var i2 = e2.apply(this, n2);
              return (r3.cache = o2.set(a2, i2)), i2;
            };
            return (r3.cache = new (N.Cache || _)()), r3;
          }
          function O(e2) {
            var t3 = typeof e2;
            return !!e2 && ('object' == t3 || 'function' == t3);
          }
          (v.prototype.clear = function () {
            this.__data__ = g ? g(null) : {};
          }),
            (v.prototype.delete = function (e2) {
              return this.has(e2) && delete this.__data__[e2];
            }),
            (v.prototype.get = function (e2) {
              var t3 = this.__data__;
              if (g) {
                var r3 = t3[e2];
                return '__lodash_hash_undefined__' === r3 ? void 0 : r3;
              }
              return p.call(t3, e2) ? t3[e2] : void 0;
            }),
            (v.prototype.has = function (e2) {
              var t3 = this.__data__;
              return g ? void 0 !== t3[e2] : p.call(t3, e2);
            }),
            (v.prototype.set = function (e2, t3) {
              return (
                (this.__data__[e2] =
                  g && void 0 === t3 ? '__lodash_hash_undefined__' : t3),
                this
              );
            }),
            (C.prototype.clear = function () {
              this.__data__ = [];
            }),
            (C.prototype.delete = function (e2) {
              var t3 = this.__data__,
                r3 = w(t3, e2);
              return (
                !(r3 < 0) &&
                (r3 == t3.length - 1 ? t3.pop() : y.call(t3, r3, 1), true)
              );
            }),
            (C.prototype.get = function (e2) {
              var t3 = this.__data__,
                r3 = w(t3, e2);
              return r3 < 0 ? void 0 : t3[r3][1];
            }),
            (C.prototype.has = function (e2) {
              return w(this.__data__, e2) > -1;
            }),
            (C.prototype.set = function (e2, t3) {
              var r3 = this.__data__,
                n2 = w(r3, e2);
              return n2 < 0 ? r3.push([e2, t3]) : (r3[n2][1] = t3), this;
            }),
            (_.prototype.clear = function () {
              this.__data__ = {
                hash: new v(),
                map: new (b || C)(),
                string: new v(),
              };
            }),
            (_.prototype.delete = function (e2) {
              return j(this, e2).delete(e2);
            }),
            (_.prototype.get = function (e2) {
              return j(this, e2).get(e2);
            }),
            (_.prototype.has = function (e2) {
              return j(this, e2).has(e2);
            }),
            (_.prototype.set = function (e2, t3) {
              return j(this, e2).set(e2, t3), this;
            }),
            (N.Cache = _),
            (e.exports = N);
        }).call(this, r(3));
      },
      function (e, t, r) {
        (function (t2) {
          var r2 = /^\s+|\s+$/g,
            n = /^[-+]0x[0-9a-f]+$/i,
            a = /^0b[01]+$/i,
            o = /^0o[0-7]+$/i,
            i = parseInt,
            u = 'object' == typeof t2 && t2 && t2.Object === Object && t2,
            c =
              'object' == typeof self && self && self.Object === Object && self,
            s = u || c || Function('return this')(),
            l = Object.prototype.toString,
            f = Math.max,
            d = Math.min,
            p = function () {
              return s.Date.now();
            };
          function h(e2) {
            var t3 = typeof e2;
            return !!e2 && ('object' == t3 || 'function' == t3);
          }
          function m(e2) {
            if ('number' == typeof e2) return e2;
            if (
              (function (e3) {
                return (
                  'symbol' == typeof e3 ||
                  /* @__PURE__ */ ((function (e4) {
                    return !!e4 && 'object' == typeof e4;
                  })(e3) &&
                    '[object Symbol]' == l.call(e3))
                );
              })(e2)
            )
              return NaN;
            if (h(e2)) {
              var t3 = 'function' == typeof e2.valueOf ? e2.valueOf() : e2;
              e2 = h(t3) ? t3 + '' : t3;
            }
            if ('string' != typeof e2) return 0 === e2 ? e2 : +e2;
            e2 = e2.replace(r2, '');
            var u2 = a.test(e2);
            return u2 || o.test(e2)
              ? i(e2.slice(2), u2 ? 2 : 8)
              : n.test(e2)
                ? NaN
                : +e2;
          }
          e.exports = function (e2, t3, r3) {
            var n2,
              a2,
              o2,
              i2,
              u2,
              c2,
              s2 = 0,
              l2 = false,
              y = false,
              b = true;
            if ('function' != typeof e2)
              throw new TypeError('Expected a function');
            function g(t4) {
              var r4 = n2,
                o3 = a2;
              return (n2 = a2 = void 0), (s2 = t4), (i2 = e2.apply(o3, r4));
            }
            function v(e3) {
              return (s2 = e3), (u2 = setTimeout(_, t3)), l2 ? g(e3) : i2;
            }
            function C(e3) {
              var r4 = e3 - c2;
              return (
                void 0 === c2 || r4 >= t3 || r4 < 0 || (y && e3 - s2 >= o2)
              );
            }
            function _() {
              var e3 = p();
              if (C(e3)) return w(e3);
              u2 = setTimeout(
                _,
                (function (e4) {
                  var r4 = t3 - (e4 - c2);
                  return y ? d(r4, o2 - (e4 - s2)) : r4;
                })(e3)
              );
            }
            function w(e3) {
              return (u2 = void 0), b && n2 ? g(e3) : ((n2 = a2 = void 0), i2);
            }
            function S() {
              var e3 = p(),
                r4 = C(e3);
              if (((n2 = arguments), (a2 = this), (c2 = e3), r4)) {
                if (void 0 === u2) return v(c2);
                if (y) return (u2 = setTimeout(_, t3)), g(c2);
              }
              return void 0 === u2 && (u2 = setTimeout(_, t3)), i2;
            }
            return (
              (t3 = m(t3) || 0),
              h(r3) &&
                ((l2 = !!r3.leading),
                (o2 = (y = 'maxWait' in r3) ? f(m(r3.maxWait) || 0, t3) : o2),
                (b = 'trailing' in r3 ? !!r3.trailing : b)),
              (S.cancel = function () {
                void 0 !== u2 && clearTimeout(u2),
                  (s2 = 0),
                  (n2 = c2 = a2 = u2 = void 0);
              }),
              (S.flush = function () {
                return void 0 === u2 ? i2 : w(p());
              }),
              S
            );
          };
        }).call(this, r(3));
      },
      function (e, t, r) {
        (function (e2, r2) {
          var n = '[object Arguments]',
            a = '[object Map]',
            o = '[object Object]',
            i = '[object Set]',
            u = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
            c = /^\w*$/,
            s = /^\./,
            l =
              /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
            f = /\\(\\)?/g,
            d = /^\[object .+?Constructor\]$/,
            p = /^(?:0|[1-9]\d*)$/,
            h = {};
          (h['[object Float32Array]'] =
            h['[object Float64Array]'] =
            h['[object Int8Array]'] =
            h['[object Int16Array]'] =
            h['[object Int32Array]'] =
            h['[object Uint8Array]'] =
            h['[object Uint8ClampedArray]'] =
            h['[object Uint16Array]'] =
            h['[object Uint32Array]'] =
              true),
            (h[n] =
              h['[object Array]'] =
              h['[object ArrayBuffer]'] =
              h['[object Boolean]'] =
              h['[object DataView]'] =
              h['[object Date]'] =
              h['[object Error]'] =
              h['[object Function]'] =
              h[a] =
              h['[object Number]'] =
              h[o] =
              h['[object RegExp]'] =
              h[i] =
              h['[object String]'] =
              h['[object WeakMap]'] =
                false);
          var m = 'object' == typeof e2 && e2 && e2.Object === Object && e2,
            y =
              'object' == typeof self && self && self.Object === Object && self,
            b = m || y || Function('return this')(),
            g = t && !t.nodeType && t,
            v = g && 'object' == typeof r2 && r2 && !r2.nodeType && r2,
            C = v && v.exports === g && m.process,
            _ = (function () {
              try {
                return C && C.binding('util');
              } catch (e3) {}
            })(),
            w = _ && _.isTypedArray;
          function S(e3, t2, r3, n2) {
            var a2 = -1,
              o2 = e3 ? e3.length : 0;
            for (n2 && o2 && (r3 = e3[++a2]); ++a2 < o2; )
              r3 = t2(r3, e3[a2], a2, e3);
            return r3;
          }
          function j(e3, t2) {
            for (var r3 = -1, n2 = e3 ? e3.length : 0; ++r3 < n2; )
              if (t2(e3[r3], r3, e3)) return true;
            return false;
          }
          function x(e3, t2, r3, n2, a2) {
            return (
              a2(e3, function (e4, a3, o2) {
                r3 = n2 ? ((n2 = false), e4) : t2(r3, e4, a3, o2);
              }),
              r3
            );
          }
          function N(e3) {
            var t2 = false;
            if (null != e3 && 'function' != typeof e3.toString)
              try {
                t2 = !!(e3 + '');
              } catch (e4) {}
            return t2;
          }
          function O(e3) {
            var t2 = -1,
              r3 = Array(e3.size);
            return (
              e3.forEach(function (e4, n2) {
                r3[++t2] = [n2, e4];
              }),
              r3
            );
          }
          function k(e3) {
            var t2 = -1,
              r3 = Array(e3.size);
            return (
              e3.forEach(function (e4) {
                r3[++t2] = e4;
              }),
              r3
            );
          }
          var E,
            T,
            I,
            A = Array.prototype,
            D = Function.prototype,
            P = Object.prototype,
            F = b['__core-js_shared__'],
            M = (E = /[^.]+$/.exec((F && F.keys && F.keys.IE_PROTO) || ''))
              ? 'Symbol(src)_1.' + E
              : '',
            R = D.toString,
            L = P.hasOwnProperty,
            z = P.toString,
            B = RegExp(
              '^' +
                R.call(L)
                  .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
                  .replace(
                    /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
                    '$1.*?'
                  ) +
                '$'
            ),
            G = b.Symbol,
            $ = b.Uint8Array,
            V = P.propertyIsEnumerable,
            K = A.splice,
            U =
              ((T = Object.keys),
              (I = Object),
              function (e3) {
                return T(I(e3));
              }),
            q = Ne(b, 'DataView'),
            H = Ne(b, 'Map'),
            W = Ne(b, 'Promise'),
            J = Ne(b, 'Set'),
            Z = Ne(b, 'WeakMap'),
            Q = Ne(Object, 'create'),
            Y = Pe(q),
            X = Pe(H),
            ee = Pe(W),
            te = Pe(J),
            re = Pe(Z),
            ne = G ? G.prototype : void 0,
            ae = ne ? ne.valueOf : void 0,
            oe = ne ? ne.toString : void 0;
          function ie(e3) {
            var t2 = -1,
              r3 = e3 ? e3.length : 0;
            for (this.clear(); ++t2 < r3; ) {
              var n2 = e3[t2];
              this.set(n2[0], n2[1]);
            }
          }
          function ue(e3) {
            var t2 = -1,
              r3 = e3 ? e3.length : 0;
            for (this.clear(); ++t2 < r3; ) {
              var n2 = e3[t2];
              this.set(n2[0], n2[1]);
            }
          }
          function ce(e3) {
            var t2 = -1,
              r3 = e3 ? e3.length : 0;
            for (this.clear(); ++t2 < r3; ) {
              var n2 = e3[t2];
              this.set(n2[0], n2[1]);
            }
          }
          function se(e3) {
            var t2 = -1,
              r3 = e3 ? e3.length : 0;
            for (this.__data__ = new ce(); ++t2 < r3; ) this.add(e3[t2]);
          }
          function le(e3) {
            this.__data__ = new ue(e3);
          }
          function fe(e3, t2) {
            var r3 =
                Le(e3) || Re(e3)
                  ? (function (e4, t3) {
                      for (var r4 = -1, n3 = Array(e4); ++r4 < e4; )
                        n3[r4] = t3(r4);
                      return n3;
                    })(e3.length, String)
                  : [],
              n2 = r3.length,
              a2 = !!n2;
            for (var o2 in e3)
              (!t2 && !L.call(e3, o2)) ||
                (a2 && ('length' == o2 || ke(o2, n2))) ||
                r3.push(o2);
            return r3;
          }
          function de(e3, t2) {
            for (var r3 = e3.length; r3--; ) if (Me(e3[r3][0], t2)) return r3;
            return -1;
          }
          (ie.prototype.clear = function () {
            this.__data__ = Q ? Q(null) : {};
          }),
            (ie.prototype.delete = function (e3) {
              return this.has(e3) && delete this.__data__[e3];
            }),
            (ie.prototype.get = function (e3) {
              var t2 = this.__data__;
              if (Q) {
                var r3 = t2[e3];
                return '__lodash_hash_undefined__' === r3 ? void 0 : r3;
              }
              return L.call(t2, e3) ? t2[e3] : void 0;
            }),
            (ie.prototype.has = function (e3) {
              var t2 = this.__data__;
              return Q ? void 0 !== t2[e3] : L.call(t2, e3);
            }),
            (ie.prototype.set = function (e3, t2) {
              return (
                (this.__data__[e3] =
                  Q && void 0 === t2 ? '__lodash_hash_undefined__' : t2),
                this
              );
            }),
            (ue.prototype.clear = function () {
              this.__data__ = [];
            }),
            (ue.prototype.delete = function (e3) {
              var t2 = this.__data__,
                r3 = de(t2, e3);
              return (
                !(r3 < 0) &&
                (r3 == t2.length - 1 ? t2.pop() : K.call(t2, r3, 1), true)
              );
            }),
            (ue.prototype.get = function (e3) {
              var t2 = this.__data__,
                r3 = de(t2, e3);
              return r3 < 0 ? void 0 : t2[r3][1];
            }),
            (ue.prototype.has = function (e3) {
              return de(this.__data__, e3) > -1;
            }),
            (ue.prototype.set = function (e3, t2) {
              var r3 = this.__data__,
                n2 = de(r3, e3);
              return n2 < 0 ? r3.push([e3, t2]) : (r3[n2][1] = t2), this;
            }),
            (ce.prototype.clear = function () {
              this.__data__ = {
                hash: new ie(),
                map: new (H || ue)(),
                string: new ie(),
              };
            }),
            (ce.prototype.delete = function (e3) {
              return xe(this, e3).delete(e3);
            }),
            (ce.prototype.get = function (e3) {
              return xe(this, e3).get(e3);
            }),
            (ce.prototype.has = function (e3) {
              return xe(this, e3).has(e3);
            }),
            (ce.prototype.set = function (e3, t2) {
              return xe(this, e3).set(e3, t2), this;
            }),
            (se.prototype.add = se.prototype.push =
              function (e3) {
                return this.__data__.set(e3, '__lodash_hash_undefined__'), this;
              }),
            (se.prototype.has = function (e3) {
              return this.__data__.has(e3);
            }),
            (le.prototype.clear = function () {
              this.__data__ = new ue();
            }),
            (le.prototype.delete = function (e3) {
              return this.__data__.delete(e3);
            }),
            (le.prototype.get = function (e3) {
              return this.__data__.get(e3);
            }),
            (le.prototype.has = function (e3) {
              return this.__data__.has(e3);
            }),
            (le.prototype.set = function (e3, t2) {
              var r3 = this.__data__;
              if (r3 instanceof ue) {
                var n2 = r3.__data__;
                if (!H || n2.length < 199) return n2.push([e3, t2]), this;
                r3 = this.__data__ = new ce(n2);
              }
              return r3.set(e3, t2), this;
            });
          var pe,
            he,
            me =
              ((pe = function (e3, t2) {
                return e3 && ye(e3, t2, qe);
              }),
              function (e3, t2) {
                if (null == e3) return e3;
                if (!ze(e3)) return pe(e3, t2);
                for (
                  var r3 = e3.length, n2 = he ? r3 : -1, a2 = Object(e3);
                  (he ? n2-- : ++n2 < r3) && false !== t2(a2[n2], n2, a2);

                );
                return e3;
              }),
            ye = /* @__PURE__ */ (function (e3) {
              return function (t2, r3, n2) {
                for (
                  var a2 = -1, o2 = Object(t2), i2 = n2(t2), u2 = i2.length;
                  u2--;

                ) {
                  var c2 = i2[e3 ? u2 : ++a2];
                  if (false === r3(o2[c2], c2, o2)) break;
                }
                return t2;
              };
            })();
          function be(e3, t2) {
            for (
              var r3 = 0, n2 = (t2 = Ee(t2, e3) ? [t2] : Se(t2)).length;
              null != e3 && r3 < n2;

            )
              e3 = e3[De(t2[r3++])];
            return r3 && r3 == n2 ? e3 : void 0;
          }
          function ge(e3, t2) {
            return null != e3 && t2 in Object(e3);
          }
          function ve(e3, t2, r3, u2, c2) {
            return (
              e3 === t2 ||
              (null == e3 || null == t2 || (!$e(e3) && !Ve(t2))
                ? e3 != e3 && t2 != t2
                : (function (e4, t3, r4, u3, c3, s2) {
                    var l2 = Le(e4),
                      f2 = Le(t3),
                      d2 = '[object Array]',
                      p2 = '[object Array]';
                    l2 || (d2 = (d2 = Oe(e4)) == n ? o : d2);
                    f2 || (p2 = (p2 = Oe(t3)) == n ? o : p2);
                    var h2 = d2 == o && !N(e4),
                      m2 = p2 == o && !N(t3),
                      y2 = d2 == p2;
                    if (y2 && !h2)
                      return (
                        s2 || (s2 = new le()),
                        l2 || Ue(e4)
                          ? je(e4, t3, r4, u3, c3, s2)
                          : (function (e5, t4, r5, n2, o2, u4, c4) {
                              switch (r5) {
                                case '[object DataView]':
                                  if (
                                    e5.byteLength != t4.byteLength ||
                                    e5.byteOffset != t4.byteOffset
                                  )
                                    return false;
                                  (e5 = e5.buffer), (t4 = t4.buffer);
                                case '[object ArrayBuffer]':
                                  return !(
                                    e5.byteLength != t4.byteLength ||
                                    !n2(new $(e5), new $(t4))
                                  );
                                case '[object Boolean]':
                                case '[object Date]':
                                case '[object Number]':
                                  return Me(+e5, +t4);
                                case '[object Error]':
                                  return (
                                    e5.name == t4.name &&
                                    e5.message == t4.message
                                  );
                                case '[object RegExp]':
                                case '[object String]':
                                  return e5 == t4 + '';
                                case a:
                                  var s3 = O;
                                case i:
                                  var l3 = 2 & u4;
                                  if (
                                    (s3 || (s3 = k), e5.size != t4.size && !l3)
                                  )
                                    return false;
                                  var f3 = c4.get(e5);
                                  if (f3) return f3 == t4;
                                  (u4 |= 1), c4.set(e5, t4);
                                  var d3 = je(s3(e5), s3(t4), n2, o2, u4, c4);
                                  return c4.delete(e5), d3;
                                case '[object Symbol]':
                                  if (ae) return ae.call(e5) == ae.call(t4);
                              }
                              return false;
                            })(e4, t3, d2, r4, u3, c3, s2)
                      );
                    if (!(2 & c3)) {
                      var b2 = h2 && L.call(e4, '__wrapped__'),
                        g2 = m2 && L.call(t3, '__wrapped__');
                      if (b2 || g2) {
                        var v2 = b2 ? e4.value() : e4,
                          C2 = g2 ? t3.value() : t3;
                        return s2 || (s2 = new le()), r4(v2, C2, u3, c3, s2);
                      }
                    }
                    if (!y2) return false;
                    return (
                      s2 || (s2 = new le()),
                      (function (e5, t4, r5, n2, a2, o2) {
                        var i2 = 2 & a2,
                          u4 = qe(e5),
                          c4 = u4.length,
                          s3 = qe(t4).length;
                        if (c4 != s3 && !i2) return false;
                        var l3 = c4;
                        for (; l3--; ) {
                          var f3 = u4[l3];
                          if (!(i2 ? f3 in t4 : L.call(t4, f3))) return false;
                        }
                        var d3 = o2.get(e5);
                        if (d3 && o2.get(t4)) return d3 == t4;
                        var p3 = true;
                        o2.set(e5, t4), o2.set(t4, e5);
                        var h3 = i2;
                        for (; ++l3 < c4; ) {
                          f3 = u4[l3];
                          var m3 = e5[f3],
                            y3 = t4[f3];
                          if (n2)
                            var b3 = i2
                              ? n2(y3, m3, f3, t4, e5, o2)
                              : n2(m3, y3, f3, e5, t4, o2);
                          if (
                            !(void 0 === b3
                              ? m3 === y3 || r5(m3, y3, n2, a2, o2)
                              : b3)
                          ) {
                            p3 = false;
                            break;
                          }
                          h3 || (h3 = 'constructor' == f3);
                        }
                        if (p3 && !h3) {
                          var g3 = e5.constructor,
                            v3 = t4.constructor;
                          g3 == v3 ||
                            !('constructor' in e5) ||
                            !('constructor' in t4) ||
                            ('function' == typeof g3 &&
                              g3 instanceof g3 &&
                              'function' == typeof v3 &&
                              v3 instanceof v3) ||
                            (p3 = false);
                        }
                        return o2.delete(e5), o2.delete(t4), p3;
                      })(e4, t3, r4, u3, c3, s2)
                    );
                  })(e3, t2, ve, r3, u2, c2))
            );
          }
          function Ce(e3) {
            return (
              !(
                !$e(e3) ||
                (function (e4) {
                  return !!M && M in e4;
                })(e3)
              ) && (Be(e3) || N(e3) ? B : d).test(Pe(e3))
            );
          }
          function _e(e3) {
            return 'function' == typeof e3
              ? e3
              : null == e3
                ? He
                : 'object' == typeof e3
                  ? Le(e3)
                    ? (function (e4, t3) {
                        if (Ee(e4) && Te(t3)) return Ie(De(e4), t3);
                        return function (r4) {
                          var n2 = (function (e5, t4, r5) {
                            var n3 = null == e5 ? void 0 : be(e5, t4);
                            return void 0 === n3 ? r5 : n3;
                          })(r4, e4);
                          return void 0 === n2 && n2 === t3
                            ? (function (e5, t4) {
                                return (
                                  null != e5 &&
                                  (function (e6, t5, r5) {
                                    t5 = Ee(t5, e6) ? [t5] : Se(t5);
                                    var n3,
                                      a2 = -1,
                                      o2 = t5.length;
                                    for (; ++a2 < o2; ) {
                                      var i2 = De(t5[a2]);
                                      if (!(n3 = null != e6 && r5(e6, i2)))
                                        break;
                                      e6 = e6[i2];
                                    }
                                    if (n3) return n3;
                                    return (
                                      !!(o2 = e6 ? e6.length : 0) &&
                                      Ge(o2) &&
                                      ke(i2, o2) &&
                                      (Le(e6) || Re(e6))
                                    );
                                  })(e5, t4, ge)
                                );
                              })(r4, e4)
                            : ve(t3, n2, void 0, 3);
                        };
                      })(e3[0], e3[1])
                    : (function (e4) {
                        var t3 = (function (e5) {
                          var t4 = qe(e5),
                            r4 = t4.length;
                          for (; r4--; ) {
                            var n2 = t4[r4],
                              a2 = e5[n2];
                            t4[r4] = [n2, a2, Te(a2)];
                          }
                          return t4;
                        })(e4);
                        if (1 == t3.length && t3[0][2])
                          return Ie(t3[0][0], t3[0][1]);
                        return function (r4) {
                          return (
                            r4 === e4 ||
                            (function (e5, t4, r5, n2) {
                              var a2 = r5.length,
                                o2 = a2,
                                i2 = !n2;
                              if (null == e5) return !o2;
                              for (e5 = Object(e5); a2--; ) {
                                var u2 = r5[a2];
                                if (
                                  i2 && u2[2]
                                    ? u2[1] !== e5[u2[0]]
                                    : !(u2[0] in e5)
                                )
                                  return false;
                              }
                              for (; ++a2 < o2; ) {
                                var c2 = (u2 = r5[a2])[0],
                                  s2 = e5[c2],
                                  l2 = u2[1];
                                if (i2 && u2[2]) {
                                  if (void 0 === s2 && !(c2 in e5))
                                    return false;
                                } else {
                                  var f2 = new le();
                                  if (n2) var d2 = n2(s2, l2, c2, e5, t4, f2);
                                  if (
                                    !(void 0 === d2
                                      ? ve(l2, s2, n2, 3, f2)
                                      : d2)
                                  )
                                    return false;
                                }
                              }
                              return true;
                            })(r4, e4, t3)
                          );
                        };
                      })(e3)
                  : Ee((t2 = e3))
                    ? ((r3 = De(t2)),
                      function (e4) {
                        return null == e4 ? void 0 : e4[r3];
                      })
                    : /* @__PURE__ */ (function (e4) {
                        return function (t3) {
                          return be(t3, e4);
                        };
                      })(t2);
            var t2, r3;
          }
          function we(e3) {
            if (
              ((r3 = (t2 = e3) && t2.constructor),
              (n2 = ('function' == typeof r3 && r3.prototype) || P),
              t2 !== n2)
            )
              return U(e3);
            var t2,
              r3,
              n2,
              a2 = [];
            for (var o2 in Object(e3))
              L.call(e3, o2) && 'constructor' != o2 && a2.push(o2);
            return a2;
          }
          function Se(e3) {
            return Le(e3) ? e3 : Ae(e3);
          }
          function je(e3, t2, r3, n2, a2, o2) {
            var i2 = 2 & a2,
              u2 = e3.length,
              c2 = t2.length;
            if (u2 != c2 && !(i2 && c2 > u2)) return false;
            var s2 = o2.get(e3);
            if (s2 && o2.get(t2)) return s2 == t2;
            var l2 = -1,
              f2 = true,
              d2 = 1 & a2 ? new se() : void 0;
            for (o2.set(e3, t2), o2.set(t2, e3); ++l2 < u2; ) {
              var p2 = e3[l2],
                h2 = t2[l2];
              if (n2)
                var m2 = i2
                  ? n2(h2, p2, l2, t2, e3, o2)
                  : n2(p2, h2, l2, e3, t2, o2);
              if (void 0 !== m2) {
                if (m2) continue;
                f2 = false;
                break;
              }
              if (d2) {
                if (
                  !j(t2, function (e4, t3) {
                    if (!d2.has(t3) && (p2 === e4 || r3(p2, e4, n2, a2, o2)))
                      return d2.add(t3);
                  })
                ) {
                  f2 = false;
                  break;
                }
              } else if (p2 !== h2 && !r3(p2, h2, n2, a2, o2)) {
                f2 = false;
                break;
              }
            }
            return o2.delete(e3), o2.delete(t2), f2;
          }
          function xe(e3, t2) {
            var r3,
              n2,
              a2 = e3.__data__;
            return (
              'string' == (n2 = typeof (r3 = t2)) ||
              'number' == n2 ||
              'symbol' == n2 ||
              'boolean' == n2
                ? '__proto__' !== r3
                : null === r3
            )
              ? a2['string' == typeof t2 ? 'string' : 'hash']
              : a2.map;
          }
          function Ne(e3, t2) {
            var r3 = (function (e4, t3) {
              return null == e4 ? void 0 : e4[t3];
            })(e3, t2);
            return Ce(r3) ? r3 : void 0;
          }
          var Oe = function (e3) {
            return z.call(e3);
          };
          function ke(e3, t2) {
            return (
              !!(t2 = null == t2 ? 9007199254740991 : t2) &&
              ('number' == typeof e3 || p.test(e3)) &&
              e3 > -1 &&
              e3 % 1 == 0 &&
              e3 < t2
            );
          }
          function Ee(e3, t2) {
            if (Le(e3)) return false;
            var r3 = typeof e3;
            return (
              !(
                'number' != r3 &&
                'symbol' != r3 &&
                'boolean' != r3 &&
                null != e3 &&
                !Ke(e3)
              ) ||
              c.test(e3) ||
              !u.test(e3) ||
              (null != t2 && e3 in Object(t2))
            );
          }
          function Te(e3) {
            return e3 == e3 && !$e(e3);
          }
          function Ie(e3, t2) {
            return function (r3) {
              return (
                null != r3 &&
                r3[e3] === t2 &&
                (void 0 !== t2 || e3 in Object(r3))
              );
            };
          }
          ((q && '[object DataView]' != Oe(new q(new ArrayBuffer(1)))) ||
            (H && Oe(new H()) != a) ||
            (W && '[object Promise]' != Oe(W.resolve())) ||
            (J && Oe(new J()) != i) ||
            (Z && '[object WeakMap]' != Oe(new Z()))) &&
            (Oe = function (e3) {
              var t2 = z.call(e3),
                r3 = t2 == o ? e3.constructor : void 0,
                n2 = r3 ? Pe(r3) : void 0;
              if (n2)
                switch (n2) {
                  case Y:
                    return '[object DataView]';
                  case X:
                    return a;
                  case ee:
                    return '[object Promise]';
                  case te:
                    return i;
                  case re:
                    return '[object WeakMap]';
                }
              return t2;
            });
          var Ae = Fe(function (e3) {
            var t2;
            e3 =
              null == (t2 = e3)
                ? ''
                : (function (e4) {
                    if ('string' == typeof e4) return e4;
                    if (Ke(e4)) return oe ? oe.call(e4) : '';
                    var t3 = e4 + '';
                    return '0' == t3 && 1 / e4 == -1 / 0 ? '-0' : t3;
                  })(t2);
            var r3 = [];
            return (
              s.test(e3) && r3.push(''),
              e3.replace(l, function (e4, t3, n2, a2) {
                r3.push(n2 ? a2.replace(f, '$1') : t3 || e4);
              }),
              r3
            );
          });
          function De(e3) {
            if ('string' == typeof e3 || Ke(e3)) return e3;
            var t2 = e3 + '';
            return '0' == t2 && 1 / e3 == -1 / 0 ? '-0' : t2;
          }
          function Pe(e3) {
            if (null != e3) {
              try {
                return R.call(e3);
              } catch (e4) {}
              try {
                return e3 + '';
              } catch (e4) {}
            }
            return '';
          }
          function Fe(e3, t2) {
            if ('function' != typeof e3 || (t2 && 'function' != typeof t2))
              throw new TypeError('Expected a function');
            var r3 = function () {
              var n2 = arguments,
                a2 = t2 ? t2.apply(this, n2) : n2[0],
                o2 = r3.cache;
              if (o2.has(a2)) return o2.get(a2);
              var i2 = e3.apply(this, n2);
              return (r3.cache = o2.set(a2, i2)), i2;
            };
            return (r3.cache = new (Fe.Cache || ce)()), r3;
          }
          function Me(e3, t2) {
            return e3 === t2 || (e3 != e3 && t2 != t2);
          }
          function Re(e3) {
            return (
              (function (e4) {
                return Ve(e4) && ze(e4);
              })(e3) &&
              L.call(e3, 'callee') &&
              (!V.call(e3, 'callee') || z.call(e3) == n)
            );
          }
          Fe.Cache = ce;
          var Le = Array.isArray;
          function ze(e3) {
            return null != e3 && Ge(e3.length) && !Be(e3);
          }
          function Be(e3) {
            var t2 = $e(e3) ? z.call(e3) : '';
            return (
              '[object Function]' == t2 || '[object GeneratorFunction]' == t2
            );
          }
          function Ge(e3) {
            return (
              'number' == typeof e3 &&
              e3 > -1 &&
              e3 % 1 == 0 &&
              e3 <= 9007199254740991
            );
          }
          function $e(e3) {
            var t2 = typeof e3;
            return !!e3 && ('object' == t2 || 'function' == t2);
          }
          function Ve(e3) {
            return !!e3 && 'object' == typeof e3;
          }
          function Ke(e3) {
            return (
              'symbol' == typeof e3 ||
              (Ve(e3) && '[object Symbol]' == z.call(e3))
            );
          }
          var Ue = w
            ? /* @__PURE__ */ (function (e3) {
                return function (t2) {
                  return e3(t2);
                };
              })(w)
            : function (e3) {
                return Ve(e3) && Ge(e3.length) && !!h[z.call(e3)];
              };
          function qe(e3) {
            return ze(e3) ? fe(e3) : we(e3);
          }
          function He(e3) {
            return e3;
          }
          r2.exports = function (e3, t2, r3) {
            var n2 = Le(e3) ? S : x,
              a2 = arguments.length < 3;
            return n2(e3, _e(t2), r3, a2, me);
          };
        }).call(this, r(3), r(7)(e));
      },
      function (e, t) {
        e.exports = function (e2) {
          return (
            e2.webpackPolyfill ||
              ((e2.deprecate = function () {}),
              (e2.paths = []),
              e2.children || (e2.children = []),
              Object.defineProperty(e2, 'loaded', {
                enumerable: true,
                get: function () {
                  return e2.l;
                },
              }),
              Object.defineProperty(e2, 'id', {
                enumerable: true,
                get: function () {
                  return e2.i;
                },
              }),
              (e2.webpackPolyfill = 1)),
            e2
          );
        };
      },
      function (e, t) {
        String.prototype.padEnd ||
          (String.prototype.padEnd = function (e2, t2) {
            return (
              (e2 >>= 0),
              (t2 = String(void 0 !== t2 ? t2 : ' ')),
              this.length > e2
                ? String(this)
                : ((e2 -= this.length) > t2.length &&
                    (t2 += t2.repeat(e2 / t2.length)),
                  String(this) + t2.slice(0, e2))
            );
          });
      },
      function (e, t, r) {
        'use strict';
        function n(e2, t2, r2) {
          return (
            t2 in e2
              ? Object.defineProperty(e2, t2, {
                  value: r2,
                  enumerable: true,
                  configurable: true,
                  writable: true,
                })
              : (e2[t2] = r2),
            e2
          );
        }
        function a(e2) {
          if (
            Symbol.iterator in Object(e2) ||
            '[object Arguments]' === Object.prototype.toString.call(e2)
          )
            return Array.from(e2);
        }
        function o(e2) {
          return (
            (function (e3) {
              if (Array.isArray(e3)) {
                for (
                  var t2 = 0, r2 = new Array(e3.length);
                  t2 < e3.length;
                  t2++
                )
                  r2[t2] = e3[t2];
                return r2;
              }
            })(e2) ||
            a(e2) ||
            (function () {
              throw new TypeError(
                'Invalid attempt to spread non-iterable instance'
              );
            })()
          );
        }
        function i(e2) {
          if (Array.isArray(e2)) return e2;
        }
        function u() {
          throw new TypeError(
            'Invalid attempt to destructure non-iterable instance'
          );
        }
        function c(e2, t2) {
          if (!(e2 instanceof t2))
            throw new TypeError('Cannot call a class as a function');
        }
        function s(e2, t2) {
          for (var r2 = 0; r2 < t2.length; r2++) {
            var n2 = t2[r2];
            (n2.enumerable = n2.enumerable || false),
              (n2.configurable = true),
              'value' in n2 && (n2.writable = true),
              Object.defineProperty(e2, n2.key, n2);
          }
        }
        function l(e2) {
          return (l =
            'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
              ? function (e3) {
                  return typeof e3;
                }
              : function (e3) {
                  return e3 &&
                    'function' == typeof Symbol &&
                    e3.constructor === Symbol &&
                    e3 !== Symbol.prototype
                    ? 'symbol'
                    : typeof e3;
                })(e2);
        }
        function f(e2) {
          return (f =
            'function' == typeof Symbol && 'symbol' === l(Symbol.iterator)
              ? function (e3) {
                  return l(e3);
                }
              : function (e3) {
                  return e3 &&
                    'function' == typeof Symbol &&
                    e3.constructor === Symbol &&
                    e3 !== Symbol.prototype
                    ? 'symbol'
                    : l(e3);
                })(e2);
        }
        function d(e2) {
          if (void 0 === e2)
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called"
            );
          return e2;
        }
        function p(e2) {
          return (p = Object.setPrototypeOf
            ? Object.getPrototypeOf
            : function (e3) {
                return e3.__proto__ || Object.getPrototypeOf(e3);
              })(e2);
        }
        function h(e2, t2) {
          return (h =
            Object.setPrototypeOf ||
            function (e3, t3) {
              return (e3.__proto__ = t3), e3;
            })(e2, t2);
        }
        r.r(t);
        var m = r(0),
          y = r.n(m),
          b = r(5),
          g = r.n(b),
          v = r(4),
          C = r.n(v),
          _ = r(6),
          w = r.n(_),
          S = r(2),
          j = r.n(S),
          x = r(1),
          N = r.n(x);
        r(8);
        function O(e2, t2) {
          return (
            i(e2) ||
            (function (e3, t3) {
              var r2 = [],
                n2 = true,
                a2 = false,
                o2 = void 0;
              try {
                for (
                  var i2, u2 = e3[Symbol.iterator]();
                  !(n2 = (i2 = u2.next()).done) &&
                  (r2.push(i2.value), !t3 || r2.length !== t3);
                  n2 = true
                );
              } catch (e4) {
                (a2 = true), (o2 = e4);
              } finally {
                try {
                  n2 || null == u2.return || u2.return();
                } finally {
                  if (a2) throw o2;
                }
              }
              return r2;
            })(e2, t2) ||
            u()
          );
        }
        var k = [
            ['Afghanistan', ['asia'], 'af', '93'],
            ['Albania', ['europe'], 'al', '355'],
            ['Algeria', ['africa', 'north-africa'], 'dz', '213'],
            ['Andorra', ['europe'], 'ad', '376'],
            ['Angola', ['africa'], 'ao', '244'],
            ['Antigua and Barbuda', ['america', 'carribean'], 'ag', '1268'],
            [
              'Argentina',
              ['america', 'south-america'],
              'ar',
              '54',
              '(..) ........',
              0,
              [
                '11',
                '221',
                '223',
                '261',
                '264',
                '2652',
                '280',
                '2905',
                '291',
                '2920',
                '2966',
                '299',
                '341',
                '342',
                '343',
                '351',
                '376',
                '379',
                '381',
                '3833',
                '385',
                '387',
                '388',
              ],
            ],
            ['Armenia', ['asia', 'ex-ussr'], 'am', '374', '.. ......'],
            ['Aruba', ['america', 'carribean'], 'aw', '297'],
            [
              'Australia',
              ['oceania'],
              'au',
              '61',
              '(..) .... ....',
              0,
              ['2', '3', '4', '7', '8', '02', '03', '04', '07', '08'],
            ],
            ['Austria', ['europe', 'eu-union'], 'at', '43'],
            ['Azerbaijan', ['asia', 'ex-ussr'], 'az', '994', '(..) ... .. ..'],
            ['Bahamas', ['america', 'carribean'], 'bs', '1242'],
            ['Bahrain', ['middle-east'], 'bh', '973'],
            ['Bangladesh', ['asia'], 'bd', '880'],
            ['Barbados', ['america', 'carribean'], 'bb', '1246'],
            ['Belarus', ['europe', 'ex-ussr'], 'by', '375', '(..) ... .. ..'],
            ['Belgium', ['europe', 'eu-union'], 'be', '32', '... .. .. ..'],
            ['Belize', ['america', 'central-america'], 'bz', '501'],
            ['Benin', ['africa'], 'bj', '229'],
            ['Bhutan', ['asia'], 'bt', '975'],
            ['Bolivia', ['america', 'south-america'], 'bo', '591'],
            ['Bosnia and Herzegovina', ['europe', 'ex-yugos'], 'ba', '387'],
            ['Botswana', ['africa'], 'bw', '267'],
            [
              'Brazil',
              ['america', 'south-america'],
              'br',
              '55',
              '(..) .........',
            ],
            ['British Indian Ocean Territory', ['asia'], 'io', '246'],
            ['Brunei', ['asia'], 'bn', '673'],
            ['Bulgaria', ['europe', 'eu-union'], 'bg', '359'],
            ['Burkina Faso', ['africa'], 'bf', '226'],
            ['Burundi', ['africa'], 'bi', '257'],
            ['Cambodia', ['asia'], 'kh', '855'],
            ['Cameroon', ['africa'], 'cm', '237'],
            [
              'Canada',
              ['america', 'north-america'],
              'ca',
              '1',
              '(...) ...-....',
              1,
              [
                '204',
                '226',
                '236',
                '249',
                '250',
                '289',
                '306',
                '343',
                '365',
                '387',
                '403',
                '416',
                '418',
                '431',
                '437',
                '438',
                '450',
                '506',
                '514',
                '519',
                '548',
                '579',
                '581',
                '587',
                '604',
                '613',
                '639',
                '647',
                '672',
                '705',
                '709',
                '742',
                '778',
                '780',
                '782',
                '807',
                '819',
                '825',
                '867',
                '873',
                '902',
                '905',
              ],
            ],
            ['Cape Verde', ['africa'], 'cv', '238'],
            [
              'Caribbean Netherlands',
              ['america', 'carribean'],
              'bq',
              '599',
              '',
              1,
            ],
            ['Central African Republic', ['africa'], 'cf', '236'],
            ['Chad', ['africa'], 'td', '235'],
            ['Chile', ['america', 'south-america'], 'cl', '56'],
            ['China', ['asia'], 'cn', '86', '..-.........'],
            [
              'Colombia',
              ['america', 'south-america'],
              'co',
              '57',
              '... ... ....',
            ],
            ['Comoros', ['africa'], 'km', '269'],
            ['Congo', ['africa'], 'cd', '243'],
            ['Congo', ['africa'], 'cg', '242'],
            [
              'Costa Rica',
              ['america', 'central-america'],
              'cr',
              '506',
              '....-....',
            ],
            ['Côte d’Ivoire', ['africa'], 'ci', '225', '.. .. .. ..'],
            ['Croatia', ['europe', 'eu-union', 'ex-yugos'], 'hr', '385'],
            ['Cuba', ['america', 'carribean'], 'cu', '53'],
            ['Curaçao', ['america', 'carribean'], 'cw', '599', '', 0],
            ['Cyprus', ['europe', 'eu-union'], 'cy', '357', '.. ......'],
            [
              'Czech Republic',
              ['europe', 'eu-union'],
              'cz',
              '420',
              '... ... ...',
            ],
            [
              'Denmark',
              ['europe', 'eu-union', 'baltic'],
              'dk',
              '45',
              '.. .. .. ..',
            ],
            ['Djibouti', ['africa'], 'dj', '253'],
            ['Dominica', ['america', 'carribean'], 'dm', '1767'],
            [
              'Dominican Republic',
              ['america', 'carribean'],
              'do',
              '1',
              '',
              2,
              ['809', '829', '849'],
            ],
            ['Ecuador', ['america', 'south-america'], 'ec', '593'],
            ['Egypt', ['africa', 'north-africa'], 'eg', '20'],
            [
              'El Salvador',
              ['america', 'central-america'],
              'sv',
              '503',
              '....-....',
            ],
            ['Equatorial Guinea', ['africa'], 'gq', '240'],
            ['Eritrea', ['africa'], 'er', '291'],
            [
              'Estonia',
              ['europe', 'eu-union', 'ex-ussr', 'baltic'],
              'ee',
              '372',
              '.... ......',
            ],
            ['Ethiopia', ['africa'], 'et', '251'],
            ['Fiji', ['oceania'], 'fj', '679'],
            [
              'Finland',
              ['europe', 'eu-union', 'baltic'],
              'fi',
              '358',
              '.. ... .. ..',
            ],
            ['France', ['europe', 'eu-union'], 'fr', '33', '. .. .. .. ..'],
            ['French Guiana', ['america', 'south-america'], 'gf', '594'],
            ['French Polynesia', ['oceania'], 'pf', '689'],
            ['Gabon', ['africa'], 'ga', '241'],
            ['Gambia', ['africa'], 'gm', '220'],
            ['Georgia', ['asia', 'ex-ussr'], 'ge', '995'],
            [
              'Germany',
              ['europe', 'eu-union', 'baltic'],
              'de',
              '49',
              '.... ........',
            ],
            ['Ghana', ['africa'], 'gh', '233'],
            ['Greece', ['europe', 'eu-union'], 'gr', '30'],
            ['Grenada', ['america', 'carribean'], 'gd', '1473'],
            ['Guadeloupe', ['america', 'carribean'], 'gp', '590', '', 0],
            ['Guam', ['oceania'], 'gu', '1671'],
            [
              'Guatemala',
              ['america', 'central-america'],
              'gt',
              '502',
              '....-....',
            ],
            ['Guinea', ['africa'], 'gn', '224'],
            ['Guinea-Bissau', ['africa'], 'gw', '245'],
            ['Guyana', ['america', 'south-america'], 'gy', '592'],
            ['Haiti', ['america', 'carribean'], 'ht', '509', '....-....'],
            ['Honduras', ['america', 'central-america'], 'hn', '504'],
            ['Hong Kong', ['asia'], 'hk', '852', '.... ....'],
            ['Hungary', ['europe', 'eu-union'], 'hu', '36'],
            ['Iceland', ['europe'], 'is', '354', '... ....'],
            ['India', ['asia'], 'in', '91', '.....-.....'],
            ['Indonesia', ['asia'], 'id', '62'],
            ['Iran', ['middle-east'], 'ir', '98', '... ... ....'],
            ['Iraq', ['middle-east'], 'iq', '964'],
            ['Ireland', ['europe', 'eu-union'], 'ie', '353', '.. .......'],
            ['Israel', ['middle-east'], 'il', '972', '... ... ....'],
            ['Italy', ['europe', 'eu-union'], 'it', '39', '... .......', 0],
            ['Jamaica', ['america', 'carribean'], 'jm', '1876'],
            ['Japan', ['asia'], 'jp', '81', '.. .... ....'],
            ['Jordan', ['middle-east'], 'jo', '962'],
            [
              'Kazakhstan',
              ['asia', 'ex-ussr'],
              'kz',
              '7',
              '... ...-..-..',
              1,
              [
                '310',
                '311',
                '312',
                '313',
                '315',
                '318',
                '321',
                '324',
                '325',
                '326',
                '327',
                '336',
                '7172',
                '73622',
              ],
            ],
            ['Kenya', ['africa'], 'ke', '254'],
            ['Kiribati', ['oceania'], 'ki', '686'],
            ['Kosovo', ['europe', 'ex-yugos'], 'xk', '383'],
            ['Kuwait', ['middle-east'], 'kw', '965'],
            ['Kyrgyzstan', ['asia', 'ex-ussr'], 'kg', '996', '... ... ...'],
            ['Laos', ['asia'], 'la', '856'],
            [
              'Latvia',
              ['europe', 'eu-union', 'ex-ussr', 'baltic'],
              'lv',
              '371',
              '.. ... ...',
            ],
            ['Lebanon', ['middle-east'], 'lb', '961'],
            ['Lesotho', ['africa'], 'ls', '266'],
            ['Liberia', ['africa'], 'lr', '231'],
            ['Libya', ['africa', 'north-africa'], 'ly', '218'],
            ['Liechtenstein', ['europe'], 'li', '423'],
            [
              'Lithuania',
              ['europe', 'eu-union', 'ex-ussr', 'baltic'],
              'lt',
              '370',
            ],
            ['Luxembourg', ['europe', 'eu-union'], 'lu', '352'],
            ['Macau', ['asia'], 'mo', '853'],
            ['Macedonia', ['europe', 'ex-yugos'], 'mk', '389'],
            ['Madagascar', ['africa'], 'mg', '261'],
            ['Malawi', ['africa'], 'mw', '265'],
            ['Malaysia', ['asia'], 'my', '60', '..-....-....'],
            ['Maldives', ['asia'], 'mv', '960'],
            ['Mali', ['africa'], 'ml', '223'],
            ['Malta', ['europe', 'eu-union'], 'mt', '356'],
            ['Marshall Islands', ['oceania'], 'mh', '692'],
            ['Martinique', ['america', 'carribean'], 'mq', '596'],
            ['Mauritania', ['africa'], 'mr', '222'],
            ['Mauritius', ['africa'], 'mu', '230'],
            [
              'Mexico',
              ['america', 'central-america'],
              'mx',
              '52',
              '... ... ....',
              0,
              ['55', '81', '33', '656', '664', '998', '774', '229'],
            ],
            ['Micronesia', ['oceania'], 'fm', '691'],
            ['Moldova', ['europe'], 'md', '373', '(..) ..-..-..'],
            ['Monaco', ['europe'], 'mc', '377'],
            ['Mongolia', ['asia'], 'mn', '976'],
            ['Montenegro', ['europe', 'ex-yugos'], 'me', '382'],
            ['Morocco', ['africa', 'north-africa'], 'ma', '212'],
            ['Mozambique', ['africa'], 'mz', '258'],
            ['Myanmar', ['asia'], 'mm', '95'],
            ['Namibia', ['africa'], 'na', '264'],
            ['Nauru', ['africa'], 'nr', '674'],
            ['Nepal', ['asia'], 'np', '977'],
            ['Netherlands', ['europe', 'eu-union'], 'nl', '31', '.. ........'],
            ['New Caledonia', ['oceania'], 'nc', '687'],
            ['New Zealand', ['oceania'], 'nz', '64', '...-...-....'],
            ['Nicaragua', ['america', 'central-america'], 'ni', '505'],
            ['Niger', ['africa'], 'ne', '227'],
            ['Nigeria', ['africa'], 'ng', '234'],
            ['North Korea', ['asia'], 'kp', '850'],
            ['Norway', ['europe', 'baltic'], 'no', '47', '... .. ...'],
            ['Oman', ['middle-east'], 'om', '968'],
            ['Pakistan', ['asia'], 'pk', '92', '...-.......'],
            ['Palau', ['oceania'], 'pw', '680'],
            ['Palestine', ['middle-east'], 'ps', '970'],
            ['Panama', ['america', 'central-america'], 'pa', '507'],
            ['Papua New Guinea', ['oceania'], 'pg', '675'],
            ['Paraguay', ['america', 'south-america'], 'py', '595'],
            ['Peru', ['america', 'south-america'], 'pe', '51'],
            ['Philippines', ['asia'], 'ph', '63', '.... .......'],
            [
              'Poland',
              ['europe', 'eu-union', 'baltic'],
              'pl',
              '48',
              '...-...-...',
            ],
            ['Portugal', ['europe', 'eu-union'], 'pt', '351'],
            [
              'Puerto Rico',
              ['america', 'carribean'],
              'pr',
              '1',
              '',
              3,
              ['787', '939'],
            ],
            ['Qatar', ['middle-east'], 'qa', '974'],
            ['Réunion', ['africa'], 're', '262'],
            ['Romania', ['europe', 'eu-union'], 'ro', '40'],
            [
              'Russia',
              ['europe', 'asia', 'ex-ussr', 'baltic'],
              'ru',
              '7',
              '(...) ...-..-..',
              0,
            ],
            ['Rwanda', ['africa'], 'rw', '250'],
            ['Saint Kitts and Nevis', ['america', 'carribean'], 'kn', '1869'],
            ['Saint Lucia', ['america', 'carribean'], 'lc', '1758'],
            [
              'Saint Vincent and the Grenadines',
              ['america', 'carribean'],
              'vc',
              '1784',
            ],
            ['Samoa', ['oceania'], 'ws', '685'],
            ['San Marino', ['europe'], 'sm', '378'],
            ['São Tomé and Príncipe', ['africa'], 'st', '239'],
            ['Saudi Arabia', ['middle-east'], 'sa', '966'],
            ['Senegal', ['africa'], 'sn', '221'],
            ['Serbia', ['europe', 'ex-yugos'], 'rs', '381'],
            ['Seychelles', ['africa'], 'sc', '248'],
            ['Sierra Leone', ['africa'], 'sl', '232'],
            ['Singapore', ['asia'], 'sg', '65', '....-....'],
            ['Slovakia', ['europe', 'eu-union'], 'sk', '421'],
            ['Slovenia', ['europe', 'eu-union', 'ex-yugos'], 'si', '386'],
            ['Solomon Islands', ['oceania'], 'sb', '677'],
            ['Somalia', ['africa'], 'so', '252'],
            ['South Africa', ['africa'], 'za', '27'],
            ['South Korea', ['asia'], 'kr', '82', '... .... ....'],
            ['South Sudan', ['africa', 'north-africa'], 'ss', '211'],
            ['Spain', ['europe', 'eu-union'], 'es', '34', '... ... ...'],
            ['Sri Lanka', ['asia'], 'lk', '94'],
            ['Sudan', ['africa'], 'sd', '249'],
            ['Suriname', ['america', 'south-america'], 'sr', '597'],
            ['Swaziland', ['africa'], 'sz', '268'],
            [
              'Sweden',
              ['europe', 'eu-union', 'baltic'],
              'se',
              '46',
              '(...) ...-...',
            ],
            ['Switzerland', ['europe'], 'ch', '41', '.. ... .. ..'],
            ['Syria', ['middle-east'], 'sy', '963'],
            ['Taiwan', ['asia'], 'tw', '886'],
            ['Tajikistan', ['asia', 'ex-ussr'], 'tj', '992'],
            ['Tanzania', ['africa'], 'tz', '255'],
            ['Thailand', ['asia'], 'th', '66'],
            ['Timor-Leste', ['asia'], 'tl', '670'],
            ['Togo', ['africa'], 'tg', '228'],
            ['Tonga', ['oceania'], 'to', '676'],
            ['Trinidad and Tobago', ['america', 'carribean'], 'tt', '1868'],
            ['Tunisia', ['africa', 'north-africa'], 'tn', '216'],
            ['Turkey', ['europe'], 'tr', '90', '... ... .. ..'],
            ['Turkmenistan', ['asia', 'ex-ussr'], 'tm', '993'],
            ['Tuvalu', ['asia'], 'tv', '688'],
            ['Uganda', ['africa'], 'ug', '256'],
            ['Ukraine', ['europe', 'ex-ussr'], 'ua', '380', '(..) ... .. ..'],
            ['United Arab Emirates', ['middle-east'], 'ae', '971'],
            [
              'United Kingdom',
              ['europe', 'eu-union'],
              'gb',
              '44',
              '.... ......',
            ],
            [
              'United States',
              ['america', 'north-america'],
              'us',
              '1',
              '(...) ...-....',
              0,
              [
                '907',
                '205',
                '251',
                '256',
                '334',
                '479',
                '501',
                '870',
                '480',
                '520',
                '602',
                '623',
                '928',
                '209',
                '213',
                '310',
                '323',
                '408',
                '415',
                '510',
                '530',
                '559',
                '562',
                '619',
                '626',
                '650',
                '661',
                '707',
                '714',
                '760',
                '805',
                '818',
                '831',
                '858',
                '909',
                '916',
                '925',
                '949',
                '951',
                '303',
                '719',
                '970',
                '203',
                '860',
                '202',
                '302',
                '239',
                '305',
                '321',
                '352',
                '386',
                '407',
                '561',
                '727',
                '772',
                '813',
                '850',
                '863',
                '904',
                '941',
                '954',
                '229',
                '404',
                '478',
                '706',
                '770',
                '912',
                '808',
                '319',
                '515',
                '563',
                '641',
                '712',
                '208',
                '217',
                '309',
                '312',
                '618',
                '630',
                '708',
                '773',
                '815',
                '847',
                '219',
                '260',
                '317',
                '574',
                '765',
                '812',
                '316',
                '620',
                '785',
                '913',
                '270',
                '502',
                '606',
                '859',
                '225',
                '318',
                '337',
                '504',
                '985',
                '413',
                '508',
                '617',
                '781',
                '978',
                '301',
                '410',
                '207',
                '231',
                '248',
                '269',
                '313',
                '517',
                '586',
                '616',
                '734',
                '810',
                '906',
                '989',
                '218',
                '320',
                '507',
                '612',
                '651',
                '763',
                '952',
                '314',
                '417',
                '573',
                '636',
                '660',
                '816',
                '228',
                '601',
                '662',
                '406',
                '252',
                '336',
                '704',
                '828',
                '910',
                '919',
                '701',
                '308',
                '402',
                '603',
                '201',
                '609',
                '732',
                '856',
                '908',
                '973',
                '505',
                '575',
                '702',
                '775',
                '212',
                '315',
                '516',
                '518',
                '585',
                '607',
                '631',
                '716',
                '718',
                '845',
                '914',
                '216',
                '330',
                '419',
                '440',
                '513',
                '614',
                '740',
                '937',
                '405',
                '580',
                '918',
                '503',
                '541',
                '215',
                '412',
                '570',
                '610',
                '717',
                '724',
                '814',
                '401',
                '803',
                '843',
                '864',
                '605',
                '423',
                '615',
                '731',
                '865',
                '901',
                '931',
                '210',
                '214',
                '254',
                '281',
                '325',
                '361',
                '409',
                '432',
                '512',
                '713',
                '806',
                '817',
                '830',
                '903',
                '915',
                '936',
                '940',
                '956',
                '972',
                '979',
                '435',
                '801',
                '276',
                '434',
                '540',
                '703',
                '757',
                '804',
                '802',
                '206',
                '253',
                '360',
                '425',
                '509',
                '262',
                '414',
                '608',
                '715',
                '920',
                '304',
                '307',
              ],
            ],
            ['Uruguay', ['america', 'south-america'], 'uy', '598'],
            ['Uzbekistan', ['asia', 'ex-ussr'], 'uz', '998', '.. ... .. ..'],
            ['Vanuatu', ['oceania'], 'vu', '678'],
            ['Vatican City', ['europe'], 'va', '39', '.. .... ....', 1],
            ['Venezuela', ['america', 'south-america'], 've', '58'],
            ['Vietnam', ['asia'], 'vn', '84'],
            ['Yemen', ['middle-east'], 'ye', '967'],
            ['Zambia', ['africa'], 'zm', '260'],
            ['Zimbabwe', ['africa'], 'zw', '263'],
          ],
          E = [
            ['American Samoa', ['oceania'], 'as', '1684'],
            ['Anguilla', ['america', 'carribean'], 'ai', '1264'],
            ['Bermuda', ['america', 'north-america'], 'bm', '1441'],
            ['British Virgin Islands', ['america', 'carribean'], 'vg', '1284'],
            ['Cayman Islands', ['america', 'carribean'], 'ky', '1345'],
            ['Cook Islands', ['oceania'], 'ck', '682'],
            ['Falkland Islands', ['america', 'south-america'], 'fk', '500'],
            ['Faroe Islands', ['europe'], 'fo', '298'],
            ['Gibraltar', ['europe'], 'gi', '350'],
            ['Greenland', ['america'], 'gl', '299'],
            ['Jersey', ['europe', 'eu-union'], 'je', '44', '.... ......'],
            ['Montserrat', ['america', 'carribean'], 'ms', '1664'],
            ['Niue', ['asia'], 'nu', '683'],
            ['Norfolk Island', ['oceania'], 'nf', '672'],
            ['Northern Mariana Islands', ['oceania'], 'mp', '1670'],
            ['Saint Barthélemy', ['america', 'carribean'], 'bl', '590', '', 1],
            ['Saint Helena', ['africa'], 'sh', '290'],
            ['Saint Martin', ['america', 'carribean'], 'mf', '590', '', 2],
            [
              'Saint Pierre and Miquelon',
              ['america', 'north-america'],
              'pm',
              '508',
            ],
            ['Sint Maarten', ['america', 'carribean'], 'sx', '1721'],
            ['Tokelau', ['oceania'], 'tk', '690'],
            [
              'Turks and Caicos Islands',
              ['america', 'carribean'],
              'tc',
              '1649',
            ],
            ['U.S. Virgin Islands', ['america', 'carribean'], 'vi', '1340'],
            ['Wallis and Futuna', ['oceania'], 'wf', '681'],
          ];
        function T(e2, t2, r2, n2, a2) {
          return !r2 || a2
            ? e2 + ''.padEnd(t2.length, '.') + ' ' + n2
            : e2 + ''.padEnd(t2.length, '.') + ' ' + r2;
        }
        function I(e2, t2, r2, a2, i2) {
          var u2,
            c2,
            s2 = [];
          return (
            (c2 = true === t2),
            [
              (u2 = []).concat.apply(
                u2,
                o(
                  e2.map(function (e3) {
                    var o2 = {
                        name: e3[0],
                        regions: e3[1],
                        iso2: e3[2],
                        countryCode: e3[3],
                        dialCode: e3[3],
                        format: T(r2, e3[3], e3[4], a2, i2),
                        priority: e3[5] || 0,
                      },
                      u3 = [];
                    return (
                      e3[6] &&
                        e3[6].map(function (t3) {
                          var r3 = (function (e4) {
                            for (var t4 = 1; t4 < arguments.length; t4++) {
                              var r4 =
                                  null != arguments[t4] ? arguments[t4] : {},
                                a3 = Object.keys(r4);
                              'function' ==
                                typeof Object.getOwnPropertySymbols &&
                                (a3 = a3.concat(
                                  Object.getOwnPropertySymbols(r4).filter(
                                    function (e5) {
                                      return Object.getOwnPropertyDescriptor(
                                        r4,
                                        e5
                                      ).enumerable;
                                    }
                                  )
                                )),
                                a3.forEach(function (t5) {
                                  n(e4, t5, r4[t5]);
                                });
                            }
                            return e4;
                          })({}, o2);
                          (r3.dialCode = e3[3] + t3),
                            (r3.isAreaCode = true),
                            (r3.areaCodeLength = t3.length),
                            u3.push(r3);
                        }),
                      u3.length > 0
                        ? ((o2.mainCode = true),
                          c2 ||
                          ('Array' === t2.constructor.name &&
                            t2.includes(e3[2]))
                            ? ((o2.hasAreaCodes = true), [o2].concat(u3))
                            : ((s2 = s2.concat(u3)), [o2]))
                        : [o2]
                    );
                  })
                )
              ),
              s2,
            ]
          );
        }
        function A(e2, t2, r2, n2) {
          if (null !== r2) {
            var a2 = Object.keys(r2),
              o2 = Object.values(r2);
            a2.forEach(function (r3, a3) {
              if (n2) return e2.push([r3, o2[a3]]);
              var i2 = e2.findIndex(function (e3) {
                return e3[0] === r3;
              });
              if (-1 === i2) {
                var u2 = [r3];
                (u2[t2] = o2[a3]), e2.push(u2);
              } else e2[i2][t2] = o2[a3];
            });
          }
        }
        function D(e2, t2) {
          return 0 === t2.length
            ? e2
            : e2.map(function (e3) {
                var r2 = t2.findIndex(function (t3) {
                  return t3[0] === e3[2];
                });
                if (-1 === r2) return e3;
                var n2 = t2[r2];
                return (
                  n2[1] && (e3[4] = n2[1]),
                  n2[3] && (e3[5] = n2[3]),
                  n2[2] && (e3[6] = n2[2]),
                  e3
                );
              });
        }
        var P = function e2(
            t2,
            r2,
            n2,
            a2,
            i2,
            u2,
            s2,
            l2,
            f2,
            d2,
            p2,
            h2,
            m2,
            y2
          ) {
            c(this, e2),
              (this.filterRegions = function (e3, t3) {
                if ('string' == typeof e3) {
                  var r3 = e3;
                  return t3.filter(function (e4) {
                    return e4.regions.some(function (e5) {
                      return e5 === r3;
                    });
                  });
                }
                return t3.filter(function (t4) {
                  return e3
                    .map(function (e4) {
                      return t4.regions.some(function (t5) {
                        return t5 === e4;
                      });
                    })
                    .some(function (e4) {
                      return e4;
                    });
                });
              }),
              (this.sortTerritories = function (e3, t3) {
                var r3 = [].concat(o(e3), o(t3));
                return (
                  r3.sort(function (e4, t4) {
                    return e4.name < t4.name ? -1 : e4.name > t4.name ? 1 : 0;
                  }),
                  r3
                );
              }),
              (this.getFilteredCountryList = function (e3, t3, r3) {
                return 0 === e3.length
                  ? t3
                  : r3
                    ? e3
                        .map(function (e4) {
                          var r4 = t3.find(function (t4) {
                            return t4.iso2 === e4;
                          });
                          if (r4) return r4;
                        })
                        .filter(function (e4) {
                          return e4;
                        })
                    : t3.filter(function (t4) {
                        return e3.some(function (e4) {
                          return e4 === t4.iso2;
                        });
                      });
              }),
              (this.localizeCountries = function (e3, t3, r3) {
                for (var n3 = 0; n3 < e3.length; n3++)
                  void 0 !== t3[e3[n3].iso2]
                    ? (e3[n3].localName = t3[e3[n3].iso2])
                    : void 0 !== t3[e3[n3].name] &&
                      (e3[n3].localName = t3[e3[n3].name]);
                return (
                  r3 ||
                    e3.sort(function (e4, t4) {
                      return e4.localName < t4.localName
                        ? -1
                        : e4.localName > t4.localName
                          ? 1
                          : 0;
                    }),
                  e3
                );
              }),
              (this.getCustomAreas = function (e3, t3) {
                for (var r3 = [], n3 = 0; n3 < t3.length; n3++) {
                  var a3 = JSON.parse(JSON.stringify(e3));
                  (a3.dialCode += t3[n3]), r3.push(a3);
                }
                return r3;
              }),
              (this.excludeCountries = function (e3, t3) {
                return 0 === t3.length
                  ? e3
                  : e3.filter(function (e4) {
                      return !t3.includes(e4.iso2);
                    });
              });
            var b2 = (function (e3, t3, r3) {
                var n3 = [];
                return A(n3, 1, e3, true), A(n3, 3, t3), A(n3, 2, r3), n3;
              })(l2, f2, d2),
              g2 = D(JSON.parse(JSON.stringify(k)), b2),
              v2 = D(JSON.parse(JSON.stringify(E)), b2),
              C2 = O(I(g2, t2, h2, m2, y2), 2),
              _2 = C2[0],
              w2 = C2[1];
            if (r2) {
              var S2 = O(I(v2, t2, h2, m2, y2), 2),
                j2 = S2[0];
              S2[1];
              _2 = this.sortTerritories(j2, _2);
            }
            n2 && (_2 = this.filterRegions(n2, _2)),
              (this.onlyCountries = this.localizeCountries(
                this.excludeCountries(
                  this.getFilteredCountryList(
                    a2,
                    _2,
                    s2.includes('onlyCountries')
                  ),
                  u2
                ),
                p2,
                s2.includes('onlyCountries')
              )),
              (this.preferredCountries =
                0 === i2.length
                  ? []
                  : this.localizeCountries(
                      this.getFilteredCountryList(
                        i2,
                        _2,
                        s2.includes('preferredCountries')
                      ),
                      p2,
                      s2.includes('preferredCountries')
                    )),
              (this.hiddenAreaCodes = this.excludeCountries(
                this.getFilteredCountryList(a2, w2),
                u2
              ));
          },
          F = (function (e2) {
            function t2(e3) {
              var r3;
              c(this, t2),
                ((r3 = (function (e4, t3) {
                  return !t3 || ('object' !== f(t3) && 'function' != typeof t3)
                    ? d(e4)
                    : t3;
                })(this, p(t2).call(this, e3))).getProbableCandidate = C()(
                  function (e4) {
                    return e4 && 0 !== e4.length
                      ? r3.state.onlyCountries.filter(
                          function (t3) {
                            return j()(t3.name.toLowerCase(), e4.toLowerCase());
                          },
                          d(d(r3))
                        )[0]
                      : null;
                  }
                )),
                (r3.guessSelectedCountry = C()(function (e4, t3, n2, a2) {
                  var o2;
                  if (
                    false === r3.props.enableAreaCodes &&
                    (a2.some(function (t4) {
                      if (j()(e4, t4.dialCode))
                        return (
                          n2.some(function (e5) {
                            if (t4.iso2 === e5.iso2 && e5.mainCode)
                              return (o2 = e5), true;
                          }),
                          true
                        );
                    }),
                    o2)
                  )
                    return o2;
                  var i2 = n2.find(function (e5) {
                    return e5.iso2 == t3;
                  });
                  if ('' === e4.trim()) return i2;
                  var u2 = n2.reduce(
                    function (t4, r4) {
                      if (j()(e4, r4.dialCode)) {
                        if (r4.dialCode.length > t4.dialCode.length) return r4;
                        if (
                          r4.dialCode.length === t4.dialCode.length &&
                          r4.priority < t4.priority
                        )
                          return r4;
                      }
                      return t4;
                    },
                    { dialCode: '', priority: 10001 },
                    d(d(r3))
                  );
                  return u2.name ? u2 : i2;
                })),
                (r3.updateCountry = function (e4) {
                  var t3,
                    n2 = r3.state.onlyCountries;
                  (t3 =
                    e4.indexOf(0) >= '0' && e4.indexOf(0) <= '9'
                      ? n2.find(function (t4) {
                          return t4.dialCode == +e4;
                        })
                      : n2.find(function (t4) {
                          return t4.iso2 == e4;
                        })) &&
                    t3.dialCode &&
                    r3.setState({
                      selectedCountry: t3,
                      formattedNumber: r3.props.disableCountryCode
                        ? ''
                        : r3.formatNumber(t3.dialCode, t3),
                    });
                }),
                (r3.scrollTo = function (e4, t3) {
                  if (e4) {
                    var n2 = r3.dropdownRef;
                    if (n2 && document.body) {
                      var a2 = n2.offsetHeight,
                        o2 =
                          n2.getBoundingClientRect().top +
                          document.body.scrollTop,
                        i2 = o2 + a2,
                        u2 = e4,
                        c2 = u2.getBoundingClientRect(),
                        s3 = u2.offsetHeight,
                        l4 = c2.top + document.body.scrollTop,
                        f2 = l4 + s3,
                        d2 = l4 - o2 + n2.scrollTop,
                        p2 = a2 / 2 - s3 / 2;
                      if (r3.props.enableSearch ? l4 < o2 + 32 : l4 < o2)
                        t3 && (d2 -= p2), (n2.scrollTop = d2);
                      else if (f2 > i2) {
                        t3 && (d2 += p2);
                        var h3 = a2 - s3;
                        n2.scrollTop = d2 - h3;
                      }
                    }
                  }
                }),
                (r3.scrollToTop = function () {
                  var e4 = r3.dropdownRef;
                  e4 && document.body && (e4.scrollTop = 0);
                }),
                (r3.formatNumber = function (e4, t3) {
                  if (!t3) return e4;
                  var n2,
                    o2 = t3.format,
                    c2 = r3.props,
                    s3 = c2.disableCountryCode,
                    l4 = c2.enableAreaCodeStretch,
                    f2 = c2.enableLongNumbers,
                    d2 = c2.autoFormat;
                  if (
                    (s3
                      ? ((n2 = o2.split(' ')).shift(), (n2 = n2.join(' ')))
                      : l4 && t3.isAreaCode
                        ? (((n2 = o2.split(' '))[1] = n2[1].replace(
                            /\.+/,
                            ''.padEnd(t3.areaCodeLength, '.')
                          )),
                          (n2 = n2.join(' ')))
                        : (n2 = o2),
                    !e4 || 0 === e4.length)
                  )
                    return s3 ? '' : r3.props.prefix;
                  if ((e4 && e4.length < 2) || !n2 || !d2)
                    return s3 ? e4 : r3.props.prefix + e4;
                  var p2,
                    h3 = w()(
                      n2,
                      function (e5, t4) {
                        if (0 === e5.remainingText.length) return e5;
                        if ('.' !== t4)
                          return {
                            formattedText: e5.formattedText + t4,
                            remainingText: e5.remainingText,
                          };
                        var r4,
                          n3 = i((r4 = e5.remainingText)) || a(r4) || u(),
                          o3 = n3[0],
                          c3 = n3.slice(1);
                        return {
                          formattedText: e5.formattedText + o3,
                          remainingText: c3,
                        };
                      },
                      { formattedText: '', remainingText: e4.split('') }
                    );
                  return (
                    (p2 = f2
                      ? h3.formattedText + h3.remainingText.join('')
                      : h3.formattedText).includes('(') &&
                      !p2.includes(')') &&
                      (p2 += ')'),
                    p2
                  );
                }),
                (r3.cursorToEnd = function () {
                  var e4 = r3.numberInputRef;
                  if (document.activeElement === e4) {
                    e4.focus();
                    var t3 = e4.value.length;
                    ')' === e4.value.charAt(t3 - 1) && (t3 -= 1),
                      e4.setSelectionRange(t3, t3);
                  }
                }),
                (r3.getElement = function (e4) {
                  return r3['flag_no_'.concat(e4)];
                }),
                (r3.getCountryData = function () {
                  return r3.state.selectedCountry
                    ? {
                        name: r3.state.selectedCountry.name || '',
                        dialCode: r3.state.selectedCountry.dialCode || '',
                        countryCode: r3.state.selectedCountry.iso2 || '',
                        format: r3.state.selectedCountry.format || '',
                      }
                    : {};
                }),
                (r3.handleFlagDropdownClick = function (e4) {
                  if (
                    (e4.preventDefault(),
                    r3.state.showDropdown || !r3.props.disabled)
                  ) {
                    var t3 = r3.state,
                      n2 = t3.preferredCountries,
                      a2 = t3.onlyCountries,
                      o2 = t3.selectedCountry,
                      i2 = r3
                        .concatPreferredCountries(n2, a2)
                        .findIndex(function (e5) {
                          return (
                            e5.dialCode === o2.dialCode && e5.iso2 === o2.iso2
                          );
                        });
                    r3.setState(
                      {
                        showDropdown: !r3.state.showDropdown,
                        highlightCountryIndex: i2,
                      },
                      function () {
                        r3.state.showDropdown &&
                          r3.scrollTo(
                            r3.getElement(r3.state.highlightCountryIndex)
                          );
                      }
                    );
                  }
                }),
                (r3.handleInput = function (e4) {
                  var t3 = e4.target.value,
                    n2 = r3.props,
                    a2 = n2.prefix,
                    o2 = n2.onChange,
                    i2 = r3.props.disableCountryCode ? '' : a2,
                    u2 = r3.state.selectedCountry,
                    c2 = r3.state.freezeSelection;
                  if (!r3.props.countryCodeEditable) {
                    var s3 =
                      a2 +
                      (u2.hasAreaCodes
                        ? r3.state.onlyCountries.find(function (e5) {
                            return e5.iso2 === u2.iso2 && e5.mainCode;
                          }).dialCode
                        : u2.dialCode);
                    if (t3.slice(0, s3.length) !== s3) return;
                  }
                  if (t3 === a2)
                    return (
                      o2 && o2('', r3.getCountryData(), e4, ''),
                      r3.setState({ formattedNumber: '' })
                    );
                  if (t3.replace(/\D/g, '').length > 15) {
                    if (false === r3.props.enableLongNumbers) return;
                    if (
                      'number' == typeof r3.props.enableLongNumbers &&
                      t3.replace(/\D/g, '').length > r3.props.enableLongNumbers
                    )
                      return;
                  }
                  if (t3 !== r3.state.formattedNumber) {
                    e4.preventDefault
                      ? e4.preventDefault()
                      : (e4.returnValue = false);
                    var l4 = r3.props.country,
                      f2 = r3.state,
                      d2 = f2.onlyCountries,
                      p2 = f2.selectedCountry,
                      h3 = f2.hiddenAreaCodes;
                    if ((o2 && e4.persist(), t3.length > 0)) {
                      var m4 = t3.replace(/\D/g, '');
                      (!r3.state.freezeSelection ||
                        (p2 && p2.dialCode.length > m4.length)) &&
                        ((u2 = r3.props.disableCountryGuess
                          ? p2
                          : r3.guessSelectedCountry(
                              m4.substring(0, 6),
                              l4,
                              d2,
                              h3
                            ) || p2),
                        (c2 = false)),
                        (i2 = r3.formatNumber(m4, u2)),
                        (u2 = u2.dialCode ? u2 : p2);
                    }
                    var y2 = e4.target.selectionStart,
                      b3 = e4.target.selectionStart,
                      g2 = r3.state.formattedNumber,
                      v3 = i2.length - g2.length;
                    r3.setState(
                      {
                        formattedNumber: i2,
                        freezeSelection: c2,
                        selectedCountry: u2,
                      },
                      function () {
                        v3 > 0 && (b3 -= v3),
                          ')' == i2.charAt(i2.length - 1)
                            ? r3.numberInputRef.setSelectionRange(
                                i2.length - 1,
                                i2.length - 1
                              )
                            : b3 > 0 && g2.length >= i2.length
                              ? r3.numberInputRef.setSelectionRange(b3, b3)
                              : y2 < g2.length &&
                                r3.numberInputRef.setSelectionRange(y2, y2),
                          o2 &&
                            o2(
                              i2.replace(/[^0-9]+/g, ''),
                              r3.getCountryData(),
                              e4,
                              i2
                            );
                      }
                    );
                  }
                }),
                (r3.handleInputClick = function (e4) {
                  r3.setState({ showDropdown: false }),
                    r3.props.onClick &&
                      r3.props.onClick(e4, r3.getCountryData());
                }),
                (r3.handleDoubleClick = function (e4) {
                  var t3 = e4.target.value.length;
                  e4.target.setSelectionRange(0, t3);
                }),
                (r3.handleFlagItemClick = function (e4, t3) {
                  var n2 = r3.state.selectedCountry,
                    a2 = r3.state.onlyCountries.find(function (t4) {
                      return t4 == e4;
                    });
                  if (a2) {
                    var o2 = r3.state.formattedNumber
                        .replace(' ', '')
                        .replace('(', '')
                        .replace(')', '')
                        .replace('-', ''),
                      i2 =
                        o2.length > 1
                          ? o2.replace(n2.dialCode, a2.dialCode)
                          : a2.dialCode,
                      u2 = r3.formatNumber(i2.replace(/\D/g, ''), a2);
                    r3.setState(
                      {
                        showDropdown: false,
                        selectedCountry: a2,
                        freezeSelection: true,
                        formattedNumber: u2,
                        searchValue: '',
                      },
                      function () {
                        r3.cursorToEnd(),
                          r3.props.onChange &&
                            r3.props.onChange(
                              u2.replace(/[^0-9]+/g, ''),
                              r3.getCountryData(),
                              t3,
                              u2
                            );
                      }
                    );
                  }
                }),
                (r3.handleInputFocus = function (e4) {
                  r3.numberInputRef &&
                    r3.numberInputRef.value === r3.props.prefix &&
                    r3.state.selectedCountry &&
                    !r3.props.disableCountryCode &&
                    r3.setState(
                      {
                        formattedNumber:
                          r3.props.prefix + r3.state.selectedCountry.dialCode,
                      },
                      function () {
                        r3.props.jumpCursorToEnd &&
                          setTimeout(r3.cursorToEnd, 0);
                      }
                    ),
                    r3.setState({ placeholder: '' }),
                    r3.props.onFocus &&
                      r3.props.onFocus(e4, r3.getCountryData()),
                    r3.props.jumpCursorToEnd && setTimeout(r3.cursorToEnd, 0);
                }),
                (r3.handleInputBlur = function (e4) {
                  e4.target.value ||
                    r3.setState({ placeholder: r3.props.placeholder }),
                    r3.props.onBlur && r3.props.onBlur(e4, r3.getCountryData());
                }),
                (r3.handleInputCopy = function (e4) {
                  if (r3.props.copyNumbersOnly) {
                    var t3 = window
                      .getSelection()
                      .toString()
                      .replace(/[^0-9]+/g, '');
                    e4.clipboardData.setData('text/plain', t3),
                      e4.preventDefault();
                  }
                }),
                (r3.getHighlightCountryIndex = function (e4) {
                  var t3 = r3.state.highlightCountryIndex + e4;
                  return t3 < 0 ||
                    t3 >=
                      r3.state.onlyCountries.length +
                        r3.state.preferredCountries.length
                    ? t3 - e4
                    : r3.props.enableSearch &&
                        t3 > r3.getSearchFilteredCountries().length
                      ? 0
                      : t3;
                }),
                (r3.searchCountry = function () {
                  var e4 =
                      r3.getProbableCandidate(r3.state.queryString) ||
                      r3.state.onlyCountries[0],
                    t3 =
                      r3.state.onlyCountries.findIndex(function (t4) {
                        return t4 == e4;
                      }) + r3.state.preferredCountries.length;
                  r3.scrollTo(r3.getElement(t3), true),
                    r3.setState({ queryString: '', highlightCountryIndex: t3 });
                }),
                (r3.handleKeydown = function (e4) {
                  var t3 = r3.props.keys,
                    n2 = e4.target.className;
                  if (
                    n2.includes('selected-flag') &&
                    e4.which === t3.ENTER &&
                    !r3.state.showDropdown
                  )
                    return r3.handleFlagDropdownClick(e4);
                  if (
                    n2.includes('form-control') &&
                    (e4.which === t3.ENTER || e4.which === t3.ESC)
                  )
                    return e4.target.blur();
                  if (
                    r3.state.showDropdown &&
                    !r3.props.disabled &&
                    (!n2.includes('search-box') ||
                      e4.which === t3.UP ||
                      e4.which === t3.DOWN ||
                      e4.which === t3.ENTER ||
                      (e4.which === t3.ESC && '' === e4.target.value))
                  ) {
                    e4.preventDefault
                      ? e4.preventDefault()
                      : (e4.returnValue = false);
                    var a2 = function (e5) {
                      r3.setState(
                        {
                          highlightCountryIndex:
                            r3.getHighlightCountryIndex(e5),
                        },
                        function () {
                          r3.scrollTo(
                            r3.getElement(r3.state.highlightCountryIndex),
                            true
                          );
                        }
                      );
                    };
                    switch (e4.which) {
                      case t3.DOWN:
                        a2(1);
                        break;
                      case t3.UP:
                        a2(-1);
                        break;
                      case t3.ENTER:
                        r3.props.enableSearch
                          ? r3.handleFlagItemClick(
                              r3.getSearchFilteredCountries()[
                                r3.state.highlightCountryIndex
                              ] || r3.getSearchFilteredCountries()[0],
                              e4
                            )
                          : r3.handleFlagItemClick(
                              [].concat(
                                o(r3.state.preferredCountries),
                                o(r3.state.onlyCountries)
                              )[r3.state.highlightCountryIndex],
                              e4
                            );
                        break;
                      case t3.ESC:
                      case t3.TAB:
                        r3.setState({ showDropdown: false }, r3.cursorToEnd);
                        break;
                      default:
                        ((e4.which >= t3.A && e4.which <= t3.Z) ||
                          e4.which === t3.SPACE) &&
                          r3.setState(
                            {
                              queryString:
                                r3.state.queryString +
                                String.fromCharCode(e4.which),
                            },
                            r3.state.debouncedQueryStingSearcher
                          );
                    }
                  }
                }),
                (r3.handleInputKeyDown = function (e4) {
                  var t3 = r3.props,
                    n2 = t3.keys,
                    a2 = t3.onEnterKeyPress,
                    o2 = t3.onKeyDown;
                  e4.which === n2.ENTER && a2 && a2(e4), o2 && o2(e4);
                }),
                (r3.handleClickOutside = function (e4) {
                  r3.dropdownRef &&
                    !r3.dropdownContainerRef.contains(e4.target) &&
                    r3.state.showDropdown &&
                    r3.setState({ showDropdown: false });
                }),
                (r3.handleSearchChange = function (e4) {
                  var t3 = e4.currentTarget.value,
                    n2 = r3.state,
                    a2 = n2.preferredCountries,
                    o2 = n2.selectedCountry,
                    i2 = 0;
                  if ('' === t3 && o2) {
                    var u2 = r3.state.onlyCountries;
                    (i2 = r3
                      .concatPreferredCountries(a2, u2)
                      .findIndex(function (e5) {
                        return e5 == o2;
                      })),
                      setTimeout(function () {
                        return r3.scrollTo(r3.getElement(i2));
                      }, 100);
                  }
                  r3.setState({ searchValue: t3, highlightCountryIndex: i2 });
                }),
                (r3.concatPreferredCountries = function (e4, t3) {
                  return e4.length > 0 ? o(new Set(e4.concat(t3))) : t3;
                }),
                (r3.getDropdownCountryName = function (e4) {
                  return e4.localName || e4.name;
                }),
                (r3.getSearchFilteredCountries = function () {
                  var e4 = r3.state,
                    t3 = e4.preferredCountries,
                    n2 = e4.onlyCountries,
                    a2 = e4.searchValue,
                    i2 = r3.props.enableSearch,
                    u2 = r3.concatPreferredCountries(t3, n2),
                    c2 = a2.trim().toLowerCase().replace('+', '');
                  if (i2 && c2) {
                    if (/^\d+$/.test(c2))
                      return u2.filter(function (e5) {
                        var t4 = e5.dialCode;
                        return [''.concat(t4)].some(function (e6) {
                          return e6.toLowerCase().includes(c2);
                        });
                      });
                    var s3 = u2.filter(function (e5) {
                        var t4 = e5.iso2;
                        return [''.concat(t4)].some(function (e6) {
                          return e6.toLowerCase().includes(c2);
                        });
                      }),
                      l4 = u2.filter(function (e5) {
                        var t4 = e5.name,
                          r4 = e5.localName;
                        e5.iso2;
                        return [''.concat(t4), ''.concat(r4 || '')].some(
                          function (e6) {
                            return e6.toLowerCase().includes(c2);
                          }
                        );
                      });
                    return r3.scrollToTop(), o(new Set([].concat(s3, l4)));
                  }
                  return u2;
                }),
                (r3.getCountryDropdownList = function () {
                  var e4 = r3.state,
                    t3 = e4.preferredCountries,
                    a2 = e4.highlightCountryIndex,
                    o2 = e4.showDropdown,
                    i2 = e4.searchValue,
                    u2 = r3.props,
                    c2 = u2.disableDropdown,
                    s3 = u2.prefix,
                    l4 = r3.props,
                    f2 = l4.enableSearch,
                    d2 = l4.searchNotFound,
                    p2 = l4.disableSearchIcon,
                    h3 = l4.searchClass,
                    m4 = l4.searchStyle,
                    b3 = l4.searchPlaceholder,
                    g2 = l4.autocompleteSearch,
                    v3 = r3.getSearchFilteredCountries().map(function (e5, t4) {
                      var n2 = a2 === t4,
                        o3 = N()({
                          country: true,
                          preferred: 'us' === e5.iso2 || 'gb' === e5.iso2,
                          active: 'us' === e5.iso2,
                          highlight: n2,
                        }),
                        i3 = 'flag '.concat(e5.iso2);
                      return y.a.createElement(
                        'li',
                        Object.assign(
                          {
                            ref: function (e6) {
                              return (r3['flag_no_'.concat(t4)] = e6);
                            },
                            key: 'flag_no_'.concat(t4),
                            'data-flag-key': 'flag_no_'.concat(t4),
                            className: o3,
                            'data-dial-code': '1',
                            tabIndex: c2 ? '-1' : '0',
                            'data-country-code': e5.iso2,
                            onClick: function (t5) {
                              return r3.handleFlagItemClick(e5, t5);
                            },
                            role: 'option',
                          },
                          n2 ? { 'aria-selected': true } : {}
                        ),
                        y.a.createElement('div', { className: i3 }),
                        y.a.createElement(
                          'span',
                          { className: 'country-name' },
                          r3.getDropdownCountryName(e5)
                        ),
                        y.a.createElement(
                          'span',
                          { className: 'dial-code' },
                          e5.format
                            ? r3.formatNumber(e5.dialCode, e5)
                            : s3 + e5.dialCode
                        )
                      );
                    }),
                    C2 = y.a.createElement('li', {
                      key: 'dashes',
                      className: 'divider',
                    });
                  t3.length > 0 &&
                    (!f2 || (f2 && !i2.trim())) &&
                    v3.splice(t3.length, 0, C2);
                  var _3 = N()(
                    n(
                      { 'country-list': true, hide: !o2 },
                      r3.props.dropdownClass,
                      true
                    )
                  );
                  return y.a.createElement(
                    'ul',
                    {
                      ref: function (e5) {
                        return !f2 && e5 && e5.focus(), (r3.dropdownRef = e5);
                      },
                      className: _3,
                      style: r3.props.dropdownStyle,
                      role: 'listbox',
                      tabIndex: '0',
                    },
                    f2 &&
                      y.a.createElement(
                        'li',
                        { className: N()(n({ search: true }, h3, h3)) },
                        !p2 &&
                          y.a.createElement(
                            'span',
                            {
                              className: N()(
                                n(
                                  { 'search-emoji': true },
                                  ''.concat(h3, '-emoji'),
                                  h3
                                )
                              ),
                              role: 'img',
                              'aria-label': 'Magnifying glass',
                            },
                            '🔎'
                          ),
                        y.a.createElement('input', {
                          className: N()(
                            n({ 'search-box': true }, ''.concat(h3, '-box'), h3)
                          ),
                          style: m4,
                          type: 'search',
                          placeholder: b3,
                          autoFocus: true,
                          autoComplete: g2 ? 'on' : 'off',
                          value: i2,
                          onChange: r3.handleSearchChange,
                        })
                      ),
                    v3.length > 0
                      ? v3
                      : y.a.createElement(
                          'li',
                          { className: 'no-entries-message' },
                          y.a.createElement('span', null, d2)
                        )
                  );
                });
              var s2,
                l3 = new P(
                  e3.enableAreaCodes,
                  e3.enableTerritories,
                  e3.regions,
                  e3.onlyCountries,
                  e3.preferredCountries,
                  e3.excludeCountries,
                  e3.preserveOrder,
                  e3.masks,
                  e3.priority,
                  e3.areaCodes,
                  e3.localization,
                  e3.prefix,
                  e3.defaultMask,
                  e3.alwaysDefaultMask
                ),
                h2 = l3.onlyCountries,
                m3 = l3.preferredCountries,
                b2 = l3.hiddenAreaCodes,
                v2 = e3.value ? e3.value.replace(/\D/g, '') : '';
              s2 = e3.disableInitialCountryGuess
                ? 0
                : v2.length > 1
                  ? r3.guessSelectedCountry(
                      v2.substring(0, 6),
                      e3.country,
                      h2,
                      b2
                    ) || 0
                  : (e3.country &&
                      h2.find(function (t3) {
                        return t3.iso2 == e3.country;
                      })) ||
                    0;
              var _2,
                S2 =
                  v2.length < 2 && s2 && !j()(v2, s2.dialCode)
                    ? s2.dialCode
                    : '';
              _2 =
                '' === v2 && 0 === s2
                  ? ''
                  : r3.formatNumber(
                      (e3.disableCountryCode ? '' : S2) + v2,
                      s2.name ? s2 : void 0
                    );
              var x2 = h2.findIndex(function (e4) {
                return e4 == s2;
              });
              return (
                (r3.state = {
                  showDropdown: e3.showDropdown,
                  formattedNumber: _2,
                  onlyCountries: h2,
                  preferredCountries: m3,
                  hiddenAreaCodes: b2,
                  selectedCountry: s2,
                  highlightCountryIndex: x2,
                  queryString: '',
                  freezeSelection: false,
                  debouncedQueryStingSearcher: g()(r3.searchCountry, 250),
                  searchValue: '',
                }),
                r3
              );
            }
            var r2, l2, m2;
            return (
              (function (e3, t3) {
                if ('function' != typeof t3 && null !== t3)
                  throw new TypeError(
                    'Super expression must either be null or a function'
                  );
                (e3.prototype = Object.create(t3 && t3.prototype, {
                  constructor: {
                    value: e3,
                    writable: true,
                    configurable: true,
                  },
                })),
                  t3 && h(e3, t3);
              })(t2, e2),
              (r2 = t2),
              (l2 = [
                {
                  key: 'componentDidMount',
                  value: function () {
                    document.addEventListener &&
                      this.props.enableClickOutside &&
                      document.addEventListener(
                        'mousedown',
                        this.handleClickOutside
                      ),
                      this.props.onMount &&
                        this.props.onMount(
                          this.state.formattedNumber.replace(/[^0-9]+/g, ''),
                          this.getCountryData(),
                          this.state.formattedNumber
                        );
                  },
                },
                {
                  key: 'componentWillUnmount',
                  value: function () {
                    document.removeEventListener &&
                      this.props.enableClickOutside &&
                      document.removeEventListener(
                        'mousedown',
                        this.handleClickOutside
                      );
                  },
                },
                {
                  key: 'componentDidUpdate',
                  value: function (e3, t3, r3) {
                    e3.country !== this.props.country
                      ? this.updateCountry(this.props.country)
                      : e3.value !== this.props.value &&
                        this.updateFormattedNumber(this.props.value);
                  },
                },
                {
                  key: 'updateFormattedNumber',
                  value: function (e3) {
                    if (null === e3)
                      return this.setState({
                        selectedCountry: 0,
                        formattedNumber: '',
                      });
                    var t3 = this.state,
                      r3 = t3.onlyCountries,
                      n2 = t3.selectedCountry,
                      a2 = t3.hiddenAreaCodes,
                      o2 = this.props,
                      i2 = o2.country,
                      u2 = o2.prefix;
                    if ('' === e3)
                      return this.setState({
                        selectedCountry: n2,
                        formattedNumber: '',
                      });
                    var c2,
                      s2,
                      l3 = e3.replace(/\D/g, '');
                    if (n2 && j()(e3, u2 + n2.dialCode))
                      (s2 = this.formatNumber(l3, n2)),
                        this.setState({ formattedNumber: s2 });
                    else {
                      var f2 =
                        (c2 = this.props.disableCountryGuess
                          ? n2
                          : this.guessSelectedCountry(
                              l3.substring(0, 6),
                              i2,
                              r3,
                              a2
                            ) || n2) && j()(l3, u2 + c2.dialCode)
                          ? c2.dialCode
                          : '';
                      (s2 = this.formatNumber(
                        (this.props.disableCountryCode ? '' : f2) + l3,
                        c2 || void 0
                      )),
                        this.setState({
                          selectedCountry: c2,
                          formattedNumber: s2,
                        });
                    }
                  },
                },
                {
                  key: 'render',
                  value: function () {
                    var e3,
                      t3,
                      r3,
                      a2 = this,
                      o2 = this.state,
                      i2 = o2.onlyCountries,
                      u2 = o2.selectedCountry,
                      c2 = o2.showDropdown,
                      s2 = o2.formattedNumber,
                      l3 = o2.hiddenAreaCodes,
                      f2 = this.props,
                      d2 = f2.disableDropdown,
                      p2 = f2.renderStringAsFlag,
                      h2 = f2.isValid,
                      m3 = f2.defaultErrorMessage,
                      b2 = f2.specialLabel;
                    if ('boolean' == typeof h2) t3 = h2;
                    else {
                      var g2 = h2(s2.replace(/\D/g, ''), u2, i2, l3);
                      'boolean' == typeof g2
                        ? false === (t3 = g2) && (r3 = m3)
                        : ((t3 = false), (r3 = g2));
                    }
                    var v2 = N()(
                        (n((e3 = {}), this.props.containerClass, true),
                        n(e3, 'react-tel-input', true),
                        e3)
                      ),
                      C2 = N()({ arrow: true, up: c2 }),
                      _2 = N()(
                        n(
                          {
                            'form-control': true,
                            'invalid-number': !t3,
                            open: c2,
                          },
                          this.props.inputClass,
                          true
                        )
                      ),
                      w2 = N()({ 'selected-flag': true, open: c2 }),
                      S2 = N()(
                        n(
                          {
                            'flag-dropdown': true,
                            'invalid-number': !t3,
                            open: c2,
                          },
                          this.props.buttonClass,
                          true
                        )
                      ),
                      j2 = 'flag '.concat(u2 && u2.iso2);
                    return y.a.createElement(
                      'div',
                      {
                        className: ''
                          .concat(v2, ' ')
                          .concat(this.props.className),
                        style: this.props.style || this.props.containerStyle,
                        onKeyDown: this.handleKeydown,
                      },
                      b2 &&
                        y.a.createElement(
                          'div',
                          { className: 'special-label' },
                          b2
                        ),
                      r3 &&
                        y.a.createElement(
                          'div',
                          { className: 'invalid-number-message' },
                          r3
                        ),
                      y.a.createElement(
                        'input',
                        Object.assign(
                          {
                            className: _2,
                            style: this.props.inputStyle,
                            onChange: this.handleInput,
                            onClick: this.handleInputClick,
                            onDoubleClick: this.handleDoubleClick,
                            onFocus: this.handleInputFocus,
                            onBlur: this.handleInputBlur,
                            onCopy: this.handleInputCopy,
                            value: s2,
                            onKeyDown: this.handleInputKeyDown,
                            placeholder: this.props.placeholder,
                            disabled: this.props.disabled,
                            type: 'tel',
                          },
                          this.props.inputProps,
                          {
                            ref: function (e4) {
                              (a2.numberInputRef = e4),
                                'function' == typeof a2.props.inputProps.ref
                                  ? a2.props.inputProps.ref(e4)
                                  : 'object' ==
                                      typeof a2.props.inputProps.ref &&
                                    (a2.props.inputProps.ref.current = e4);
                            },
                          }
                        )
                      ),
                      y.a.createElement(
                        'div',
                        {
                          className: S2,
                          style: this.props.buttonStyle,
                          ref: function (e4) {
                            return (a2.dropdownContainerRef = e4);
                          },
                        },
                        p2
                          ? y.a.createElement('div', { className: w2 }, p2)
                          : y.a.createElement(
                              'div',
                              {
                                onClick: d2
                                  ? void 0
                                  : this.handleFlagDropdownClick,
                                className: w2,
                                title: u2
                                  ? ''
                                      .concat(u2.localName || u2.name, ': + ')
                                      .concat(u2.dialCode)
                                  : '',
                                tabIndex: d2 ? '-1' : '0',
                                role: 'button',
                                'aria-haspopup': 'listbox',
                                'aria-expanded': !!c2 || void 0,
                              },
                              y.a.createElement(
                                'div',
                                { className: j2 },
                                !d2 &&
                                  y.a.createElement('div', { className: C2 })
                              )
                            ),
                        c2 && this.getCountryDropdownList()
                      )
                    );
                  },
                },
              ]) && s(r2.prototype, l2),
              m2 && s(r2, m2),
              t2
            );
          })(y.a.Component);
        F.defaultProps = {
          country: '',
          value: '',
          onlyCountries: [],
          preferredCountries: [],
          excludeCountries: [],
          placeholder: '1 (702) 123-4567',
          searchPlaceholder: 'search',
          searchNotFound: 'No entries to show',
          flagsImagePath: './flags.png',
          disabled: false,
          containerStyle: {},
          inputStyle: {},
          buttonStyle: {},
          dropdownStyle: {},
          searchStyle: {},
          containerClass: '',
          inputClass: '',
          buttonClass: '',
          dropdownClass: '',
          searchClass: '',
          className: '',
          autoFormat: true,
          enableAreaCodes: false,
          enableTerritories: false,
          disableCountryCode: false,
          disableDropdown: false,
          enableLongNumbers: false,
          countryCodeEditable: true,
          enableSearch: false,
          disableSearchIcon: false,
          disableInitialCountryGuess: false,
          disableCountryGuess: false,
          regions: '',
          inputProps: {},
          localization: {},
          masks: null,
          priority: null,
          areaCodes: null,
          preserveOrder: [],
          defaultMask: '... ... ... ... ..',
          alwaysDefaultMask: false,
          prefix: '+',
          copyNumbersOnly: true,
          renderStringAsFlag: '',
          autocompleteSearch: false,
          jumpCursorToEnd: true,
          enableAreaCodeStretch: false,
          enableClickOutside: true,
          showDropdown: false,
          isValid: true,
          defaultErrorMessage: '',
          specialLabel: 'Phone',
          onEnterKeyPress: null,
          keys: {
            UP: 38,
            DOWN: 40,
            RIGHT: 39,
            LEFT: 37,
            ENTER: 13,
            ESC: 27,
            PLUS: 43,
            A: 65,
            Z: 90,
            SPACE: 32,
            TAB: 9,
          },
        };
        t.default = F;
      },
    ]);
  },
});
export default require_lib();
/*! Bundled license information:

react-phone-input-2/lib/lib.js:
  (*!
    Copyright (c) 2017 Jed Watson.
    Licensed under the MIT License (MIT), see
    http://jedwatson.github.io/classnames
  *)
*/
//# sourceMappingURL=react-phone-input-2.js.map
