import { saveAs } from "file-saver";

class ImageSaver {
  constructor(imgString, width, height) {
    this.imgString = imgString;
    this.width = width;
    this.height = height;
  }

  save(filename) {
    this.filename = filename;

    this._createCanvas();

    this.imgObj = new Image();
    this.imgObj.onload = this._onLoadImg;
    this.imgObj.src = this._imgSrc;
  }

  _createCanvas() {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");

    this.canvas.height = this.height;
    this.canvas.width = this.width;
  }

  _onLoadImg = () => {
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.drawImage(this.imgObj, 0, 0, this.width, this.height);

    this.canvas.toBlob(this._saveImgBlob);
  };

  _saveImgBlob = blob => {
    saveAs(blob, this.filename);
  };

  get _base64ImgString() {
    return btoa(unescape(encodeURIComponent(this.imgString)));
  }

  get _imgSrc() {
    return `data:image/svg+xml;base64,${this._base64ImgString}`;
  }
}

export { ImageSaver };
