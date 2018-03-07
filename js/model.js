function MOM(b) {
  this.begin = b.offset;
  this.id = b.readLong();
  this.length = b.readLong();
  this.tmdOff = b.readLong();

  this.tmds = [];
  b.offset = this.tmdOff + this.begin;
  this.tmds.push(new TMD(b));
  b.offset = this.begin + 12;
  this.mosId = b.readLong();
  this.todNum = b.readLong();
  this.todOffs = [];
  for(let i = 0; i < this.todNum; i++) {
    this.todOffs[i] = b.readLong();
  }
  this.tods = [];
  for(let i = 0; i < this.todNum; i++) {
    b.offset = this.todOffs[i] + this.begin + 12;
    this.tods[i] = new TOD(b);
  }
  this.comb = [];
  this.comb[0] = {count: this.todNum, type: "anim", mom: this};
}

function LBD(b) {
  this.id = b.readShort();
  this.mml = b.readShort() == 1;
  this.adrOff = b.readLong();
  this.tmdOff = b.readLong();
  this.tmdLen = b.readLong();
  this.mmlOff = b.readLong();
  this.mmlLen = b.readLong();
  this.val = b.readShort();
  this.extraNum = b.readShort();
  this.w = b.readShort();
  this.h = b.readShort();
  this.extraOff = 32 + (12 * this.w * this.h);

  this.tiles = [];
  for(let i = 0; i < (this.w * this.h); i++) {
    this.tiles[i] = new LBDTile(b, this.extraOff, this.adrOff);
  }
  this.extraTiles = [];
  for(let i = 0; i < this.extraNum; i++) {
    this.extraTiles[i] = new LBDTile(b, this.extraOff, this.adrOff);
  }

  this.tmds = [];
  b.offset = this.tmdOff + this.adrOff;
  this.tmds.push(new TMD(b));

  this.moms = [];

  if(this.mml) {
    b.offset = this.mmlOff;
    this.mmlId = b.readLong();
    this.momCnt = b.readLong();
    this.momOffs = [];
    for(let i = 0; i < this.momCnt; i++) {
      this.momOffs[i] = b.readLong();
    }
    for(let i = 0; i < this.momOffs.length; i++) {
      b.offset = this.momOffs[i] + this.mmlOff;
      this.moms.push(new MOM(b));
    }
    for(let i = 0; i < this.moms.length; i++) {
      this.tmds.push(this.moms[i].tmds[0]);
    }
  }

  this.comb = [];
  this.comb[0] = {count: 1, type: "tiles"};
  for(let i = 0; i < this.moms.length; i++) {
    this.comb[i + 1] = {count: this.moms[i].todNum, type: "anim", mom: this.moms[i]};
  }
}

function LBDTile(b, ex, adr) {
  this.render = b.readByte() == 1;
  this.flag = b.readByte();
  this.type = b.readShort();
  this.collisiion = b.readByte();
  this.rotation = b.readByte();
  this.height = uToS(b.readShort());
  this.extra = b.readLong();
  this.extraInd = -1
  if(this.extra != 0) {
    this.extraInd = ((this.extra + adr) - ex) / 12;
  }
}

function fixRot(rot) {
  let fixed = [2, 3, 0, 1];
  return fixed[rot];
}
