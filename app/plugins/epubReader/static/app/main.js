kodReady.push(function(){
	if( !$.supportCanvas() ) return;
	Events.bind('explorer.kodApp.before',function(appList){
		appList.push({
			name:"epubReader",
			title:"{{LNG['epubReader.meta.title']}}",
			ext:"{{config.fileExt}}",
			sort:"{{config.fileSort}}",
			icon:'{{pluginHost}}static/app/images/icon.png',
			callback:function(){
				core.openFile('{{pluginApi}}',"{{config.openWith}}",_.toArray(arguments));
			}
		});		
	});	
});