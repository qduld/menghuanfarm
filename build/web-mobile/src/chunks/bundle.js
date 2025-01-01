System.register([], function(_export, _context) { return { execute: function () {
System.register("chunks:///_virtual/env",[],(function(e){return{execute:function(){e("DEV",!1)}}}));

System.register("chunks:///_virtual/index.js",["./rollupPluginModLoBabelHelpers.js"],(function(t){var r,e,n;return{setters:[function(t){r=t.inheritsLoose,e=t.assertThisInitialized,n=t.wrapNativeSuper}],execute:function(){t({isRGB:d,isRGBShort:v,json:h,parseLaunchParams:W,retrieveLaunchParams:function(){for(var t=[],r=0,e=[N,T,U];r<e.length;r++){var n=e[r];try{var a=n();return j(a),a}catch(a){t.push(a instanceof Error?a.message:JSON.stringify(a))}}throw new Error(["Unable to retrieve launch parameters from any known source. Perhaps, you have opened your app outside Telegram?\n","📖 Refer to docs for more information:","https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/environment\n","Collected errors:",t.map((function(t){return"— "+t}))].join("\n"))},searchParams:_,serializeLaunchParams:L,serializeThemeParams:I,toRGB:b});var a=t("SDKError",function(t){function n(r,a,o){var i;return(i=t.call(this,a,{cause:o})||this).type=r,Object.setPrototypeOf(e(i),n.prototype),i}return r(n,t),n}(n(Error)));function o(t,r,e){return new a(t,r,e)}var i=t("ERR_UNEXPECTED_TYPE","ERR_UNEXPECTED_TYPE"),s=t("ERR_PARSE","ERR_PARSE");function p(){return o(i,"Value has unexpected type")}var u=function(){function t(t,r,e){this.parser=t,this.isOptional=r,this.type=e}var r=t.prototype;return r.parse=function(t){if(!this.isOptional||void 0!==t)try{return this.parser(t)}catch(t){throw o(s,"Unable to parse value"+(this.type?" as "+this.type:""),t)}},r.optional=function(){return this.isOptional=!0,this},t}();function f(t,r){return function(){return new u(t,!1,r)}}var c=t("boolean",f((function(t){if("boolean"==typeof t)return t;var r=String(t);if("1"===r||"true"===r)return!0;if("0"===r||"false"===r)return!1;throw p()}),"boolean"));function l(t,r){var e={};for(var n in t){var a=t[n];if(a){var i=void 0,p=void 0;if("function"==typeof a||"parse"in a)i=n,p="function"==typeof a?a:a.parse.bind(a);else{var u=a.type;i=a.from||n,p="function"==typeof u?u:u.parse.bind(u)}try{var f=p(r(i));void 0!==f&&(e[n]=f)}catch(u){throw o(s,'Unable to parse field "'+n+'"',u)}}}return e}function m(t){var r=t;if("string"==typeof r&&(r=JSON.parse(r)),"object"!=typeof r||null===r||Array.isArray(r))throw p();return r}function h(t,r){return new u((function(r){var e=m(r);return l(t,(function(t){return e[t]}))}),!1,r)}var y=t("number",f((function(t){if("number"==typeof t)return t;if("string"==typeof t){var r=Number(t);if(!Number.isNaN(r))return r}throw p()}),"number")),g=t("string",f((function(t){if("string"==typeof t||"number"==typeof t)return t.toString();throw p()}),"string"));h({req_id:g(),data:function(t){return null===t?t:g().optional().parse(t)}}),h({req_id:g(),result:function(t){return t},error:g().optional()}),h({height:y(),width:function(t){return null==t?window.innerWidth:y().parse(t)},is_state_stable:c(),is_expanded:c()});function d(t){return/^#[\da-f]{6}$/i.test(t)}function v(t){return/^#[\da-f]{3}$/i.test(t)}function b(t){var r=t.replace(/\s/g,"").toLowerCase();if(d(r))return r;if(v(r)){for(var e="#",n=0;n<3;n+=1)e+=r[1+n].repeat(2);return e}var a=r.match(/^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/)||r.match(/^rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),\d{1,3}\)$/);if(!a)throw new Error('Value "'+t+'" does not satisfy any of known RGB formats.');return a.slice(1).reduce((function(t,r){var e=parseInt(r,10).toString(16);return t+(1===e.length?"0":"")+e}),"#")}var w=t("date",f((function(t){return t instanceof Date?t:new Date(1e3*y().parse(t))}),"Date"));function _(t,r){return new u((function(r){if("string"!=typeof r&&!(r instanceof URLSearchParams))throw p();var e="string"==typeof r?new URLSearchParams(r):r;return l(t,(function(t){var r=e.get(t);return null===r?void 0:r}))}),!1,r)}var P=h({id:y(),type:g(),title:g(),photoUrl:{type:g().optional(),from:"photo_url"},username:g().optional()},"Chat").optional(),S=h({addedToAttachmentMenu:{type:c().optional(),from:"added_to_attachment_menu"},allowsWriteToPm:{type:c().optional(),from:"allows_write_to_pm"},firstName:{type:g(),from:"first_name"},id:y(),isBot:{type:c().optional(),from:"is_bot"},isPremium:{type:c().optional(),from:"is_premium"},languageCode:{type:g().optional(),from:"language_code"},lastName:{type:g().optional(),from:"last_name"},photoUrl:{type:g().optional(),from:"photo_url"},username:g().optional()},"User").optional();var A=t("rgb",f((function(t){return b(g().parse(t))}),"rgb"));function E(t){return t.replace(/[A-Z]/g,(function(t){return"_"+t.toLowerCase()}))}var R=f((function(t){var r=A().optional();return Object.entries(m(t)).reduce((function(t,e){var n=e[0],a=e[1];return t[function(t){return t.replace(/_[a-z]/g,(function(t){return t[1].toUpperCase()}))}(n)]=r.parse(a),t}),{})}),"ThemeParams");function W(t){return _({botInline:{type:c().optional(),from:"tgWebAppBotInline"},initData:{type:_({authDate:{type:w(),from:"auth_date"},canSendAfter:{type:y().optional(),from:"can_send_after"},chat:P,chatInstance:{type:g().optional(),from:"chat_instance"},chatType:{type:g().optional(),from:"chat_type"},hash:g(),queryId:{type:g().optional(),from:"query_id"},receiver:S,startParam:{type:g().optional(),from:"start_param"},user:S},"InitData").optional(),from:"tgWebAppData"},initDataRaw:{type:g().optional(),from:"tgWebAppData"},platform:{type:g(),from:"tgWebAppPlatform"},showSettings:{type:c().optional(),from:"tgWebAppShowSettings"},startParam:{type:g().optional(),from:"tgWebAppStartParam"},themeParams:{type:R(),from:"tgWebAppThemeParams"},version:{type:g(),from:"tgWebAppVersion"}}).parse(t)}function D(t){return W(t.replace(/^[^?#]*[?#]/,"").replace(/[?#]/g,"&"))}function N(){return D(window.location.href)}function T(){var t=performance.getEntriesByType("navigation")[0];if(!t)throw new Error("Unable to get first navigation entry.");return D(t.name)}function O(t){return"telegram-apps/"+t.replace(/[A-Z]/g,(function(t){return"-"+t.toLowerCase()}))}function U(){return W(function(t){var r=sessionStorage.getItem(O(t));try{return r?JSON.parse(r):void 0}catch(t){}}("launchParams")||"")}function I(t){return JSON.stringify(Object.fromEntries(Object.entries(t).map((function(t){var r=t[0],e=t[1];return[E(r),e]}))))}function L(t){var r=t.initDataRaw,e=t.themeParams,n=t.platform,a=t.version,o=t.showSettings,i=t.startParam,s=t.botInline,p=new URLSearchParams;return p.set("tgWebAppPlatform",n),p.set("tgWebAppThemeParams",I(e)),p.set("tgWebAppVersion",a),r&&p.set("tgWebAppData",r),i&&p.set("tgWebAppStartParam",i),"boolean"==typeof o&&p.set("tgWebAppShowSettings",o?"1":"0"),"boolean"==typeof s&&p.set("tgWebAppBotInline",s?"1":"0"),p.toString()}function j(t){!function(t,r){sessionStorage.setItem(O(t),JSON.stringify(r))}("launchParams",L(t))}}}}));

System.register("chunks:///_virtual/rollupPluginModLoBabelHelpers.js",[],(function(e){return{execute:function(){function t(e,t,r,n,o,i,u){try{var a=e[i](u),c=a.value}catch(e){return void r(e)}a.done?t(c):Promise.resolve(c).then(n,o)}function r(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,y(n.key),n)}}function n(){return(n=e("extends",Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e})).apply(this,arguments)}function o(t){return(o=e("getPrototypeOf",Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)}))(t)}function i(t,r){return(i=e("setPrototypeOf",Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e}))(t,r)}function u(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}function a(t,r,n){return(a=u()?e("construct",Reflect.construct.bind()):e("construct",(function(e,t,r){var n=[null];n.push.apply(n,t);var o=new(Function.bind.apply(e,n));return r&&i(o,r.prototype),o}))).apply(null,arguments)}function c(e){return-1!==Function.toString.call(e).indexOf("[native code]")}function l(t){var r="function"==typeof Map?new Map:void 0;return(l=e("wrapNativeSuper",(function(e){if(null===e||!c(e))return e;if("function"!=typeof e)throw new TypeError("Super expression must either be null or a function");if(void 0!==r){if(r.has(e))return r.get(e);r.set(e,t)}function t(){return a(e,arguments,o(this).constructor)}return t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),i(t,e)})))(t)}function f(e,t){if(e){if("string"==typeof e)return p(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?p(e,t):void 0}}function p(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function s(e,t){if("object"!=typeof e||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}function y(e){var t=s(e,"string");return"symbol"==typeof t?t:String(t)}e({applyDecoratedDescriptor:function(e,t,r,n,o){var i={};Object.keys(n).forEach((function(e){i[e]=n[e]})),i.enumerable=!!i.enumerable,i.configurable=!!i.configurable,("value"in i||i.initializer)&&(i.writable=!0);i=r.slice().reverse().reduce((function(r,n){return n(e,t,r)||r}),i),o&&void 0!==i.initializer&&(i.value=i.initializer?i.initializer.call(o):void 0,i.initializer=void 0);void 0===i.initializer&&(Object.defineProperty(e,t,i),i=null);return i},arrayLikeToArray:p,assertThisInitialized:function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e},asyncToGenerator:function(e){return function(){var r=this,n=arguments;return new Promise((function(o,i){var u=e.apply(r,n);function a(e){t(u,o,i,a,c,"next",e)}function c(e){t(u,o,i,a,c,"throw",e)}a(void 0)}))}},construct:a,createClass:function(e,t,n){t&&r(e.prototype,t);n&&r(e,n);return Object.defineProperty(e,"prototype",{writable:!1}),e},createForOfIteratorHelperLoose:function(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(r)return(r=r.call(e)).next.bind(r);if(Array.isArray(e)||(r=f(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0;return function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")},extends:n,getPrototypeOf:o,inheritsLoose:function(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,i(e,t)},initializerDefineProperty:function(e,t,r,n){if(!r)return;Object.defineProperty(e,t,{enumerable:r.enumerable,configurable:r.configurable,writable:r.writable,value:r.initializer?r.initializer.call(n):void 0})},isNativeFunction:c,isNativeReflectConstruct:u,setPrototypeOf:i,toPrimitive:s,toPropertyKey:y,unsupportedIterableToArray:f,wrapNativeSuper:l})}}}));

} }; });