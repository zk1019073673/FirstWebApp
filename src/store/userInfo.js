import * as tokenPrc from '../js/tokenProcess'
export default {
    state:{
        userInfo: {
            "id":0,
            "username":null,
            "type":1,
            "loginTs":0,
            "phone":null,
            "email":null
        }
    },
    getters:{
        userInfo(state){
            return state.userInfo
        }
    },
    mutations:{
        //使用commit来触发mutations中的方法
        saveUserInfo(state){
            // alert("mutations被调用！")
            let user = tokenPrc.getUserInfoFromToken()
            console.log(user)
            state.userInfo.id = user.id
            state.userInfo.username = user.username
            state.userInfo.type = user.type
            state.userInfo.loginTs = user.loginTs
            state.userInfo.phone = user.phone
            state.userInfo.email = user.email
            // alert("userInfo:"+state.userInfo.phone+state.userInfo.email)
        }
    },
    actions:{
        //使用dispatch来触发action中的方法
        saveUserInfo(context){//这里的context和我们使用的$store拥有相同的对象和方法
            context.commit('saveUserInfo');
            //你还可以在这里触发其他的mutations方法
        },
    }
}