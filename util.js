
function el(id) {
  return document.getElementById(id);
}

function newEl(name) {
  return document.createElement(name);
}

function txt(str) {
  return document.createTextNode(str);
}

function clearEl(el) {
  while(el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

function inArray(arr, val) {
  for(let i = 0; i < arr.length; i++) {
    if(arr[i] === val) {
      return true;
    }
  }
  return false;
}

function location(arr, val) {
  for(let i = 0; i < arr.length; i++) {
    if(arr[i] === val) {
      return i;
    }
  }
  return -1;
}

function repeatTimes(times, func) {
  for(let i = 0; i < times; i++) {
    func();
  }
}

function Buffer(data, retFf) {
  this.data = data;
  this.offset = 0;
  this.ff = false;
  if(retFf) {
    this.ff = true;
  }

  this.readByte = function(off) {
    if(off === undefined) {
      let ret = this.data[this.offset];
      this.offset++;
      return ret === undefined && this.ff ? 0xff : ret;
    }
    let ret = this.data[off];
    return ret === undefined && this.ff ? 0xff : ret;
  }

  this.readShort = function(off) {
    if(off === undefined) {
      let ret = this.readByte();
      ret = this.readByte() * 256 + ret;
      return isNaN(ret) ? undefined : ret;
    }
    let ret = this.readByte(off);
    ret = this.readByte(off + 1) * 256 + ret;
    return isNaN(ret) ? undefined : ret;
  }

  this.readBigShort = function(off) {
    if(off === undefined) {
      let ret = this.readByte();
      ret = ret * 256 + this.readByte();
      return isNaN(ret) ? undefined : ret;
    }
    let ret = this.readByte(off);
    ret = ret * 256 + this.readByte(off + 1);
    return isNaN(ret) ? undefined : ret;
  }

  this.readLong = function(off) {
    if(off === undefined) {
      let ret = this.readByte();
      ret = this.readByte() * 256 + ret;
      ret = this.readByte() * 65536 + ret;
      ret = this.readByte() * 16777216 + ret;
      return isNaN(ret) ? undefined : ret;
    }
    let ret = this.readByte(off);
    ret = this.readByte(off + 1) * 256 + ret;
    ret = this.readByte(off + 2) * 65536 + ret;
    ret = this.readByte(off + 3) * 16777216 + ret;
    return isNaN(ret) ? undefined : ret;
  }

  this.readBigLong = function(off) {
    if(off === undefined) {
      let ret = this.readByte();
      ret = ret * 256 + this.readByte();
      ret = ret * 256 + this.readByte();
      ret = ret * 256 + this.readByte();
      return isNaN(ret) ? undefined : ret;
    }
    let ret = this.readByte(off);
    ret = ret * 256 + this.readByte(off + 1);
    ret = ret * 256 + this.readByte(off + 2);
    ret = ret * 256 + this.readByte(off + 3);
    return isNaN(ret) ? undefined : ret;
  }

  this.readString = function(len, off) {
    let str = "";
    for(let i = 0; i < len; i++) {
      if(off === undefined) {
        let val = this.readByte();
        if(val === undefined) return undefined;
        str += String.fromCharCode(val);
      } else {
        let val = this.readByte(off + i);
        if(val === undefined) return undefined;
        str += String.fromCharCode(val);
      }
    }
    return str;
  }

  this.readZeroString = function(off) {
    let str = "";
    let curOff = off;
    while(true) {
      if(off === undefined) {
        let val = this.readByte();
        if(val === undefined || val === 0 || this.offset >= this.data.length) {
          return str;
        }
        str += String.fromCharCode(val);
      } else {
        let val = this.readByte(curOff++);
        if(val === undefined || val === 0 || curOff >= this.data.length) {
          return str;
        }
        str += String.fromCharCode(val);
      }
    }
  }
}
