import Login from './views/Login.vue'
import Home from './views/Home.vue'
import User from './views/User.vue'
import Device from './views/Device.vue'
// import Group from './views/Group.vue'
import Config from './views/Config.vue'

let routes = [
    {
        path: '/',
        component: Login,
        // name: '',
        hidden: false
    },
    {
        path: '/Device',
        component: Home,
        // name: '设备管理',
        children: [
            { path: '/Device', component: Device, name: '设备管理' },
        ]
    },
    // {
    //     path: '/Group',
    //     component: Home,
    //     // name: '群组管理',
    //     children: [
    //         { path: '/Group',component: Group, name: '群组管理'}
    //     ]
    // },
    {
        path: '/User',
        component: Home,
        // name: '用户管理',
        children: [
            { path: '/User', component: User, name: '用户管理' },
        ]
    },
    {
        path: '/Config',
        component: Home,
        // name: '修改密码',
        children: [
            { path: '/Config', component: Config, name: '修改密码' },
        ]
    },
];

export default routes;