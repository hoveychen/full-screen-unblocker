// helper for outerHTML
function GetOuterHTML(o)
{
	var a=o.attributes, str="<"+o.tagName, i=0;
	for(;i<a.length;i++) 
	if(a[i].specified) str+=" "+a[i].name+'="'+a[i].value+'"'; 
	if(!o.canHaveChildren) return str+" />"; 
	return str+">"+o.innerHTML+"</"+o.tagName+">"; 
}


var fsunblocker = {
	video_pattern : [
		/youku\.com/i,
		/tudou\.com/i
	],
	onLoad: function() {
		// initialization code
		this.initialized = true;
		fsunblocker.strings = document.getElementById("fsunblocker-strings");
		window.setInterval(fsunblocker.checkVideoState, 500);
	},
	
	checkVideoState: function() {
		var docs = content.document;
		var objs = docs.getElementsByTagName("embed");
		var id = "fullscreened_movie_player";
		var foundVideo = false;
		var count = 0;
		for (var i=0; i < objs.length; ++i ) {
			var obj = objs[i];
			if (obj.id == id) {
				foundVideo = true;
				continue;
			}
			if (obj.checked) continue;
			obj.checked = true;
			
			var isVideo = false;
			for (var j = 0; j < fsunblocker.video_pattern.length; ++j) {
				if (fsunblocker.video_pattern[j].test(obj.src)) {
					isVideo = true;
				}
			}
			if (!isVideo) continue;
			var cnt = GetOuterHTML(obj);
			var isAutoPlay = "false";
			var ret = (/isAutoPlay="?'?(\w+)"?'?/i).exec(cnt);
			if (ret != null) {
				isAutoPlay = ret[1];
			}
			var videoIDS = "";
			ret = (/VideoIDS="?'?([\d\w]+)"?'?/i).exec(cnt);
			if (ret != null) {
				videoIDS = "&VideoIDS=" +ret[1];
			}
			var newEmbed = 
				"<embed " + 
				"name='" + id + "' " + 
				"id='" + id + "'" + 
				"width='" + obj.width + "' " + 
				"height='" + obj.height + "' " + 
				"src='" + obj.src + "' " + 
				"allowNetworking='internal'" + 
				"allowFullScreen='true' " +
				"allowscriptaccess='sameDomain' " +
				"play='true'"+ 
				"flashvars='channel=29&isShowRelatedVideo=false&showAd=0&show_pre=0&show_next=0&isAutoPlay=" + isAutoPlay + videoIDS +  "&isDebug=false&winType=interior&playMovie=true&MMControl=false&MMout=false&RecordCode=1001,1002,1003,1004,1005,1006,2001,3001,3002,3003,3004,3005,3007,3008,9999' " + 
				"wmode='transparent' " +
				"menu='false' " +
				"quality='high' " +
				"type='application/x-shockwave-flash' " +
				"pluginspage='http://www.macromedia.com/go/getflashplayer'/>";
			var tmpDiv = docs.createElement("div");
			tmpDiv.innerHTML = newEmbed;
			var newNode = tmpDiv.firstChild;
			obj.parentNode.replaceChild(newNode,obj);
			foundVideo = true;
			++count;
			if (count > 1) break;
		}
		fsunblocker.setIcon(foundVideo);
	},
	
	setIcon: function(flag) {
		var statusBar = document.getElementById("fsunblocker-statuspanelImage");
		if (flag) {
			statusBar.setAttribute("status", "active");
			statusBar.setAttribute("tooltiptext", fsunblocker.strings.getString("activeMsg"));
		} else {
			statusBar.setAttribute("status", "inactive");
			statusBar.setAttribute("tooltiptext", fsunblocker.strings.getString("inactiveMsg"));
		}		
	}
};

window.addEventListener("load", fsunblocker.onLoad, false);

 var _gaq = _gaq || [];
 _gaq.push(['_setAccount', 'UA-20850194-1']);
 _gaq.push(['_trackPageview']);

 (function() {
   var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
   ga.src = 'https://ssl.google-analytics.com/ga.js';
   var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
 })();