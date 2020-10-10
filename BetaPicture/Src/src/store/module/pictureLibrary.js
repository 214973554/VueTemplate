import axios from "@/axios/axios";

export default {
	namespaced: true,
	state: {},
	getters: {},
	mutations: {},
	actions: {
		//根据查询条件获取图片数据集合
		GetFileLibraryList(context, payload) {
			return new Promise((resolve, reject) => {
				axios
					.getData(`/Beta.HomeWebAPI/api/FileLibrary/GetFileLibraryList`, payload, "post")
					.then(res => {
						resolve(res);
					})
					.catch(err => {
						console.log(err);
						reject(err);
					});
			});
		},
		//获取图片分类数据集合
		GetCategoryList(context, payload) {
			return new Promise((resolve, reject) => {
				axios
					.getData(`/Beta.HomeWebAPI/api/FileLibrary/GetCategoryList`, payload, "get")
					.then(res => {
						resolve(res);
					})
					.catch(err => {
						console.log(err);
						reject(err);
					});
			});
		},
		//新增或者修改图片分类
		AddOrUpdCategoryInfo(context, payload) {
			return new Promise((resolve, reject) => {
				axios
					.getData(`/Beta.HomeWebAPI/api/FileLibrary/AddOrUpdCategoryInfo`, payload, "post")
					.then(res => {
						resolve(res);
					})
					.catch(err => {
						console.log(err);
						reject(err);
					});
			});
		},
		//新增或者修改图片
		AddOrUpdFileLibraryInfo(context, payload) {
			return new Promise((resolve, reject) => {
				axios
					.getData(`/Beta.HomeWebAPI/api/FileLibrary/AddOrUpdFileLibraryInfo`, payload, "post")
					.then(res => {
						resolve(res);
					})
					.catch(err => {
						console.log(err);
						reject(err);
					});
			});
		},
		//根据主键id删除图片信息
		DelFileLibraryInfoById(context, payload) {
			return new Promise((resolve, reject) => {
				axios
					.getData(`/Beta.HomeWebAPI/api/FileLibrary/DelFileLibraryInfoById`, payload, "post")
					.then(res => {
						resolve(res);
					})
					.catch(err => {
						console.log(err);
						reject(err);
					});
			});
		},
		//上传图片
		Upload(context, payload) {
			return new Promise((resolve, reject) => {
				axios
					.getData(`/Beta.FileService/api/Files/Upload?modelID=57007&type=uploadimage&storage=WxArticle&cid=101`, payload, "formdata")
					.then(res => {
						resolve(res);
					})
					.catch(err => {
						console.log(err);
						reject(err);
					});
			});
		},
		//修改图片使用次数
		UpdFileLibraryUseCountById(context, payload) {
			return new Promise((resolve, reject) => {
				axios
					.getData(`/Beta.HomeWebAPI/api/FileLibrary/UpdFileLibraryUseCountById`, payload, "get")
					.then(res => {
						resolve(res);
					})
					.catch(err => {
						console.log(err);
						reject(err);
					});
			});
		},
		//修改图片使用次数
		GetFileLibraryInfoById(context, payload) {
			return new Promise((resolve, reject) => {
				axios
					.getData(`/Beta.HomeWebAPI/api/FileLibrary/GetFileLibraryInfoById`, payload, "get")
					.then(res => {
						resolve(res);
					})
					.catch(err => {
						console.log(err);
						reject(err);
					});
			});
		},
		//下载批量导入模板
		FileDownload(context, payload) {
			return new Promise((resolve, reject) => {
				axios
					.getData(`/Beta.HomeWebAPI/api/FileLibrary/FileDownload`, payload, "get")
					.then(res => {
						resolve(res);
					})
					.catch(err => {
						reject(err);
					});
			});
		},
		//上传数据
		BulkImport(context, payload) {
			return new Promise((resolve, reject) => {
				axios
					.getData(`/Beta.HomeWebAPI/api/FileLibrary/BulkImport`, payload, "post")
					.then(res => {
						resolve(res);
					})
					.catch(err => {
						reject(err);
					});
			});
		},
	},
};
