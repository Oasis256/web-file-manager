<?php
class webConsolePlugin extends PluginBase{
	function __construct(){
		parent::__construct();
	}
	public function regist(){
		$this->hookRegist(array(
			'user.view.options.after' => 'webConsolePlugin.addMenu',
		));
	}
	public function addMenu($options){
		$config = $this->getConfig();
		$menu = array(
			'name'		=> LNG('webConsole.meta.title'),
			'icon'		=> $this->appIcon(),
			'url'		=> $this->pluginApi,
			'target'	=> $config['openWith'],
			'subMenu'	=> $config['menuSubMenu'],
			'use'		=> '1'
		);
		return ActionCall('admin.setting.addMenu',$options,$menu);
	}	
	public function index(){
		header('Location: '.$this->pluginHost.'lib/');
	}
}