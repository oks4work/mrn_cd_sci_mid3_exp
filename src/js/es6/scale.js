/* ─────────────────────┐
	data: 2018.08.14
	name: scale.js
└───────────────────── */
(function () {
  function Scale(args) {
    this.element = args.target;
    this.height = args.height ? args.height : args.target.clientHeight;
    this.mode = args.mode ? args.mode : 'normal';
    this.align = args.align ? args.align : 'center';
    this.set(this.element);
    window.addEventListener('resize', this.reSet.bind(this, this.element));
  }

  Scale.prototype.getContainer = function () {
    this.documentWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    this.documentHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  };

  Scale.prototype.getZoomRate = function () {
    this.horizontalZoomRate = this.documentWidth / this.element.clientWidth;
    this.verticalZoomRate = this.documentHeight / this.height;
    var zoomRate = this.element.clientWidth * this.verticalZoomRate > this.documentWidth ? this.horizontalZoomRate : this.verticalZoomRate;
    return zoomRate;
  };

  Scale.prototype.set = function (target) {
    this.getContainer();
    this.element = target;
    this.zoomRate = this.getZoomRate();
    this.left = (this.documentWidth - this.element.clientWidth * this.zoomRate) / 2;
    this.setScale();
  };

  Scale.prototype.setScale = function (zoomRate, left) {
    if (this.mode === 'fullSize') {
      this.element.style.transform = 'scale(' + this.horizontalZoomRate + ', ' + this.verticalZoomRate + ')';
      this.element.style.MsTransform = 'scale(' + this.horizontalZoomRate + ', ' + this.verticalZoomRate + ')';
      this.element.style.MozTransform = 'scale(' + this.horizontalZoomRate + ', ' + this.verticalZoomRate + ')';
      this.element.style.WebkitTransform = 'scale(' + this.horizontalZoomRate + ', ' + this.verticalZoomRate + ')';
    } else {
      this.element.style.transform = 'scale(' + this.zoomRate + ')';
      this.element.style.MsTransform = 'scale(' + this.zoomRate + ')';
      this.element.style.MozTransform = 'scale(' + this.zoomRate + ')';
      this.element.style.WebkitTransform = 'scale(' + this.zoomRate + ')';
    }

    this.element.style.transformOrigin = '0% 0%';
    this.element.style.MsTransformOrigin = '0% 0%';
    this.element.style.MozTransformOrigin = '0% 0%';
    this.element.style.WebkitTransformOrigin = '0% 0%';
    if (this.align === 'center') this.element.style.left = this.left + 'px';
    if (this.mode === 'web') this.element.style.height = this.documentHeight / this.zoomRate + 'px';
  };

  Scale.prototype.reSet = function (target) {
    this.getContainer();
    this.set(target);
  };

  window.$cale = Scale;
})();