import {
  BASE_MOBILE_STYLE, COMMON_BACKGROUND, COMMON_BACKGROUND_NONE,
  HYPERLINKS
} from '@/components/canvas/custom-component/component-list'

import {
  ApplicationContext
} from '@/utils/ApplicationContext'
import { uuid } from 'vue-uuid'
import store from '@/store'
import { AIDED_DESIGN } from '@/views/panel/panel'

export function deepCopy(target) {
  if (typeof target === 'object') {
    const result = Array.isArray(target) ? [] : {}
    for (const key in target) {
      if (typeof target[key] === 'object') {
        result[key] = deepCopy(target[key])
      } else {
        result[key] = target[key]
      }
    }

    return result
  }

  return target
}

export function swap(arr, i, j) {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

export function moveUp(arr, i) {
  arr.splice(i + 1, 0, arr.splice(i, 1)[0])
}

export function moveDown(arr, i) {
  arr.splice(i, 0, arr.splice(i - 1, 1)[0])
}

export function toTop(arr, i, j) {
  arr.push(arr.splice(i, 1)[0])
}

export function toBottom(arr, i) {
  arr.unshift(arr.splice(i, 1)[0])
}
export function $(selector) {
  return document.querySelector(selector)
}

export function mobile2MainCanvas(mainSource, mobileSource) {
  mainSource.mobileSelected = true
  mainSource.mobileStyle.style = {
    width: mobileSource.style.width,
    height: mobileSource.style.height,
    left: mobileSource.style.left,
    top: mobileSource.style.top
  }
  mainSource.mobileStyle.x = mobileSource.x
  mainSource.mobileStyle.y = mobileSource.y
  mainSource.mobileStyle.sizex = mobileSource.sizex
  mainSource.mobileStyle.sizey = mobileSource.sizey
}

export function panelInit(componentData, componentStyle) {
  // style初始化
  componentStyle.refreshTime = (componentStyle.refreshTime || 5)
  componentStyle.refreshViewLoading = (componentStyle.refreshViewLoading || false)
  componentStyle.refreshUnit = (componentStyle.refreshUnit || 'minute')
  componentStyle.aidedDesign = (componentStyle.aidedDesign || deepCopy(AIDED_DESIGN))
  componentData.forEach((item, index) => {
    if (item.component && item.component === 'de-date') {
      if (item.options.attrs &&
        (!item.options.attrs.default || (item.serviceName === 'timeYearWidget' && item.options.attrs.default.dynamicInfill !== 'year') || (item.serviceName === 'timeMonthWidget' && item.options.attrs.default.dynamicInfill !== 'month'))) {
        const widget = ApplicationContext.getService(item.serviceName)
        if (widget && widget.defaultSetting) {
          item.options.attrs.default = widget.defaultSetting()
        }
      }
    }
    if (item.type === 'custom') {
      item.options.manualModify = false
    }
    if (item.filters && item.filters.length > 0) {
      item.filters = []
    }
    item.linkageFilters = (item.linkageFilters || [])
    item.auxiliaryMatrix = (item.auxiliaryMatrix || false)
    item.x = (item.x || 1)
    item.y = (item.y || 1)
    item.sizex = (item.sizex || 5)
    item.sizey = (item.sizey || 5)
    // 初始化密度为最高密度
    if (componentStyle.aidedDesign.matrixBase !== 4) {
      item.x = (item.x - 1) * componentStyle.aidedDesign.matrixBase + 1
      item.y = (item.y - 1) * componentStyle.aidedDesign.matrixBase + 1
      item.sizex = item.sizex * componentStyle.aidedDesign.matrixBase
      item.sizey = item.sizey * componentStyle.aidedDesign.matrixBase
    }
    item.mobileSelected = (item.mobileSelected || false)
    item.mobileStyle = (item.mobileStyle || deepCopy(BASE_MOBILE_STYLE))
    item.hyperlinks = (item.hyperlinks || deepCopy(HYPERLINKS))
    item.commonBackground = item.commonBackground || deepCopy(COMMON_BACKGROUND_NONE)
  })
  // 初始化密度为最高密度
  componentStyle.aidedDesign.matrixBase = 4
  // 将data 和 style 数据设置到全局store中
  store.commit('setComponentData', resetID(componentData))
  store.commit('setCanvasStyle', componentStyle)
}

export function resetID(data) {
  if (data) {
    data.forEach(item => {
      item.type !== 'custom' && (item.id = uuid.v1())
    })
  }
  return data
}

export function matrixBaseChange(component) {
  const matrixBase = store.state.canvasStyleData.aidedDesign.matrixBase
  if (component) {
    component.x = (component.x - 1) * matrixBase
    component.y = (component.y - 1) * matrixBase
    component.sizex = component.sizex * matrixBase
    component.sizey = component.sizey * matrixBase
  }
  return component
}

