// cosmJS
// version 1.0.0
// (c) 2012 Cosm Ltd, a LogMeIn company [pete.correia@cosm.com]
// http://cosm.github.com/cosm-js/
// released under the MIT license
var cosm=function(a){"use strict";var b,c="http://api.cosm.com/v2/",d,e=function(a){if(typeof a==="function"){a.apply(this,Array.prototype.slice.call(arguments,1))}else if(Object.prototype.toString.apply(a)==="[object Array]"){var b=a.length;while(b--){a[b].apply(this,Array.prototype.slice.call(arguments,1))}}},f=function(a){if(window.console&&window.console.log){window.console.log(a)}},g=function(c){var d=a.extend({type:"get"},c);if(!b){return f("(cosmJS) ::: No API key ::: Set your API key first with cosm.setKey( YOUR_API_KEY ) before using any methods. Check docs for more info.")}if(!d.url){return}d.type=d.type.toUpperCase();if(d.type==="PUT"||d.type==="POST"){if(!d.data||typeof d.data!=="object"){return}else{d.data=JSON.stringify(d.data)}}a.ajax({url:d.url,type:d.type,headers:{"X-ApiKey":b},data:d.data,crossDomain:true,dataType:"json",cache:false}).done(d.done).fail(d.fail).always(d.always)},h={socket:false,socketReady:false,queue:[],resources:[]};h.connect=function(b){if(window.MozWebSocket){window.WebSocket=window.MozWebSocket}if(!h.socket&&window.WebSocket){h.socket=new WebSocket("ws://api.cosm.com:8080/");h.socket.onerror=function(a){if(h.error){h.error(a,this)}h.connect()};h.socket.onclose=function(a){if(h.close){h.close(a,this)}h.connect()};h.socket.onopen=function(a){h.socketReady=true;if(h.open){h.open(a,this)}if(h.queue.length){e(h.queue)}if(b){b(this)}};h.socket.onmessage=function(b){var c=b.data,d=JSON.parse(c);if(d.body){a("body").trigger("cosm."+d.resource,d.body)}}}};h.subscribe=function(c,d){var e='{"headers":{"X-ApiKey":"'+b+'"}, "method":"subscribe", "resource":"'+c+'"}';if(!b){return f("(cosmJS) ::: No API key ::: Set your API key first with cosm.setKey( YOUR_API_KEY ) before using any methods. Check docs for more info.")}if(!h.resources[c]){h.resources.push(c);if(!h.socketReady){h.connect();h.queue.push(function(){h.socket.send(e)})}else{h.socket.send(e)}}if(d&&typeof d==="function"){a(document).on("cosm."+c,d)}};h.unsubscribe=function(a){var c='{"headers":{"X-ApiKey":"'+b+'"}, "method":"unsubscribe", "resource":"'+a+'"}';if(!b){return f("(cosmJS) ::: No API key ::: Set your API key first with cosm.setKey( YOUR_API_KEY ) before using any methods. Check docs for more info.")}if(h.socket){h.socket.send(c)}};a.ajaxSetup({cache:false});d={endpoint:c,setKey:function(a){b=a},request:function(a){g(a)},subscribe:function(a,b){h.subscribe(a,b)},unsubscribe:function(a){h.unsubscribe(a)},live:function(b,d){var e=function(c,e){var f=c.current_value?c:e;if(f.current_value){a(b).each(function(){a(this).html(f.current_value).attr("data-cosm-resource",d)})}};g({url:c+d.replace(/^\//,""),always:e});h.subscribe(d,e)},stop:function(b){h.unsubscribe(a(b).first().attr("data-cosm-resource"))},feed:{get:function(a,b){g({url:c+"feeds/"+a+".json",always:b})},update:function(a,b,d){g({type:"put",url:c+"feeds/"+a+".json",data:b,always:d})},"new":function(a,b){g({type:"post",url:c+"feeds",data:a,always:b})},"delete":function(a,b){g({type:"delete",url:c+"feeds/"+a,always:b})},history:function(a,b,d){g({url:c+"feeds/"+a+".json",data:b,always:d})},list:function(a,b){g({url:c+"feeds",data:a,always:b})},subscribe:function(a,b){if(a){h.subscribe("/feeds/"+a,b)}},unsubscribe:function(a,b){if(a){h.unsubscribe("/feeds/"+a)}}},datastream:{get:function(a,b,d){g({url:c+"feeds/"+a+"/datastreams/"+b+".json",always:d})},update:function(a,b,d,e){g({type:"put",url:c+"feeds/"+a+"/datastreams/"+b+".json",data:d,always:e})},"new":function(a,b,d){g({type:"post",url:c+"feeds/"+a+"/datastreams",data:b,always:d})},"delete":function(a,b,d){g({type:"delete",url:c+"feeds/"+a+"/datastreams/"+b,always:d})},history:function(a,b,d,e){g({url:c+"feeds/"+a+"/datastreams/"+b+".json",data:d,always:e})},list:function(a,b){g({url:c+"feeds/"+a+".json",always:function(a){b.call(this,a.datastreams)}})},subscribe:function(a,b,c){if(a&&b){h.subscribe("/feeds/"+a+"/datastreams/"+b,c)}},unsubscribe:function(a,b,c){if(a&&b){h.unsubscribe("/feeds/"+a+"/datastreams/"+b)}},live:function(a,b,c){if(a&&b&&c){d.live(a,"/feeds/"+b+"/datastreams/"+c)}},stop:function(a){if(a){d.stop(a)}}},datapoint:{get:function(a,b,d,e){g({url:c+"feeds/"+a+"/datastreams/"+b+"/datapoints/"+d,always:e})},update:function(a,b,d,e,f){g({type:"put",url:c+"feeds/"+a+"/datastreams/"+b+"/datapoints/"+d,data:{value:e},always:f})},"new":function(a,b,d,e){g({type:"post",url:c+"feeds/"+a+"/datastreams/"+b+"/datapoints",data:d,always:e})},"delete":function(a,b,d,e){var f={type:"delete",always:e};if(typeof d==="object"){f.url=c+"feeds/"+a+"/datastreams/"+b+"/datapoints";f.data=d}else{f.url=c+"feeds/"+a+"/datastreams/"+b+"/datapoints/"+d}g(f)},history:function(a,b,d,e){g({url:c+"feeds/"+a+"/datastreams/"+b+".json",data:d,always:function(a){e.call(this,a.datapoints)}})}}};return d}(jQuery);(function(a){"use strict";var b=function(a){if(typeof a==="object"){return"/feeds/"+a.feed+(a.datastream?"/datastreams/"+a.datastream:"")}else if(typeof a==="string"&&a!==""){return a}else{return""}},c={live:function(a){cosm.live(this,b(a));return this},get:function(c){var d=a(this);cosm.request({url:cosm.endpoint+b(c)+".json",always:function(b){d.each(function(){a(this).html(b.current_value)})}});return this}};a.fn.cosm=function(b){if(c[b]){return c[b].apply(this,Array.prototype.slice.call(arguments,1))}else if(typeof b==="object"||!b){return c.init.apply(this,arguments)}else{a.error("Method "+b+" does not exist on jQuery.tooltip")}}})(jQuery);