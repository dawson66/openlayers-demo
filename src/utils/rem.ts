// 基准大小
export const baseSize = 1248;
let cacheRatio = 0;

export function getScaleRatio(useCache = true) {
  if (useCache) return cacheRatio;

  const clientWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  // 当前页面宽度相对于 12480 宽的缩放比例，可根据自己需要修改。
  cacheRatio = clientWidth / 12480;

  return cacheRatio;
}

// 设置 rem 函数
function setRem() {
  const scale = getScaleRatio(false);
  // 设置页面根节点字体大小（“Math.min(scale, 2)” 指最高放大比例为2，可根据实际业务需求调整）
  document.documentElement.style.fontSize =
    baseSize * Math.min(scale, 2) + 'px'
}
setRem();

// function init(screenRatioByDesign = 1248 / 351) {
//   let docEle = document.documentElement;
//   function setHtmlFontSize() {
//     var screenRatio = docEle.clientWidth / docEle.clientHeight;
//     var fontSize =
//       ((screenRatio > screenRatioByDesign
//         ? screenRatioByDesign / screenRatio
//         : 1) *
//         docEle.clientWidth) /
//       10;
//     docEle.style.fontSize = fontSize.toFixed(3) + "px";
//     console.log(docEle.style.fontSize);
//   }
//   setHtmlFontSize();
//   window.addEventListener("resize", setHtmlFontSize);
// }
// init();

// 改变窗口大小时重新设置 rem
window.onresize = function () {
  setRem();
  // init()
};
