
function TMD(b) {
  //read header
  this.id = b.readLong();
  this.flags = b.readLong();
  this.num = b.readLong();
  this.offFix = (this.flags & 0x1) == 0;

  this.start = this.offFix ? b.offset : 0;

  this.objects = [];

  for(let i = 0; i < this.num; i++) {
    this.objects[i] = new TMDObject(b, this.start);
  }
}

function TMDObject(b, top) {
  this.vertAdr = b.readLong();
  this.vertNum = b.readLong();
  this.normAdr = b.readLong();
  this.normNum = b.readLong();
  this.primAdr = b.readLong();
  this.primNum = b.readLong();
  this.scale = b.readLong();

  this.prims = [];
  this.verts = [];
  this.norms = [];

  this.cached = b.offset;

  b.offset = this.vertAdr + top;
  for(let i = 0; i < this.vertNum; i++) {
    let a = uToS(b.readShort());
    let b2 = uToS(b.readShort());
    let c = uToS(b.readShort());
    b.readShort();
    this.verts[i] = [a, b2, c];
  }
  b.offset = this.primAdr + top;
  for(let i = 0; i < this.primNum; i++) {
    this.prims[i] = new TMDPrim(b);
  }
  b.offset = this.normAdr + top;
  for(let i = 0; i < this.normNum; i++) {
    let a = uToS(b.readShort());
    let b2 = uToS(b.readShort());
    let c = uToS(b.readShort());
    b.readShort();
    this.norms[i] = [a, b2, c];
  }

  b.offset = this.cached;
}

function uToS(num) {
  if(num < 32768) {
    return num
  }
  return -(65536 - num);
}

function uToSl(num) {
  if(num < 2147483648) {
    return num
  }
  return -(4294967296 - num);
}

function pToC(arr, page) {
  let newX = (page & 0xf) * 128 + (arr[0]);
  let newY = ((page & 0x10) >> 4) * 256 + arr[1];
  return [newX, newY];
}

function fixCols(col, yes) {
  if(!yes) {
    return col;
  }
  let r = (col & 0xff0000) >> 16;
  let g = (col & 0xff00) >> 8;
  let b = col & 0xff;
  r = scaleCol(r);
  g = scaleCol(g);
  b = scaleCol(b);
  col = (r << 16) | (g << 8) | (b);
  return col;
}

function scaleCol(val) {
  val = val > 0x7f ? 0x7f : val;
  val = val & 0x7f;
  return val * 2 + (val >> 6);
}
