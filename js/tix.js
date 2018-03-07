function TIX(b) {

  this.chunkNum = b.readLong();
  this.chunkOffs = [];
  for(let i = 0; i < this.chunkNum; i++) {
    this.chunkOffs[i] = b.readLong();
  }
  this.chunkLens = [];
  for(let i = 0; i < this.chunkNum; i++) {
    this.chunkLens[i] = b.readLong();
  }

  this.timOffs = [];
  this.tims = [];

  //go over each chunk
  for(let i = 0; i < this.chunkNum; i++) {
    b.offset = this.chunkOffs[i];
    let count = b.readLong();
    for(let j = 0; j < count; j++) {
      this.timOffs.push(this.chunkOffs[i] + b.readLong());
    }
  }

  //create tims
  for(let i = 0; i < this.timOffs.length; i++) {
    b.offset = this.timOffs[i];
    this.tims.push(new TIM(b));
  }

}

function TIM(b) {
  this.id = b.readLong();
  this.flag = b.readLong();

  this.setting = (this.flag & 0x0f);

  this.clutLen = 0;
  this.clutX = 0;
  this.clutY = 0;
  this.clutW = 0;
  this.clutH = 0;
  this.cols = [];
  this.imgLen = 0;
  this.imgX = 0;
  this.imgY = 0;
  this.imgW = 0;
  this.imgH = 0;

  this.pixels = [];

  if(this.setting == 9) {
    this.clutLen = b.readLong();
    this.clutX = b.readShort();
    this.clutY = b.readShort();
    this.clutW = b.readShort();
    this.clutH = b.readShort();
    for(let i = 0; i < 256; i++) {
      this.cols.push(colToFull(b.readShort()));
    }
    this.imgLen = b.readLong();
    this.imgX = b.readShort();
    this.imgY = b.readShort();
    this.imgW = b.readShort();
    this.imgH = b.readShort();

    let size = this.imgH * this.imgW * 2;

    for(let i = 0; i < size; i++) {
      this.pixels.push(b.readByte());
    }

  } else {
    console.log("Warning: Unsupported TIM-type found\n0x" + this.setting.toString(16));
  }
}

function colToFull(num) {
  let a = (num & 0x8000) >> 15;
  let b = Math.round(((num & 0x7c00) >> 10) * 255 / 31);
  let g = Math.round(((num & 0x03e0) >> 5) * 255 / 31);
  let r = Math.round((num & 0x001f) * 255 / 31);
  if(a) {
    if(r + g + b == 0) {
      return [0, 0, 0, 1];
    }
    return [r, g, b, globalOpacity];
  }
  if(r + g + b == 0) {
    return [0, 0, 0, 0];
  }
  return [r, g, b, 1];
}

function colToString(colArr) {
  let str = "rgba(";
  str += colArr[0] + ", " + colArr[1] + ", " + colArr[2] + ", " + colArr[3];
  str += ")";
  return str;
}
