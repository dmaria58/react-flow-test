'use strict'
//time类型
const timeType = {
	TABLE_SOURCE: 3000,
	NOMAL_SOURCE: 1000,
	QUICK_TYPE: 300,	
}

let funList ={};
//时间列表
const flowTimeObject= {};

let flowTimeMode ={};

let tnum = 0;

let isflowcheck = true;
const flowImport = ({id,FlowMent,doMent,doLists,doid}) => {
  FlowMent.type.prototype.componentDidMount=()=>{
    FlowMent.type.prototype.componentDidMount;
    funList[doid]=doMent(eval('this'),id);
    flowFunc(funList[doid],doLists,id,doid);
  }
}

const flowFunc = (funList,doList,id,doid) => {	
	for(let key in doList){		
		flowTimeObject[doid] = flowTimeObject[doid]?flowTimeObject[doid]:0;		
		let data = doList[key];
		for(let num = 0 ;num<data.length;num++){
			let list = data[num];
			if(!list.STEP_TIME || !list.doMent || !list.id  || !list.funKey|| !list.num){
				console.log("%c 【ERROR】doList["+num+"] 格式错误，STEP_TIME doMent funKey id num字段不可缺少", "color:red");
				return;
			}		
					
			if(!flowTimeMode[key] && flowTimeObject[doid]==0){
				flowTimeMode[key]=[timeType[list.STEP_TIME]];
				flowTimeObject[doid] += timeType[list.STEP_TIME]?timeType[list.STEP_TIME]:list.STEP_TIME;
			}
			else if(!flowTimeMode[key] && flowTimeObject[doid]){
				flowTimeObject[doid] += timeType[list.STEP_TIME]?timeType[list.STEP_TIME]:list.STEP_TIME;
				flowTimeMode[key]=[flowTimeObject[doid]];
			}
			else{
				flowTimeObject[doid] += timeType[list.STEP_TIME]?timeType[list.STEP_TIME]:list.STEP_TIME;
				flowTimeMode[key].push(flowTimeObject[doid]);				
			}


			if(list.doMent && funList[list.doMent] && id == list.id){
				
				setTimeout(()=>{					    			
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
							console.log("%c 【"+key+"】"+list.num+" "+list.doMent +" 格式定义错误", "color:red");
							return
						}
						//验证报错提醒
						if(ischeckReactDo == false){
							console.log("%c 【"+key+"】"+list.num+" "+list.doMent +"验证出错","color:red",returndata);
						}
						else{
							console.log("%c 【"+key+"】【验证】"+list.num+" "+list.doMent +" "+disc, "color:blue")	
						}
							
					}
					else{
						console.log("%c 【"+key+"】"+list.num+" "+list.doMent +" "+disc, "color:green")	
					}							
				},flowTimeMode[key][num])
			}
		}	
	}
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