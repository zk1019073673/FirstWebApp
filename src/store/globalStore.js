export default {
    state:{
        show: true
    },
    getters:{
        not_show(state){//这里的state对应着上面这个state
            return !state.show;
        }
    },
    mutations:{
        //使用commit来触发mutations中的方法
        switch_state(state){
            state.show = state.show ? false : true
            // alert("mutations被调用！")
        }
    },
    actions:{
        //使用dispatch来触发action中的方法
        switch_state(context){//这里的context和我们使用的$store拥有相同的对象和方法
            context.commit('switch_state');
            //你还可以在这里触发其他的mutations方法
        },
    }
}