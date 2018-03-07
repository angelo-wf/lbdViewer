function TOD(b) {
  this.id = b.readByte();
  this.version = b.readByte();
  this.resolution = b.readShort();
  this.numFrames = b.readLong();

  this.frames = [];
  for(let i = 0; i < this.numFrames; i++) {
    let size = b.readShort();
    let packetNum = b.readShort();
    let frameNumber = b.readLong();
    let packet = [];
    for(let j = 0; j < packetNum; j++) {
      packet[j] = new TODPacket(b);
    }
    this.frames[i] = {
      size: size,
      packetNum: packetNum,
      frameNumber: frameNumber,
      packet: packet
    };
  }
}

function TODPacket(b) {
  this.objectId = b.readShort();
  this.flagType = b.readByte();
  this.length = b.readByte();
  this.type = this.flagType & 0xf;
  this.flag = this.flagType >> 4;
  switch(this.type) {
    case 0:
      this.mask = b.readLong();
      this.data = b.readLong();
      break;
    case 1:
      this.diff = (this.flag & 1) == 1;
      this.hasRot = (this.flag & 2) > 0;
      this.hasScl = (this.flag & 4) > 0;
      this.hasTra = (this.flag & 8) > 0;
      if(this.hasRot) {
        this.rotX = uToSl(b.readLong());
        this.rotY = uToSl(b.readLong());
        this.rotZ = uToSl(b.readLong());
      }
      if(this.hasScl) {
        this.sclX = uToS(b.readShort());
        this.sclY = uToS(b.readShort());
        this.sclZ = uToS(b.readShort());
        b.readShort();
      }
      if(this.hasTra) {
        this.traX = uToSl(b.readLong());
        this.traY = uToSl(b.readLong());
        this.traZ = uToSl(b.readLong());
      }
      break;
    case 2:
      this.tmdId = b.readShort();
      b.readShort();
      break;
    case 3:
      this.parId = b.readShort();
      b.readShort();
      break;
    case 4:
      this.rots = [];
      for(let i = 0; i < 9; i++) {
        this.rots[i] = b.readShort();
      }
      b.readShort();
      this.traX = b.readLong();
      this.traY = b.readLong();
      this.traZ = b.readLong();
      break;
    case 5:
      b.offset += (this.length * 4) - 4;
      break;
    case 6:
      this.diff = (this.flag & 1) == 1;
      this.hasDir = (this.flag & 2) > 0;
      this.hasCol = (this.flag & 4) > 0;
      if(this.hasDir) {
        this.dirX = b.readLong();
        this.dirY = b.readLong();
        this.dirZ = b.readLong();
      }
      if(this.hasCol) {
        this.colR = b.readByte();
        this.colG = b.readByte();
        this.colB = b.readByte();
        b.readByte();
      }
    case 7:
      this.type = (this.flag) & 1;
      this.diff = (this.flag) & 2 > 0;
      this.hasPosRot = (this.flag) & 4 > 0;
      this.hasAngTra = (this.flag) & 8 > 0;
      if(this.type == 0) {
        if(this.hasPosRot) {
          this.traX = b.readLong();
          this.traY = b.readLong();
          this.traZ = b.readLong();
          this.traXr = b.readLong();
          this.traYr = b.readLong();
          this.traZr = b.readLong();
        }
        if(this.hasAngTra) {
          this.z = b.readLong();
        }
      } else {
        if(this.hasPosRot) {
          this.rotX = b.readLong();
          this.rotY = b.readLong();
          this.rotZ = b.readLong();
        }
        if(this.hasAngTra) {
          this.traX = b.readLong();
          this.traY = b.readLong();
          this.traZ = b.readLong();
        }
      }
      break;
    case 8:
      this.create = this.flag == 0;
      break;
    case 14:
      b.offset += (this.length * 4) - 4;
      break;
    case 15:
      b.offset += (this.length * 4) - 4;
      break;
    default:
      console.log("Warning: Unsupported TOD-type found\n0x" + this.type.toString(16));
      b.offset += (this.length * 4) - 4;
      break;
  }
}
