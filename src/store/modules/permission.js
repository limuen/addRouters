import { asyncRoutes, errorRoutes, constantRoutes } from '@/router'
import Layout from '@/layout'
/**
 * 遍历后台传来的路由字符串，转换为组件对象
 * @param asyncRouter
 */

export function filterAsyncRoutes(asyncRouter) {
  // 遍历后台传来的路由字符串，转换为组件对象
  const accessedRoutes = []
  asyncRouter.forEach(router => {
    if (router.component) {
      if (router.component === 'Layout') {
        // Layout组件特殊处理
        router.component = Layout
      } else {
        const component = router.component
        router.component = () => import(`@/views${component}`)
      }
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRoutes(router.children)
    }
    accessedRoutes.push(router)
  })
  return accessedRoutes
}




/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
// export function filterAsyncRoutes(routes, roles) {
//   const res = []

//   routes.forEach(route => {
//     const tmp = { ...route }
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRoutes(tmp.children, roles)
//       }
//       res.push(tmp)
//     }
//   })

//   return res
// }

const state = {
  routes: [],
  buttons: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTERS: (state, routes) => {
    state.addRoutes = routes
    // 动态路由
    // state.routes = constantRoutes.concat(routes)
    // 本地路由
    state.routes = constantRoutes
  },
  SET_BUTTONS: (state, buttons) => {
    state.buttons = buttons
  }
}

// const actions = {
//   generateRoutes({ commit }, roles) {
//     return new Promise(resolve => {
//       let accessedRoutes
//       if (roles.includes('admin')) {
//         accessedRoutes = asyncRoutes || []
//       } else {
//         accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
//       }
//       commit('SET_ROUTES', accessedRoutes)
//       resolve(accessedRoutes)
//     })
//   }
// }

/**
 * @param routers
 * @param buttons
 */

const actions = {
  generateRoutes({ commit }, { routers, buttons }) {
    return new Promise(resolve => {
      console.log(routers)
      // 动态路由
      // const accessedRoutes = filterAsyncRoutes(routers).concat(errorRoutes)
      // 静态路由
      const accessedRoutes = constantRoutes
      commit('SET_ROUTERS', accessedRoutes)
      // // commit('SET_BUTTONS', buttons)
      resolve(accessedRoutes)
    })
  }
}



export default {
  namespaced: true,
  state,
  mutations,
  actions
}
