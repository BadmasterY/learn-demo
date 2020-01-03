/***
 *  设置模型材质模块
 *  作者：Badmaster
 *  创建时间：2018-1-17 13:27:36
 *  修改人：Badmaster
 *  修改时间：2018-3-7 17:07:50
 *  修改描述：扩展可添加属性，修改描述
 *  版本：v0.1
 *  描述：设置模型材质
 *  使用方法：将该方法在initScene中调用，使用方法直接调用exp.setMaterial({...})即可
 *  
 *  				参数  				描述
 *  			roughness : 光滑度 0-1 0为光滑 1为不光滑 默认1
 *  			metalness : 金属度 0-1 0为非金属 1为金属 默认1
 *  			color : 颜色 默认0xc6c6c6
 *  			emissive : 自发光 默认0x000000
 *  			side : 面的渲染类型 默认THREE.DoubleSide
 *  			transparent : 是否打开alpha通道 false不打开 true打开 默认false
 *  			opa : 透明度 0-1 0为透明 1为不透明 默认1
 *  			refl : 环境贴图的反射程度 0-1 0为不反射环境贴图 1为完全反射环境贴图 默认1
 *  			depthWrite : 是否进行深度写入 true为写入 false为不写入 默认true
 *  			D : mesh.material.map 默认null
 *  			N : mesh.material.normalMap 默认null
 *  			M : mesh.material.metalnessMap 默认null
 *  			R : mesh.material.roughnessMap 默认null
 *  			envMap : mesh.material.envMap 默认null
 *  			
 *  返回值：THREE.MeshStandardMaterial
 ***/

import * as THREE from 'three'


let SetMaterial = (function(){

	function setMater(conf) {

		let material;

		let roughness = conf.roughness !== undefined ? conf.roughness : 1;
		let metalness = conf.metalness !== undefined ? conf.metalness : 1;
		let color = conf.color !== undefined ? conf.color : 0xc6c6c6;
		let emissive = conf.emissive !== undefined ? conf.emissive : 0x000000;
		let side = conf.side !== undefined ? conf.side : THREE.DoubleSide;
		let transparent = conf.transparent !== undefined ? conf.transparent : false;
		let opacity = conf.opa !== undefined ? conf.opa : 1;
		let reflectivity = conf.refl !== undefined ? conf.refl : 1;
		let depthWrite = conf.depthWrite !== undefined ? conf.depthWrite : true;

		let map_D = conf.D !== undefined ? conf.D : null;
		let map_R = conf.R !== undefined ? conf.R : null;
		let map_N = conf.N !== undefined ? conf.N : null;
		let map_Metal = conf.M !== undefined ? conf.M : null;
		let map_ENV = conf.envMap !== undefined ? conf.envMap : null;

		material = new THREE.MeshStandardMaterial({

			roughness: roughness,
			metalness: metalness,
			color: color,
			emissive: emissive,
			side: side,
			transparent: transparent,
			opacity: opacity,
			depthWrite: depthWrite,
			reflectivity: reflectivity,
			map: map_D,
			roughnessMap: map_R,
			normalMap: map_N,
			metalnessMap: map_Metal,
			envMap: map_ENV

		});

		return material;
	}

	return setMater;

})();

export default SetMaterial;
