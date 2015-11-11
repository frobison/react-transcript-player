"use strict"

export const progress = (time, start, end) => {
  if (time < start) return ''
  if (time > end + 500) return 'played'
  return 'playing'
}

// taken from underscore.js
export const debounce = (func, wait, immediate) => {
  var timeout, args, context, timestamp, result

  var later = function() {
    var last = Date.now() - timestamp

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function() {
    context = this
    args = arguments
    timestamp = Date.now()
    var callNow = immediate && !timeout
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }
    return result
  }
}
