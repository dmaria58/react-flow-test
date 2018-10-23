'use strict';
//time类型

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var timeType = {
	TABLE_SOURCE: 3000,
	NOMAL_SOURCE: 1000,
	QUICK_TYPE: 300
};

var funList = {};
//时间列表
//const flowTimeObject= {};

var timeStep = "";

var tnum = 0;

var isflowcheck = true;

//模块错误则不往下执行
var errorType = {};

//模块方法列表
var flowFucList = {};

//已经走过的流程
var flowDoneList = {};

var doPlistObject = {};

var flowImport = function flowImport(_ref) {
	var id = _ref.id,
	    FlowMent = _ref.FlowMent,
	    doMent = _ref.doMent,
	    doLists = _ref.doLists,
	    doid = _ref.doid;

	if (errorType[doid] === undefined) {
		errorType[doid] = true;
	}

	FlowMent.type.prototype.componentWillMount = function () {
		//FlowMent.type.prototype.componentDidMount;
		funList[doid] = doMent(eval('this'), id);
		flowFunc(funList[doid], doLists, id, doid);
		doFunListf(doid, id);
	};
	FlowMent.type.prototype.componentWillUnmount = function () {
		if (id === doid) {
			clearFunDetail(doid);
		}
		//FlowMent.type.prototype.componentWillUnmount;
	};
};
//注销页面注销所有记录
var clearFunDetail = function clearFunDetail(doid) {
	delete errorType[doid];
	delete funList[doid];
	delete flowFucList[doid];
	delete doPlistObject[doid];
	delete flowDoneList[doid];
	clearTimeout(timeStep);
};

var getTimeFunList = function getTimeFunList(doList, doid) {
	if (!flowFucList[doid]) {
		flowFucList[doid] = getFlist(doList);
	}
};
var getFlist = function getFlist(doList, doid) {
	var flist = [];
	var timeList = [];
	var inum = 0;

	var _loop = function _loop(key) {
		var data = doList[key];
		data.map(function (list, i) {

			//有默认类型选默认类型时间，如果没有时间定义取 300
			var t = list.STEP_TIME ? timeType[list.STEP_TIME] ? timeType[list.STEP_TIME] : list.STEP_TIME : timeType['QUICK_TYPE'];
			if (timeList.length >= 1) {
				t = parseInt(t) + parseInt(timeList[timeList.length - 1]);
			}
			list.testKey = key;
			list.testTime = t;
			list.funNum = inum;
			flist.push(list);
			timeList.push(t);
			inum++;
		});
	};

	for (var key in doList) {
		_loop(key);
	}
	return flist;
};

var doFunListf = function doFunListf(doid, id) {
	var doPlist = doPlistObject[doid];
	if (!flowDoneList[doid]) {
		flowDoneList[doid] = {};
	}
	var i = 0;
	for (var key in doPlist) {
		if (i == key && !flowDoneList[doid][key]) {
			(function () {
				flowDoneList[doid][key] = key;
				var funList = doPlist[key].funList;
				var list = doPlist[key].list;
				var keyTest = list.testKey;
				timeStep = setTimeout(function () {
					if (errorType[doid] === false || !doPlistObject[doid]) {
						clearTimeout(timeStep);
						return;
					}
					funList[list.doMent](list.funKey);
					var disc = list.description ? list.description : "";
					if (list.checkReactDo) {
						var ischeckReactDo = true;
						var returndata = funList[list.doMent](list.funKey);
						var checkdata = list.checkReactDo;
						//判断是否需要验证
						if (typeof list.checkReactDo == 'function') {
							if (checkdata(returndata) != true) {
								ischeckReactDo = false;
							}
						} else if (_typeof(list.checkReactDo) == 'object') {
							checkReactDoIs(returndata, checkdata);
							if (isflowcheck == false) {
								ischeckReactDo = false;
							}
						} else {
							console.log("%c 【" + keyTest + "】" + list.num + " " + list.doMent + " 格式定义错误", "color:red");
							errorType[doid] = false;
							return;
						}
						//验证报错提醒
						if (ischeckReactDo == false) {
							console.log("%c 【" + keyTest + "】" + list.num + " " + list.doMent + "验证出错", "color:red", returndata);
							errorType[doid] = false;
							return;
						} else {
							console.log("%c 【" + keyTest + "】【验证】" + list.num + " " + list.doMent + " " + disc, "color:blue");
						}
					} else {
						console.log("%c 【" + keyTest + "】" + list.num + " " + list.doMent + " " + disc, "color:green");
					}
				}, list.testTime);
			})();
		}
		i++;
	}
};

var flowFunc = function flowFunc(funList, doList, id, doid) {
	getTimeFunList(doList, doid);
	if (!doPlistObject[doid]) {
		doPlistObject[doid] = [];
	}
	var doPlist = doPlistObject[doid];

	flowFucList[doid].map(function (list, inum) {
		if (!list.STEP_TIME || !list.doMent || !list.id || !list.funKey || !list.num) {
			console.log("%c 【ERROR】doList[" + num + "] 格式错误，STEP_TIME doMent funKey id num字段不可缺少", "color:red");
			return;
		}

		var key = list.testKey;

		if (list.doMent && funList[list.doMent] && id == list.id) {
			doPlistObject[doid][list.funNum] = { funList: funList, list: list };
		}
	});
	return;
};

var checkReactDoIs = function checkReactDoIs(rdata, cdata) {
	for (var key in cdata) {
		if (_typeof(cdata[key]) == "object") {
			checkReactDoIs(rdata[key], cdata[key]);
		} else {
			if (cdata[key] != rdata[key]) {
				console.log("%c 【error】" + key + " " + cdata[key] + "!=" + rdata[key], "color:red");
				isflowcheck = false;
			}
		}
	}
};

exports.flowImport = flowImport;
exports.flowFunc = flowFunc;
