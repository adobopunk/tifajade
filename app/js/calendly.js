(() => {
  var e = {
      d: (t, o) => {
        for (var n in o)
          e.o(o, n) &&
            !e.o(t, n) &&
            Object.defineProperty(t, n, { enumerable: !0, get: o[n] });
      },
      o: (e, t) => Object.prototype.hasOwnProperty.call(e, t),
      r: (e) => {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(e, "__esModule", { value: !0 });
      },
    },
    t = {};
  (() => {
    "use strict";
    e.r(t),
      e.d(t, {
        closePopupWidget: () => _,
        destroyBadgeWidget: () => U,
        initBadgeWidget: () => R,
        initInlineWidget: () => x,
        initPopupWidget: () => W,
        showPopupWidget: () => I,
      });
    const o = (e) => {
        ["interactive", "complete"].includes(document.readyState)
          ? e()
          : document.addEventListener("DOMContentLoaded", e);
      },
      n = (e, t) =>
        Object.fromEntries(Object.entries(e).map(([e, o]) => [t(o, e), o])),
      i = (e) =>
        e
          .split(/(?=[A-Z])/)
          .join("_")
          .toLowerCase(),
      r = (e, t) =>
        Object.fromEntries(Object.entries(e).filter(([e]) => t.includes(e))),
      s = (e) =>
        e
          ? Object.fromEntries(
              e
                .substr(1)
                .split("&")
                .map((e) => e.split("="))
                .map(([e, t]) => [e, decodeURIComponent(t)])
            )
          : {};
    var l = Object.defineProperty,
      a = Object.getOwnPropertySymbols,
      d = Object.prototype.hasOwnProperty,
      c = Object.prototype.propertyIsEnumerable,
      u = (e, t, o) =>
        t in e
          ? l(e, t, {
              enumerable: !0,
              configurable: !0,
              writable: !0,
              value: o,
            })
          : (e[t] = o),
      p = (e, t) => {
        for (var o in t || (t = {})) d.call(t, o) && u(e, o, t[o]);
        if (a) for (var o of a(t)) c.call(t, o) && u(e, o, t[o]);
        return e;
      };
    class h {
      constructor(e) {
        var t, o;
        (t = "isMobile"),
          (o =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
            )),
          u(this, t + "", o),
          (this.options = e),
          this.parseOptions();
      }
      inject() {
        return (
          this.build(),
          this.format(),
          "inline" === this.embedType.toLowerCase() &&
            this.resize &&
            this.attachResizeListener(),
          this.parent.appendChild(this.buildSpinner()),
          this.parent.appendChild(this.node)
        );
      }
      parseOptions() {
        if (
          ((this.options = Object.assign(
            {},
            { inlineStyles: !1, resize: !1 },
            this.options
          )),
          (this.parent = this.options.parentElement),
          !this.parent)
        )
          throw new Error("Calendly: Parent element not set");
        if (
          (this.parent.jquery && (this.parent = this.parent[0]),
          (this.inlineStyles = this.options.inlineStyles),
          (this.embedType = this.options.embedType),
          (this.url = (this.options.url || this.getUrlFromParent()).split(
            "#"
          )[0]),
          (this.resize = this.options.resize),
          !this.url)
        )
          throw new Error("Calendly: Widget URL not set");
      }
      build() {
        (this.node = document.createElement("iframe")),
          (this.node.src = this.getSource()),
          (this.node.width = "100%"),
          (this.node.height = "100%"),
          (this.node.frameBorder = "0"),
          (this.node.title = "Select a Date & Time - Calendly");
      }
      getSource() {
        const e = new URL(this.url, window.location);
        return (e.search = this.getQuery()), e.toString();
      }
      getUrlFromParent() {
        return this.parent.getAttribute("data-url");
      }
      getQuery() {
        return (
          (e = p(
            p(
              p(
                { embed_domain: this.getDomain(), embed_type: this.embedType },
                this.getUtmParamsFromHost()
              ),
              this.getParamsFromUrl()
            ),
            this.getParamsFromOptions()
          )),
          `?${Object.entries(e)
            .map(([e, t]) => [e, encodeURIComponent(t)].join("="))
            .join("&")}`
        );
        var e;
      }
      getUtmParamsFromHost() {
        const e = s(new URL(window.location.href).search);
        return r(e, [
          "utm_campaign",
          "utm_source",
          "utm_medium",
          "utm_content",
          "utm_term",
          "salesforce_uuid",
        ]);
      }
      getParamsFromUrl() {
        return s(new URL(this.url, window.location).search);
      }
      getParamsFromOptions() {
        return p(p({}, this.getPrefillParams()), this.getUtmParams());
      }
      getUtmParams() {
        if (!this.options.utm) return [];
        const e = r(this.options.utm, [
          "utmCampaign",
          "utmSource",
          "utmMedium",
          "utmContent",
          "utmTerm",
          "salesforceUuid",
        ]);
        return n(e, (e, t) => i(t));
      }
      getPrefillParams() {
        if (!this.options.prefill) return [];
        const e = r(this.options.prefill, [
            "name",
            "firstName",
            "lastName",
            "email",
          ]),
          t = n(e, (e, t) => i(t));
        if (this.options.prefill.customAnswers) {
          const e = this.options.prefill.customAnswers;
          Object.entries(e).forEach(([e, o]) => {
            e.match(/^a\d{1,2}$/) && (t[e] = o);
          });
        }
        return t;
      }
      getDomain() {
        return window.location.host;
      }
      format() {
        return this.isMobile ? this.formatMobile() : this.formatDesktop();
      }
      formatDesktop() {
        this.inlineStyles &&
          this.parent.setAttribute(
            "style",
            `position: relative;${this.parent.getAttribute("style")}`
          );
      }
      formatMobile() {
        if (this.inlineStyles) {
          const e = `position: relative;-webkit-overflow-scrolling:touch;${this.parent.getAttribute(
            "style"
          )}`;
          this.parent.setAttribute("style", e);
        }
        this.parent.className += " calendly-mobile";
      }
      attachResizeListener() {
        const e = (e) => {
          this.parent.style.height = e;
        };
        window.addEventListener("message", (t) => {
          t.data.event &&
            "calendly.page_height" === t.data.event &&
            (e(t.data.payload.height),
            this.parent.getBoundingClientRect().top < 0 &&
              this.parent.scrollIntoView(!0, { behavior: "auto" }));
        });
      }
      buildSpinner() {
        const e = document.createElement("div");
        return (
          (e.className = "calendly-spinner"),
          e.appendChild(this.buildBounce(1)),
          e.appendChild(this.buildBounce(2)),
          e.appendChild(this.buildBounce(3)),
          e
        );
      }
      buildBounce(e) {
        const t = document.createElement("div");
        return (t.className = `calendly-bounce${e}`), t;
      }
    }
    class m {
      constructor(e) {
        this.options = e;
      }
      destroy() {
        return this.widget.parentNode.removeChild(this.widget);
      }
      buildWidget() {
        return (
          (this.widget = document.createElement("div")),
          (this.widget.className = "calendly-badge-widget"),
          this.widget.appendChild(this.buildContent())
        );
      }
      inject() {
        return (
          this.buildWidget(),
          document.body.insertBefore(this.widget, document.body.firstChild)
        );
      }
      buildContent() {
        const e = document.createElement("div");
        return (
          (e.className = "calendly-badge-content"),
          "#ffffff" === this.options.color &&
            (e.className += " calendly-white"),
          (e.onclick = this.options.onClick),
          (e.innerHTML = this.options.text),
          (e.style.background = this.options.color),
          (e.style.color = this.options.textColor),
          this.options.branding && e.appendChild(this.buildBranding()),
          e
        );
      }
      buildBranding() {
        const e = document.createElement("span");
        return (e.innerHTML = ""), e;
      }
    }
    var y = !1;
    if ("undefined" != typeof window) {
      var b = {
        get passive() {
          y = !0;
        },
      };
      window.addEventListener("testPassive", null, b),
        window.removeEventListener("testPassive", null, b);
    }
    var v =
        "undefined" != typeof window &&
        window.navigator &&
        window.navigator.platform &&
        (/iP(ad|hone|od)/.test(window.navigator.platform) ||
          ("MacIntel" === window.navigator.platform &&
            window.navigator.maxTouchPoints > 1)),
      g = [],
      f = !1,
      w = -1,
      P = void 0,
      C = void 0,
      O = void 0,
      E = function (e) {
        return g.some(function (t) {
          return !(!t.options.allowTouchMove || !t.options.allowTouchMove(e));
        });
      },
      S = function (e) {
        var t = e || window.event;
        return (
          !!E(t.target) ||
          t.touches.length > 1 ||
          (t.preventDefault && t.preventDefault(), !1)
        );
      };
    class j {
      constructor(e, t, o, n = {}) {
        (this.close = this.close.bind(this)),
          (this.url = e),
          (this.onClose = t),
          (this.embedType = o),
          (this.options = n);
      }
      show() {
        return this.buildOverlay(), this.insertOverlay(), this.lockPageScroll();
      }
      close() {
        return this.unlockPageScroll(), this.destroyOverlay(), this.onClose();
      }
      buildOverlay() {
        return (
          (this.overlay = document.createElement("div")),
          (this.overlay.className = "calendly-overlay"),
          this.overlay.appendChild(this.buildCloseOverlay()),
          this.overlay.appendChild(this.buildPopup()),
          this.overlay.appendChild(this.buildCloseButton())
        );
      }
      insertOverlay() {
        return document.body.appendChild(this.overlay);
      }
      buildCloseOverlay() {
        const e = document.createElement("div");
        return (
          (e.className = "calendly-close-overlay"), (e.onclick = this.close), e
        );
      }
      buildPopup() {
        const e = document.createElement("div");
        return (
          (e.className = "calendly-popup"),
          e.appendChild(this.buildPopupContent()),
          e
        );
      }
      buildPopupContent() {
        const e = document.createElement("div");
        return (
          (e.className = "calendly-popup-content"),
          e.setAttribute("data-url", this.url),
          (this.options.parentElement = e),
          (this.options.embedType = this.embedType),
          new h(this.options).inject(),
          e
        );
      }
      buildCloseButton() {
        const e = document.createElement("div");
        return (
          (e.className = "calendly-popup-close"), (e.onclick = this.close), e
        );
      }
      destroyOverlay() {
        return this.overlay.parentNode.removeChild(this.overlay);
      }
      lockPageScroll() {
        return (
          (function (e, t) {
            if (e) {
              if (
                !g.some(function (t) {
                  return t.targetElement === e;
                })
              ) {
                var o = { targetElement: e, options: t || {} };
                (g = [].concat(
                  (function (e) {
                    if (Array.isArray(e)) {
                      for (var t = 0, o = Array(e.length); t < e.length; t++)
                        o[t] = e[t];
                      return o;
                    }
                    return Array.from(e);
                  })(g),
                  [o]
                )),
                  v
                    ? window.requestAnimationFrame(function () {
                        if (void 0 === C) {
                          C = {
                            position: document.body.style.position,
                            top: document.body.style.top,
                            left: document.body.style.left,
                          };
                          var e = window,
                            t = e.scrollY,
                            o = e.scrollX,
                            n = e.innerHeight;
                          (document.body.style.position = "fixed"),
                            (document.body.style.top = -t + "px"),
                            (document.body.style.left = -o + "px"),
                            setTimeout(function () {
                              return window.requestAnimationFrame(function () {
                                var e = n - window.innerHeight;
                                e &&
                                  t >= n &&
                                  (document.body.style.top = -(t + e) + "px");
                              });
                            }, 300);
                        }
                      })
                    : (function (e) {
                        if (void 0 === O) {
                          var t = !!e && !0 === e.reserveScrollBarGap,
                            o =
                              window.innerWidth -
                              document.documentElement.clientWidth;
                          if (t && o > 0) {
                            var n = parseInt(
                              window
                                .getComputedStyle(document.body)
                                .getPropertyValue("padding-right"),
                              10
                            );
                            (O = document.body.style.paddingRight),
                              (document.body.style.paddingRight = n + o + "px");
                          }
                        }
                        void 0 === P &&
                          ((P = document.body.style.overflow),
                          (document.body.style.overflow = "hidden"));
                      })(t),
                  v &&
                    ((e.ontouchstart = function (e) {
                      1 === e.targetTouches.length &&
                        (w = e.targetTouches[0].clientY);
                    }),
                    (e.ontouchmove = function (t) {
                      1 === t.targetTouches.length &&
                        (function (e, t) {
                          var o = e.targetTouches[0].clientY - w;
                          !E(e.target) &&
                            ((t && 0 === t.scrollTop && o > 0) ||
                            ((function (e) {
                              return (
                                !!e &&
                                e.scrollHeight - e.scrollTop <= e.clientHeight
                              );
                            })(t) &&
                              o < 0)
                              ? S(e)
                              : e.stopPropagation());
                        })(t, e);
                    }),
                    f ||
                      (document.addEventListener(
                        "touchmove",
                        S,
                        y ? { passive: !1 } : void 0
                      ),
                      (f = !0)));
              }
            } else
              console.error(
                "disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices."
              );
          })(this.overlay),
          document.addEventListener("touchmove", this.handleLockedTouchmove, {
            passive: !1,
          })
        );
      }
      unlockPageScroll() {
        var e;
        return (
          (e = this.overlay)
            ? ((g = g.filter(function (t) {
                return t.targetElement !== e;
              })),
              v &&
                ((e.ontouchstart = null),
                (e.ontouchmove = null),
                f &&
                  0 === g.length &&
                  (document.removeEventListener(
                    "touchmove",
                    S,
                    y ? { passive: !1 } : void 0
                  ),
                  (f = !1))),
              v
                ? (function () {
                    if (void 0 !== C) {
                      var e = -parseInt(document.body.style.top, 10),
                        t = -parseInt(document.body.style.left, 10);
                      (document.body.style.position = C.position),
                        (document.body.style.top = C.top),
                        (document.body.style.left = C.left),
                        window.scrollTo(t, e),
                        (C = void 0);
                    }
                  })()
                : (void 0 !== O &&
                    ((document.body.style.paddingRight = O), (O = void 0)),
                  void 0 !== P &&
                    ((document.body.style.overflow = P), (P = void 0))))
            : console.error(
                "enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices."
              ),
          document.removeEventListener(
            "touchmove",
            this.handleLockedTouchmove,
            { passive: !1 }
          )
        );
      }
      handleLockedTouchmove(e) {
        return e.preventDefault();
      }
    }
    var T = Object.defineProperty,
      A = Object.getOwnPropertySymbols,
      L = Object.prototype.hasOwnProperty,
      B = Object.prototype.propertyIsEnumerable,
      k = (e, t, o) =>
        t in e
          ? T(e, t, {
              enumerable: !0,
              configurable: !0,
              writable: !0,
              value: o,
            })
          : (e[t] = o);
    const M = (e) => "true" === e.getAttribute("data-resize"),
      N = {},
      _ = () => {
        N.popup && N.popup.close();
      },
      I = (e, t = "PopupText", o = {}) => {
        _(), (N.popup = new j(e, () => delete N.popup, t, o)), N.popup.show();
      },
      U = () => {
        N.badge && (N.badge.destroy(), delete N.badge);
      },
      x = (e) => {
        e.url &&
          (null != e.parentElement ||
            (e.parentElement =
              document.scripts[document.scripts.length - 1].parentNode),
          o(() => {
            (e.embedType = "Inline"), new h(e).inject();
          }));
      },
      R = (e) => {
        o(() =>
          ((e) => {
            U();
            const t = ((e) => {
                const t = {};
                return (
                  ["color", "textColor", "text", "branding"].forEach((o) => {
                    (t[o] = e[o]), delete e[o];
                  }),
                  t
                );
              })(e),
              o = ((e, t) => {
                for (var o in t || (t = {})) L.call(t, o) && k(e, o, t[o]);
                if (A) for (var o of A(t)) B.call(t, o) && k(e, o, t[o]);
                return e;
              })({ onClick: () => I(e.url, "PopupWidget", e) }, t);
            (N.badge = new m(o)), N.badge.inject();
          })(e)
        );
      },
      W = (e) => {
        o(() => I(e.url, "PopupText", e));
      };
    o(() => {
      const e = document.querySelectorAll(".calendly-inline-widget");
      Array.from(e).forEach((e) => {
        ((e) =>
          e.getAttribute("data-processed") ||
          "false" === e.getAttribute("data-auto-load"))(e) ||
          (e.setAttribute("data-processed", !0),
          new h({
            parentElement: e,
            inlineStyles: !0,
            embedType: "Inline",
            resize: M(e),
          }).inject());
      });
    });
  })();
  var o = (Calendly = "undefined" == typeof Calendly ? {} : Calendly);
  for (var n in t) o[n] = t[n];
  t.__esModule && Object.defineProperty(o, "__esModule", { value: !0 });
})();
