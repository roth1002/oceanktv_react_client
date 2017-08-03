export function setTimeoutPromise(fn, duration = 0) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(fn()), duration)
  })
}

export function stopPropagation(e) {
  if (typeof e === 'undefined') {
    throw new Error('No event to be detected.')
  }
  e.stopPropagation()
  if (e.preventDefault) { e.preventDefault() }
  if (e.nativeEvent) { e.nativeEvent.stopImmediatePropagation() }
}

export const removeFromArray = (array, index, mount = 1) => {
  return [
    ...array.slice(0, index),
    ...array.slice(index + mount)
  ]
}

export function truncate(fullStr, strLen, separator = '...') {
  if (fullStr.length <= strLen) return fullStr
  const sepLen = separator.length
  const charsToShow = strLen - sepLen
  const frontChars = Math.ceil(charsToShow / 2)
  const backChars = Math.floor(charsToShow / 2)

  return `${fullStr.substr(0, frontChars)}${separator}${fullStr.substr(fullStr.length - backChars)}`
}

export function truncatePath(path, maxPathname) {
  let pathArr = path.split('/')
  if (pathArr.length <= maxPathname) return pathArr.join(' / ')
  return removeFromArray(pathArr, 1, pathArr.length - maxPathname).join(' / ... /')
}

function falseEvent(e) {
  if (e.preventDefault) { e.preventDefault() }
  return false
}

export function disableSelect(el) {
  if (el.addEventListener) {
    el.addEventListener('mousedown', falseEvent, false)
  } else {
    el.attachEvent('onselectstart', falseEvent)
  }
}

export function enableSelection(el) {
  if (el.addEventListener) {
    el.removeEventListener('mousedown', falseEvent, false)
  } else {
    el.detachEvent('onselectstart', falseEvent)
  }
}

export function getNextActionPage(myPage, count, diff) {
  return diff === 0 ? 1 : myPage + diff;
}

export function getYoutubeLangName(i18nLangName) {
  if ( i18nLangName === 'zh-tw' ) {
    return 'cht';
  } else if ( i18nLangName === 'zh-cn' ) {
    return 'chs';
  } else if ( i18nLangName === 'en' || i18nLangName === 'en-us' ) {
    return 'eng';
  }
}
