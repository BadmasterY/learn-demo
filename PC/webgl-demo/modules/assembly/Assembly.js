/*******************************************************************************
 * 版本：v1.0.0<br>
 * 文件：ACAssembly.js<br>
 * 日期：2018年7月4日<br>
 * 作者: 刘鑫琦<br>
 * 功能：组装模型和贴图<br>
 * 
 * 修改记录：<br>
 * 日期 描述 更新功能<br>
 * 
 ******************************************************************************/

import ACResolutionConfig from './ResolutionConfig'
import SetMaterial from '../setMaterial'

var ACAssembly = (function () {
	var configs = ACResolutionConfig.Configs;
	var textures = [];
	var modsClone = [];
	var textureClone = [];
	self.objmods = {};

	function getTexture(configs, images) {
		for (var key in configs) {
			if(configs[key].D)configs[key].D = images[configs[key].D]
			if(configs[key].R)configs[key].R = images[configs[key].R]
			if(configs[key].N)configs[key].N = images[configs[key].N]
			if(configs[key].M)configs[key].M = images[configs[key].M]
			textures.push(SetMaterial(configs[key]));
		}
		return textures;
	}

	function assembly(models, images, callback) {
		
		var texture = getTexture(configs,images);

		for (var key in models) {
			modsClone.push(models[key]);
		}
		for (var key in textures) {
			textureClone.push(texture[key]);
		}
		for (var key in modsClone) {
			modsClone[key].traverse(function (child) {
				if (child.isMesh) {
					child.material = textureClone[key];
					child.castShadow = true;
				}
			});
			
			modsClone[key].name = configs[key].name;
			textureClone[key].name = configs[key].name;
		}

		for (var key in modsClone) {
			self.objmods[configs[key].name] = modsClone[key];
		}

		callback.scenarios(images,self.objmods);
		
		return  self.objmods 
	}


	return assembly


})();


export default ACAssembly 