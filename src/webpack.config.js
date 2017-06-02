module.exports={
	devtool:"source-map",
	entry:__dirname+'/main',
	output:{
		path:__dirname+'/public',
		filename:'bundle.js'
	},
	resolve: {
		alias: {
			vue: 'vue/dist/vue.js',
		}
	},
	//安装插件导入各种后缀文件
	module:{
		
		loaders:[{
			test: /\.js$/,
			loader:"babel-loader"
		},{
			test: /\.html$/, 
			loader:"html-loader"
		},{
			test: /\.vue$/,
			loader:"vue-loader"
		},{
			test: /\.css$/,
			loader:"style-loader!css-loader"
		}
		// ,{
		// 	test: /\.(png|jpg)$/,
		// 	loader:"url-loader?limit=50000&name=img" 
		// }
		]
	},
	//配置服务器
	devServer:{
		//服务器文件夹
		contentBase: "./public",
		//port
		//实时更新
		inline: true
	}
}