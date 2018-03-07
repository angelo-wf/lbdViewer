function TMDPrim(b) {
  this.olen = b.readByte();
  this.ilen = b.readByte();
  this.flag = b.readByte();
  this.mode = b.readByte();

  this.vertIndexes = [];
  this.normIndexes = [];
  this.colors = [];
  this.cba = 0;
  this.tsb = 0;
  this.quad = false;
  this.textured = false;
  this.texUV = [];

  this.transparent = ((this.mode & 2) >> 1) == 1;
  this.fixedMode = this.mode & ~2;
  this.fixedFlag = this.flag & ~2;
  this.selector = (this.fixedMode << 8) | this.fixedFlag;
  let temp, temp2;
  switch(this.selector) {
    case 0x2d01:
      temp = b.readByte();
      this.texUV.push([temp, b.readByte()]);
      this.cba = b.readShort();

      temp = b.readByte();
      this.texUV.push([temp, b.readByte()]);
      this.tsb = b.readShort();

      temp = b.readByte();
      this.texUV.push([temp, b.readByte()]);
      b.readShort();

      temp = b.readByte();
      this.texUV.push([temp, b.readByte()]);
      b.readShort();

      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      this.vertIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.vertIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.quad = true;
      this.textured = true;
      break;
    case 0x2901:
      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      this.vertIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.vertIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.quad = true;
      break;
    case 0x3901:
      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      this.vertIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.vertIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.quad = true;
      break;
    case 0x3d01:
      temp = b.readByte();
      this.texUV.push([temp, b.readByte()]);
      this.cba = b.readShort();

      temp = b.readByte();
      this.texUV.push([temp, b.readByte()]);
      this.tsb = b.readShort();

      temp = b.readByte();
      this.texUV.push([temp, b.readByte()]);
      b.readShort();

      temp = b.readByte();
      this.texUV.push([temp, b.readByte()]);
      b.readShort();

      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      this.vertIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.vertIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.quad = true;
      this.textured = true;
      break;
    case 0x2501:
      temp = b.readByte();
      this.texUV.push([temp, b.readByte()]);
      this.cba = b.readShort();

      temp = b.readByte();
      this.texUV.push([temp, b.readByte()]);
      this.tsb = b.readShort();

      temp = b.readByte();
      this.texUV.push([temp, b.readByte()]);
      b.readShort();

      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      this.vertIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.vertIndexes.push(b.readShort());
      b.readShort();

      this.textured = true;
      break;
    case 0x2101:
      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      this.vertIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.vertIndexes.push(b.readShort());
      b.readShort();
      break;
    case 0x3101:
      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      this.vertIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.vertIndexes.push(b.readShort());
      b.readShort();
      break;
    case 0x3501:
      temp = b.readByte();
      this.texUV.push([temp, b.readByte()]);
      this.cba = b.readShort();

      temp = b.readByte();
      this.texUV.push([temp, b.readByte()]);
      this.tsb = b.readShort();

      temp = b.readByte();
      this.texUV.push([temp, b.readByte()]);
      b.readShort();

      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      this.vertIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.vertIndexes.push(b.readShort());
      b.readShort();

      this.textured = true;
      break;
    case 0x2c00:
      temp = b.readByte();
      this.texUV.push([temp, b.readByte()]);
      this.cba = b.readShort();

      temp = b.readByte();
      this.texUV.push([temp, b.readByte()]);
      this.tsb = b.readShort();

      temp = b.readByte();
      this.texUV.push([temp, b.readByte()]);
      b.readShort();

      temp = b.readByte();
      this.texUV.push([temp, b.readByte()]);
      b.readShort();

      this.normIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.vertIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.vertIndexes.push(b.readShort());
      b.readShort();

      this.quad = true;
      this.textured = true;
      break;
    case 0x3c00:
      temp = b.readByte();
      this.texUV.push([temp, b.readByte()]);
      this.cba = b.readShort();

      temp = b.readByte();
      this.texUV.push([temp, b.readByte()]);
      this.tsb = b.readShort();

      temp = b.readByte();
      this.texUV.push([temp, b.readByte()]);
      b.readShort();

      temp = b.readByte();
      this.texUV.push([temp, b.readByte()]);
      b.readShort();

      this.normIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.normIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.normIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.normIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.quad = true;
      this.textured = true;
      break;
    case 0x2804:
      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      this.normIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.vertIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.vertIndexes.push(b.readShort());
      b.readShort();

      this.quad = true;
      break;
    case 0x3804:
      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      this.normIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.normIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.normIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.normIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.quad = true;
      break;
    case 0x2800:
      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      this.normIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.vertIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.vertIndexes.push(b.readShort());
      b.readShort();

      this.quad = true;
      break;
    case 0x3800:
      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      this.normIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.normIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.normIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.normIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.quad = true;
      break;
    case 0x2400:
      temp = b.readByte();
      this.texUV.push([temp, b.readByte()]);
      this.cba = b.readShort();

      temp = b.readByte();
      this.texUV.push([temp, b.readByte()]);
      this.tsb = b.readShort();

      temp = b.readByte();
      this.texUV.push([temp, b.readByte()]);
      b.readShort();

      this.normIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.vertIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.textured = true;
      break;
    case 0x3400:
      temp = b.readByte();
      this.texUV.push([temp, b.readByte()]);
      this.cba = b.readShort();

      temp = b.readByte();
      this.texUV.push([temp, b.readByte()]);
      this.tsb = b.readShort();

      temp = b.readByte();
      this.texUV.push([temp, b.readByte()]);
      b.readShort();

      this.normIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.normIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.normIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.textured = true;
      break;
    case 0x2004:
      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      this.normIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.vertIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());
      break;
    case 0x3004:
      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      this.normIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.normIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.normIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());
      break;
    case 0x2000:
      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      this.normIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.vertIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());
      break;
    case 0x3000:
      temp = b.readByte() << 16;
      temp2 = b.readByte() << 8;
      this.colors.push(temp | temp2 | b.readByte());
      b.readByte();

      this.normIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.normIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());

      this.normIndexes.push(b.readShort());
      this.vertIndexes.push(b.readShort());
      break;
    default:
      console.log("Warning: Unsupported TMD-mode found!\n0x" + this.selector.toString(16));
      b.offset += this.ilen * 4;
      break;
  }
  this.page = this.tsb & 0x1f;
  this.texXY = [];
  for(let i = 0; i < this.texUV.length; i++) {
    this.texXY[i] = pToC(this.texUV[i], this.page);
  }
  this.realCol = [];
  for(let i = 0; i < this.colors.length; i++) {
    this.realCol[i] = fixCols(this.colors[i], this.textured);
  }
}
