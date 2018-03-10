
let scene, camera, renderer, texture;
let file;
let viewState = {
  comb: false,
  file: 0,
  obj: 0,
  wire: false
};
let ctx = el("vram").getContext("2d"), pixelData;
let globalScale = 1 / 2048, globalOpacity = 0.6;
let animState = {
  parts: [],
  frame: -1
};
//add white to canvas, for solid colors
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, 2048, 512);
pixelData = ctx.getImageData(0, 0, 2048, 512);

el("file").onchange = function() {
  let reader = new FileReader();
  reader.onload = function() {
    let buffer = this.result;
    let arr = new Uint8Array(buffer);
    let fileBuf = new Buffer(arr);
    let extArr = el("file").value.split(".");
    let ext = extArr[extArr.length - 1].toUpperCase();
    if(ext == "TMD") {
      loadModel(fileBuf, 0);
    } else if(ext == "MOM") {
      loadModel(fileBuf, 1);
    } else if(ext == "LBD") {
      loadModel(fileBuf, 2);
    } else {
      alert("Unsupported file");
    }
  }
  reader.readAsArrayBuffer(this.files[0]);
}

el("tix").onchange = function() {
  let reader = new FileReader();
  reader.onload = function() {
    let buffer = this.result;
    let arr = new Uint8Array(buffer);
    let fileBuf = new Buffer(arr);
    let extArr = el("tix").value.split(".");
    let ext = extArr[extArr.length - 1].toUpperCase();
    if(ext == "TIX") {
      loadTix(fileBuf);
    } else {
      alert("Unsupported file");
    }
  }
  reader.readAsArrayBuffer(this.files[0]);
}

//model handling

//load a LBD, MOM or TMD
function loadModel(b, type) {
  warn = false;
  /*if(type == 0) {
    let tmd = new TMD(b);
    file = {tmds: [tmd]};
  } else if(type == 1) {
    file = new MOM(b);
  } else if(type == 2) {
    file = new LBD(b);
  }*/
  if(type == 0) {
    file = handleModel(new TMD(b));
  } else if(type == 1) {
    file = handleModel(new MOM(b));
  } else if(type == 2) {
    file = handleModel(new LBD(b));
  }
  viewState.obj = 0;
  viewState.file = 0;
  viewState.comb = false;
  resetAnimState();
  if(scene == undefined) {
    init();
    return;
  }
  rerender();
}

//gets the maximum ind and num for the loaded file and state
function getMaxes() {
  if(viewState.comb) {
    let fir = viewState.file >= file.comb.length ? 0 : file.comb[viewState.file].count;
    let sec = file.comb.length;
    return [sec, fir];
  } else {
    let fir = viewState.file >= file.tmds.length ? 0 : file.tmds[viewState.file].objects.length;
    let sec = file.tmds.length;
    return [sec, fir];
  }
}

//scene handling

//init the scene
function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xeaeaea);
  scene.rotateZ(Math.PI);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  let controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render);
  controls.keyPanSpeed = 28;

  texture = new THREE.Texture(el("vram"));
  texture.needsUpdate = true;
  //set pixelated textures
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;

  camera.position.z = 5;
  camera.position.y = 1024 * globalScale;
  controls.update();
  rerender();
}

//render the scene, when moving the camera or animating
function render() {
  renderer.render(scene, camera);
  if(viewState.comb && file.comb[viewState.file].type == "anim") {
    let frames = file.comb[viewState.file].mom.tods[viewState.obj].frames.length;
    let cur = animState.frame + 1;
    el("frames").textContent = ", Frame: " + cur + " / " + frames;
  } else {
    el("frames").textContent = "";
  }
}

//re-renders the scene, recreates the mesh(es) and renders them
function rerender() {
  clearScene(scene);
  //light example in three.js examples -> Minecraft example
  resetAnimState();
  if(!viewState.comb) {
    doObj();
  } else {
    doSpc();
  }
  let objTot = getMaxes()[1];
  let fileTot = getMaxes()[0];
  el("info").textContent = "Combined: " + viewState.comb;
  el("info").textContent += ", File: " + (viewState.file + 1) + " / " + fileTot;
  el("info").textContent += ", Object: " + (viewState.obj + 1) + " / " + objTot;
  el("info").textContent += ", Wireframe: " + viewState.wire;
  render();
}

