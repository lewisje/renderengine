var userAgent=navigator.userAgent.toLowerCase();$.extend(jQuery.browser,{chrome:/chrome/.test(userAgent),Wii:/nintendo wii/.test(userAgent),android:/android/.test(userAgent)&&/AppleWebKit/.test(userAgent),iPhone:/iphone/.test(userAgent)&&/safari/.test(userAgent),WiiMote:window.opera&&window.opera.wiiremote?window.opera.wiiremote:null,WiiScreenWidth:800,WiiScreenHeight:460});
jQuery.extend(jQuery.expr[":"],{"in":function(b,c,a){b=parseInt(a[3].split("-")[0]);a=parseInt(a[3].split("-")[1]);return c>=b&&c<=a},inx:function(b,c,a){b=parseInt(a[3].split("-")[0]);a=parseInt(a[3].split("-")[1]);return c>b&&c<a},notin:function(b,c,a){b=parseInt(a[3].split("-")[0]);a=parseInt(a[3].split("-")[1]);return c<=b||c>=a},notinx:function(b,c,a){b=parseInt(a[3].split("-")[0]);a=parseInt(a[3].split("-")[1]);return c<b||c>a},siblings:"jQuery(a).siblings(m[3]).length>0",parents:"jQuery(a).parents(m[3]).length>0"});