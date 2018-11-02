'use strict'
//time类型
const timeType = {
	TABLE_SOURCE: 3000,
	NOMAL_SOURCE: 1000,
	QUICK_TYPE: 300,	
}

let funList ={};
//时间列表
//const flowTimeObject= {};

let timeStep = "";

let tnum = 0;

let isflowcheck = true;

//模块错误则不往下执行
let errorType = {};

//模块方法列表
let flowFucList = {};

//已经走过的流程
let flowDoneList = {};

const doPlistObject = {};

const flowImport = ({id,FlowMent,doMent,doLists,doid}) => {
  if(errorType[doid] === undefined){
  	errorType[doid] = true;
  }
  let ocomponentWillMount = FlowMent.type.prototype.componentWillMount;
  FlowMent.type.prototype.componentWillMount=()=>{
    funList[doid]=doMent(eval('this'),id);
    flowFunc(
    	funList[doid],
    	doLists,
    	id,
    	doid,
    	);
    doFunListf(doid,id);
	if(ocomponentWillMount){
		ocomponentWillMount.apply(eval('this'), arguments);
	}
  }
  let ocomponentWillUnmount = FlowMent.type.prototype.componentWillUnmount;
  FlowMent.type.prototype.componentWillUnmount=()=>{
  	if(id === doid){
		clearFunDetail(doid)
  	}  	
	if(ocomponentWillUnmount){
		ocomponentWillUnmount.apply(eval('this'), arguments);
	}	
  }
}
//注销页面注销所有记录
const clearFunDetail = (doid) => {
	delete errorType[doid];
	delete funList[doid];
	delete flowFucList[doid];
	delete doPlistObject[doid];
	delete flowDoneList[doid];
	clearTimeout(timeStep);
}

const getTimeFunList = (doList,doid) => {
	if(!flowFucList[doid]){
		flowFucList[doid] = getFlist(doList);
		
	}
}
const getFlist = (doList,doid) => {
	let flist = [];
	let timeList = [];
	let inum = 0;
	for(let key in doList){
		let data = doList[key];
		data.map((list,i)=>{
			
				//有默认类型选默认类型时间，如果没有时间定义取 300
				let t = list.STEP_TIME?(timeType[list.STEP_TIME]?timeType[list.STEP_TIME]:list.STEP_TIME):timeType['QUICK_TYPE'];
				if(timeList.length >=1){
					t = parseInt(t)+parseInt(timeList[timeList.length-1]);
				}	
				list.testKey = key;
				list.testTime = t;
				list.funNum = inum;
				flist.push(list);
				timeList.push(t);
				inum++;
			
		})
	}
	return flist;
}

const doFunListf = (doid,id)=>{
	let doPlist = doPlistObject[doid];
	if(!flowDoneList[doid]){
		flowDoneList[doid]={};
	}
	let i = 0;
	for(let key in doPlist){
		if(i == key && !flowDoneList[doid][key]){
			flowDoneList[doid][key] = key
			let funList = doPlist[key].funList;
			let list = doPlist[key].list;
			let keyTest = list.testKey
				timeStep = setTimeout(()=>{		
					if(errorType[doid] === false || !doPlistObject[doid]){
						clearTimeout(timeStep);
						return;
					}		    			
					funList[list.doMent](list.funKey);				
					let disc = list.description?list.description:"";
					if(list.checkReactDo){
						let ischeckReactDo = true;
						let returndata = funList[list.doMent](list.funKey);
						let checkdata = list.checkReactDo;
						//判断是否需要验证
						if(typeof(list.checkReactDo) == 'function'){
							if( checkdata(returndata)!= true){
								ischeckReactDo = false;
							}
						}
						else if(typeof(list.checkReactDo) == 'object'){
							checkReactDoIs(returndata,checkdata); 
							if( isflowcheck == false){
								ischeckReactDo = false;
							}
						}
						else{
							console.log("%c 【"+keyTest+"】"+list.num+" "+list.doMent +" 格式定义错误", "color:red");
							errorType[doid] = false;
							return;
						}
						//验证报错提醒
						if(ischeckReactDo == false){
							console.log("%c 【"+keyTest+"】"+list.num+" "+list.doMent +"验证出错","color:red",returndata);
							errorType[doid] = false;
							return;
						}
						else{
							console.log("%c 【"+keyTest+"】【验证】"+list.num+" "+list.doMent +" "+disc, "color:blue")	
						}
							
					}
					else{
						console.log("%c 【"+keyTest+"】"+list.num+" "+list.doMent +" "+disc, "color:green")	
					}							
			    },list.testTime)
		}
		i++;

	}
	
}


const  flowFunc = (funList,doList,id,doid) => {	
    getTimeFunList(doList,doid);	
	if(!doPlistObject[doid]){
		doPlistObject[doid]=[]
	}
	let doPlist = doPlistObject[doid]
	
	flowFucList[doid].map((list,inum)=>{
			if(!list.STEP_TIME || !list.doMent || !list.id  || !list.funKey|| !list.num){
				console.log("%c 【ERROR】doList["+num+"] 格式错误，STEP_TIME doMent funKey id num字段不可缺少", "color:red");
				return;
			}		
	
			let key = list.testKey;

			if(list.doMent && funList[list.doMent] && id == list.id  ){
				doPlistObject[doid][list.funNum] = {funList:funList,list:list};
			}		
	})
	return;
}



const checkReactDoIs =(rdata,cdata)=> {
	for(let key in cdata){
		if(typeof(cdata[key])== "object"){
			checkReactDoIs(rdata[key],cdata[key])
		}
		else{
			if(cdata[key] != rdata[key]){
				console.log("%c 【error】"+key+" "+ cdata[key] +"!="+ rdata[key] ,"color:red");
				isflowcheck = false;
			}
		}
	}
}

export {flowImport,flowFunc}