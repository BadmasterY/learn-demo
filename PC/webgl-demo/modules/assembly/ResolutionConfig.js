/*******************************************************************************
 * 版本：v1.0.0<br>
 * 文件：ACResolution.js<br>
 * 日期：2018年7月2日<br>
 * 作者: 刘鑫琦<br>
 * 功能：配置文件解析<br>
 * 
 * 修改记录：<br>
 * 日期 描述 更新功能<br>
 * 
 ******************************************************************************/
 
import config from 'confPath/config'
import $ from 'jquery'
import constants from 'confPath/js/constants.js'

const path = require('path')

 var ACResolutionConfig = (function(){
		var models = config.models;    // config是本地config文件定义的
		var modConfigsSrc = [];     // json文件路径
		var Configs = [];        // json文件内容
		var name = [];
		var model = [];
		var image = [];
		var modsrc = [];
		var imgsrc = [];
		var src = [];            // 所有路径
		var Root = path.join(__dirname,constants.FolderName)

		// 获得模型json文件路径
		for(var key in models){   
			 // ../../xxx/yyy/config.json
			if(process.env.NODE_ENV !== 'production'){
				modConfigsSrc.push(constants.RootUrl + Root + "/models/" + models[key] + config.cof);
			}else{
				modConfigsSrc.push(constants.RootUrl + "/models/" + models[key] + config.cof);
			}
		}

		// 获取各个模型json文件内容
		for(var key in modConfigsSrc){
			$.ajax({
				url: modConfigsSrc[key],
				datatype: "json",
				async: false,
				data:{},
				success: function(result){
					// {name : xxx, models : yyy, images: zzz}
					Configs.push(result);   
				}
			});							
		}

		for(var key in Configs){
			name[key] = Configs[key].name;
			model[key] = Configs[key].models.split(",");
			image[key] = Configs[key].images.split(",");
		}

		// 所有模型路径
		for (var i in name){
			for(var j in model[i]){
				if(process.env.NODE_ENV !== 'production'){
					modsrc.push(constants.RootUrl+Root + "/models/" + name[i] + "/" + model[i][j]);
				}else{
					modsrc.push(constants.RootUrl + "/models/" + name[i] + "/" + model[i][j]);
				}
			}
		}

		// 所有的图片路径
		for (var i in name){
			for(var j in image[i]){
				if(process.env.NODE_ENV !== 'production'){
					imgsrc.push(constants.RootUrl+Root + "/models/" + name[i] + "/" +image[i][j]);
				}else{
					imgsrc.push(constants.RootUrl + "/models/" + name[i] + "/" +image[i][j]);
				}
			}
		}
		
		var src = (modsrc.toString() + "," +imgsrc.toString()).split(",");
		var result = [src, Configs];
		return{
			src : src,
			Configs : Configs 
		}

	 })();
	 
export default ACResolutionConfig;