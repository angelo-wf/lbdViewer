
//parses a TMD file (PS1 model)
function TMD(b) {
  this.type = "TMD";
  
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

//turns a unsinged 16-bit int to singed
function uToS(num) {
  if(num < 32768) {
    return num
  }
  return -(65536 - num);
}

//turns a unsigned 32-bit int to signed
function uToSl(num) {
  if(num < 2147483648) {
    return num
  }
  return -(4294967296 - num);
}

//turns a texture-page + uv combo to direct uv coords in the vram
function pToC(arr, page) {
  let newX = (page & 0xf) * 128 + (arr[0]);
  let newY = ((page & 0x10) >> 4) * 256 + arr[1];
  return [newX, newY];
}

//fixes cols for handling of PS1's 0x7f7f7f neutral color instead of 0xffffff
function fixCols(col, yes) {
  if(!yes) {
    //if not a textured primitive, don't change colors
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

//scales a colors lower 7 bits to 8 bits
function scaleCol(val) {
  val = val > 0x7f ? 0x7f : val;
  val = val & 0x7f;
  return val * 2 + (val >> 6);
}
