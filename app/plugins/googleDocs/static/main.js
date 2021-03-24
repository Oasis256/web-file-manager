kodReady.push(function(){
	Events.bind('explorer.kodApp.before',function(appList){
		appList.push({
			name:"googleDocs",
			title:"{{LNG['googleDocs.meta.name']}}",
			ext:"{{config.fileExt}}",
			sort:"{{config.fileSort}}",
			icon:'{{pluginHost}}static/images/icon.png',
			callback:function(path,ext,name){
				var url = '{{pluginApi}}&path='+core.path2url(path);
				core.openWindow(url);//不支持对话框打开
			}
		});
	});
});
