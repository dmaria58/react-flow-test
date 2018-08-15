##入参
flowImport({
    doid:"Main",  //整个模块共用一个doid
    id: "Main",  //单独子组件id
    FlowMent: <Main />, //子组件
    doMent,             //暴露组件内部方法
    doLists             //单元测试列表
})


##单元测试列表格式
doLists =[{
            STEP_TIME: "QUICK_TYPE",  //多少毫秒后执行
            funKey:{},                //传参  
            doMent: "PackSKUCodeEnter", //调用方法
            id:"Pack",                  //id必填
            num:1,                      //必填，console时区分进行到哪一步,建议调用的方法和验证的方法num设置成一样，便于区分
            description: "Pack"                //描述 不必须
            checkReactDo:{} || function   //如果此字段存在，则为校验方法，doMent必须返回需要验证的状态
        }]

STEP_TIME格式：可选用默认时间，也可自定义     自定义时间如下 ms

const timeType = {
    TABLE_SOURCE: 3000,
    NOMAL_SOURCE: 1000,
    QUICK_TYPE: 300,    
}