//clears a scene
function clearScene(scene) {
  while(scene.children.length > 0) {
    let obj = scene.children[0];
    scene.remove(obj);
    if(obj.geometry) obj.geometry.dispose();
    if(obj.material) {
      if(obj.material.length) {
        obj.material.forEach(function(val) {val.dispose()});
      } else {
        obj.material.dispose();
      }
    }
    if(obj.children.length > 0) {
      clearScene(obj);
    }
    obj = undefined;
  }
}

//TIX loading

//load a tix file into the vram
function loadTix(b) {
  //clear
  ctx.clearRect(0, 0, 2048, 512);
  //add white on vram part
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 640, 512);
  //get pixeldata and draw tims on it
  pixelData = ctx.getImageData(0, 0, 2048, 512);
  let data = new TIX(b);
  for(let i = 0; i < data.tims.length; i++) {
    let tim = data.tims[i];
    for(let y = 0; y < tim.imgH; y++) {
      for(let x = 0; x < tim.imgW * 2; x++) {
        let ind = y * tim.imgW * 2 + x;
        let palInd = tim.pixels[ind];
        drawPixel(x + tim.imgX * 2, y + tim.imgY, tim.cols[palInd]);
      }
    }
  }
  //draw pixeldata back on canvas
  ctx.putImageData(pixelData, 0, 0);
  if(texture != undefined) {
    texture.needsUpdate = true;
    rerender();
  }
}

//draws pixel on vram
function drawPixel(x, y, col) {
  let ind = (y * 2048 + x) * 4;
  pixelData.data[ind] = col[0];
  pixelData.data[ind + 1] = col[1];
  pixelData.data[ind + 2] = col[2];
  pixelData.data[ind + 3] = Math.floor(col[3] * 255);
}

//gets the alpha for a pixel in vram, used for detecting transparent textures
function getPixelAlpha(x, y) {
  let ind = (y * 2048 + x) * 4;
  return pixelData.data[ind + 3];
}

//check for transparensy in a texture, given the uv coords
function checkTrans(arr, extra) {
  let sel = extra ? [2, 3, 1] : [2, 1, 0];
  let fir = arr[sel[0]];
  let sec = arr[sel[1]];
  let thr = arr[sel[2]];
  let test = [fir, sec, thr];
  //get the lowest and highest x
  let lowestX = 16777216;
  let highestX = 0;
  for(let i = 0; i < 3; i++) {
    if(test[i][0] < lowestX) {
      lowestX = test[i][0];
    }
    if(test[i][0] > highestX) {
      highestX = test[i][0];
    }
  }
  //same for y
  let lowestY = 16777216;
  let highestY = 0;
  for(let i = 0; i < 3; i++) {
    if(test[i][1] < lowestY) {
      lowestY = test[i][1];
    }
    if(test[i][1] > highestY) {
      highestY = test[i][1];
    }
  }
  //see if there are transparent pixels in the square
  for(let x = lowestX; x <= highestX; x++) {
    for(let y = lowestY; y <= highestY; y++) {
      if(getPixelAlpha(x, y) < 255) {
        return true;
      }
    }
  }
  return false;
}

window.onresize = function() {
  if(renderer) {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    render();
  }
}

window.onkeydown = function(e) {
  switch(e.key) {
    case ",":
      viewState.obj--;
      viewState.obj = viewState.obj < 0 ? 0 : viewState.obj;
      rerender();
      break;
    case ".":
      viewState.obj++;
      viewState.obj = viewState.obj >= getMaxes()[1] ? getMaxes()[1] - 1 : viewState.obj;
      rerender();
      break;
    case "/":
      viewState.wire = !viewState.wire;
      rerender();
      break;
    case "]":
    case "'":
      viewState.file++;
      if(viewState.file >= getMaxes()[0]) {
        viewState.file = getMaxes()[0] - 1;
      } else {
        viewState.obj = 0;
      }
      rerender();
      break;
    case "[":
    case ";":
      viewState.file--;
      if(viewState.file < 0) {
        viewState.file = 0;
      } else {
        viewState.obj = 0;
      }
      rerender();
      break;
    case "\\":
      if(file.comb && file.comb.length > 0) {
        viewState.comb = !viewState.comb;
        viewState.file = 0;
        viewState.obj = 0;
        rerender();
      } else {
        viewState.comb = false;
      }
      break;
    case "p":
      if(viewState.comb && file.comb[viewState.file].type == "anim") {
        nextFrame();
      }
      break;
  }
}
