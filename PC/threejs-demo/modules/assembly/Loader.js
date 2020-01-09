/*******************************************************************************
 * 版本：v1.0.0<br>
 * 文件：ACLoader.js<br>
 * 日期：2018年7月3日<br>
 * 作者: 刘鑫琦<br>
 * 功能：模型贴图加载<br>
 * 
 * 修改记录：<br>
 * 日期 描述 更新功能<br>
 * 
 ******************************************************************************/

import * as THREE from 'three'
import '../loaders/OBJLoader'
import '../loaders/ColladaLoader'
import ACAssembly from './Assembly'


var ACLoader = (function () {

	// var src = ACResolutionConfig.src;   		 	// 获得元素路径以及config文件

	var OBJLoader = new THREE.OBJLoader();			//用于加载obj模型

	var DAELoader = new THREE.ColladaLoader();		//用于加载dae模型

	var IMGLoader = new THREE.TextureLoader();		//用于加载图片

	var JSONLoader = new THREE.JSONLoader();		//用于加载json格式的模型

	var models = [];

	var images = {};

	var loaded = 0;
	var total = 0;


	function objLoader(url) {

		//obj格式加载
		var model;

		OBJLoader.load(url, function (obj) {

			model = obj;

			model.isObj = true;

			models.push(model);

			loaded++;

			manager(loaded);

		});

	}

	function daeLoader(url) {

		//dae格式加载,手动监听
		var model;

		DAELoader.load(url, function (collada) {

			model = collada.scene;

			model.isDae = true;

			models.push(model);

			loaded++;
			manager(loaded)
			
			
		});

	}

	function imgLoader(suffix,url) {

		//image加载
		var image;

		image = IMGLoader.load(url);
		// if(!images[suffix])images[suffix] = []
		images[suffix] = image;

		loaded++;

		manager(loaded);

	}

	function jsonLoader(url) {

		//json加载
		var model;

		JSONLoader.load(url, function (geometry, materials) {

			var material = materials[0];

			if (material.morphTargets) {

				material.morphTargets = true;

			}

			model = new THREE.Mesh(geometry, materials);

			model.matrixAutoUpdate = false;

			model.updateMatrix();


			models.push(model);

			loaded++;

			manager(loaded);

		});

	}

	function manager(loaded) {

		self.jdNum = Math.floor(((loaded) / (total)) * 100);

		self.loading.progress = self.jdNum

		if(self.jdNum == 100) ACAssembly(models, images, self.callback)    // OBJECT类型,需要转换为数组  {Desk: Group, anthill: Group, Ant: Group}

	}

	function load(src, loading, callback) {
		self.callback = callback;
		self.loading = loading 

		total = src.length;

		for (var arr of src) {

			var path = arr;

			var len = path.split(".").length;

			var fileName = path.split(".")[len - 2].split("/")[4];

			var TYPE = path.split(".")[len - 1];

			if (TYPE === 'obj') {

				objLoader(path);
		
			}
			if (TYPE === 'dae') {

				daeLoader(path);

			}
			if (TYPE === 'jpg' || TYPE === 'png') {

				imgLoader(fileName,path);

			}
			if (TYPE === 'js' || TYPE === 'json') {

				jsonLoader(path);

			}

		}

	}

	return load;
})();

export default ACLoader;

