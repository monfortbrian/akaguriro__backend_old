let getTimestamp = () => {
 return new Date().toISOString()
}
export const info = (namespace, message, object) => {
 if (object) {
  console.log(
   `[${getTimestamp()}]  [info] [${namespace}]  ${message}`.blue,
   object
  )
 } else {
  console.log(`[${getTimestamp()}]  [info] [${namespace}]  ${message}`.blue)
 }
}
export const serverInfo = (namespace, message, object) => {
 if (object) {
  console.log(
   `[${getTimestamp()}]  [info] [${namespace}]  ${message}`.blue,
   object
  )
 } else {
  console.log(`[${getTimestamp()}]  [info] [${namespace}]  ${message}`.rainbow)
 }
}
export const warn = (namespace, message, object) => {
 if (object) {
  console.warn(`[${getTimestamp()}]  [warn] [${namespace}]  ${message}`.yellow)
 } else {
  console.warn(`[${getTimestamp()}]  [warn] [${namespace}]  ${message}`.yellow)
 }
}
export const error = (namespace, message, object) => {
 if (object) {
  console.error(
   `[${getTimestamp()}]  [warn] [${namespace}]  ${message}`.red.inverse
  )
 } else {
  console.error(
   `[${getTimestamp()}]  [warn] [${namespace}]  ${message}`.red.inverse,
   object
  )
 }
}

export const debug = (namespace, message, object) => {
 if (object) {
  console.debug(
   `[${getTimestamp()}]  [debug] [${namespace}]  ${message}`.cyan,
   object
  )
 } else {
  console.debug(
   `[${getTimestamp()}]  [debug] [${namespace}]  ${message}`.cyan,
   object
  )
 }
}
