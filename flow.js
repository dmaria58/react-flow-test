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
var flowTimeObject = {};

var flowTimeMode = {};

var tnum = 0;

var isflowcheck = true;
var flowImport = function flowImport(_ref) {
	var id = _ref.id,
	    FlowMent = _ref.FlowMent,
	    doMent = _ref.doMent,
	    doLists = _ref.doLists,
	    doid = _ref.doid;

	FlowMent.type.prototype.componentDidMount = function () {
		FlowMent.type.prototype.componentDidMount;
		funList[doid] = doMent(eval('this'), id);
		flowFunc(funList[doid], doLists, id, doid);
	};
};

var flowFunc = function flowFunc(funList, doList, id, doid) {
	var _loop = function _loop(key) {
		flowTimeObject[doid] = flowTimeObject[doid] ? flowTimeObject[doid] : 0;
		var data = doList[key];

		var _loop2 = function _loop2(num) {
			var list = data[num];
			if (!list.STEP_TIME || !list.doMent || !list.id || !list.funKey || !list.num) {
				console.log("%c 【ERROR】doList[" + num + "] 格式错误，STEP_TIME doMent funKey id num字段不可缺少", "color:red");
				return {
					v: {
						v: void 0
					}
				};
			}

			if (!flowTimeMode[key] && flowTimeObject[doid] == 0) {
				flowTimeMode[key] = [timeType[list.STEP_TIME]];
				flowTimeObject[doid] += timeType[list.STEP_TIME] ? timeType[list.STEP_TIME] : list.STEP_TIME;
			} else if (!flowTimeMode[key] && flowTimeObject[doid]) {
				flowTimeObject[doid] += timeType[list.STEP_TIME] ? timeType[list.STEP_TIME] : list.STEP_TIME;
				flowTimeMode[key] = [flowTimeObject[doid]];
			} else {
				flowTimeObject[doid] += timeType[list.STEP_TIME] ? timeType[list.STEP_TIME] : list.STEP_TIME;
				flowTimeMode[key].push(flowTimeObject[doid]);
			}

			if (list.doMent && funList[list.doMent] && id == list.id) {

				setTimeout(function () {
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
							console.log("%c 【" + key + "】" + list.num + " " + list.doMent + " 格式定义错误", "color:red");
							return;
						}
						//验证报错提醒
						if (ischeckReactDo == false) {
							console.log("%c 【" + key + "】" + list.num + " " + list.doMent + "验证出错", "color:red", returndata);
						} else {
							console.log("%c 【" + key + "】【验证】" + list.num + " " + list.doMent + " " + disc, "color:blue");
						}
					} else {
						console.log("%c 【" + key + "】" + list.num + " " + list.doMent + " " + disc, "color:green");
					}
				}, flowTimeMode[key][num]);
			}
		};

		for (var num = 0; num < data.length; num++) {
			var _ret2 = _loop2(num);

			if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
		}
	};

	for (var key in doList) {
		var _ret = _loop(key);

		if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	}
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
