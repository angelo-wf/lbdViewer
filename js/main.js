let scene, camera, renderer, texture;
let file, spc = false, num = 0, ind = 0, set = true;
let ctx = el("vram").getContext("2d"), pixelData;
let globalScale = 0.001, globalOpacity = 0.6;
//add white, for solid colors
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
      doThing(fileBuf, 0);
    } else if(ext == "MOM") {
      doThing(fileBuf, 1);
    } else if(ext == "LBD") {
      doThing(fileBuf, 2);
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
      doTix(fileBuf);
    } else {
      alert("Unsupported file");
    }
  }
  reader.readAsArrayBuffer(this.files[0]);
}

function doThing(b, type) {
  warn = false;
  if(type == 0) {
    let tmd = new TMD(b);
    file = {tmds: [tmd]};
  } else if(type == 1) {
    file = new MOM(b);
  } else if(type == 2) {
    file = new LBD(b);
  }
  num = 0;
  ind = 0;
  spc = false;
  resetAnimState();
  //console.log(JSON.stringify(tmd, null, "\t"));
  if(scene == undefined) {
    init();
    return;
  }
  rerender();
}



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
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;

  camera.position.z = 5;
  rerender();
}

function render() {
  renderer.render(scene, camera);
  if(spc && file.comb[ind].type == "anim") {
    let frames = file.comb[ind].mom.tods[num].frames.length;
    let cur = animState.frame + 1;
    el("frames").textContent = ", Frame: " + cur + " / " + frames;
  } else {
    el("frames").textContent = "";
  }
}

function rerender() {
  clearScene(scene);
  //light example in three.js examples -> Minecraft example
  resetAnimState();
  if(!spc) {
    doObj();
  } else {
    doSpc();
  }
  let numTot = getMaxes()[1];
  let indTot = getMaxes()[0];
  el("info").textContent = "Combined: " + spc;
  el("info").textContent += ", File: " + (ind + 1) + " / " + indTot;
  el("info").textContent += ", Object: " + (num + 1) + " / " + numTot;
  el("info").textContent += ", Wireframe: " + !set;
  render();
}

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

//init();
//render();

function createObj(tmd, num, full) {
  //var geometry = new THREE.BoxGeometry(1, 1, 1);
  let geometry = new THREE.Geometry();
  for(let i = 0; i < tmd.objects[num].verts.length; i++) {
    //add all the vertices
    geometry.vertices.push(
      new THREE.Vector3(
        tmd.objects[num].verts[i][0] * globalScale,
        tmd.objects[num].verts[i][1] * globalScale,
        tmd.objects[num].verts[i][2] * globalScale
      )
    );
  }
  for(let i = tmd.objects[num].prims.length - 1; i >= 0; i--) {
    //add all the faces
    let prim = tmd.objects[num].prims[i];
    if(prim.vertIndexes.length > 0) {
      //add the faces
      geometry.faces.push(
        new THREE.Face3(
          prim.vertIndexes[2],
          prim.vertIndexes[1],
          prim.vertIndexes[0]
        )
      );
      //add the texture UV's, if it is textured
      if(prim.textured) {
        geometry.faceVertexUvs[0].push([
          new THREE.Vector2(
            prim.texXY[2][0] / 2048,
            1 - prim.texXY[2][1] / 512
          ),
          new THREE.Vector2(
            prim.texXY[1][0] / 2048,
            1 - prim.texXY[1][1] / 512
          ),
          new THREE.Vector2(
            prim.texXY[0][0] / 2048,
            1 - prim.texXY[0][1] / 512
          )
        ]);
        //if the texture uses transparenty, use different material
        if(checkTrans(prim.texXY, false)) {
          geometry.faces[geometry.faces.length - 1].materialIndex = 2;
        }
      } else {
        //add 'empty' uv coords, and set to transparent material if so
        geometry.faceVertexUvs[0].push([
          new THREE.Vector2(0, 0),
          new THREE.Vector2(0, 0),
          new THREE.Vector2(0, 0)
        ]);
        if(prim.transparent) {
          geometry.faces[geometry.faces.length - 1].materialIndex = 1;
        }
      }
      //add colors
      if(prim.colors.length == 1) {
        //1 color, add to face
        geometry.faces[geometry.faces.length - 1].vertexColors.push(
          new THREE.Color(prim.realCol[0]),
          new THREE.Color(prim.realCol[0]),
          new THREE.Color(prim.realCol[0])
        );
      } else if(prim.colors.length > 1) {
        //3 colors (or 4)
        geometry.faces[geometry.faces.length - 1].vertexColors.push(
          new THREE.Color(prim.realCol[2]),
          new THREE.Color(prim.realCol[1]),
          new THREE.Color(prim.realCol[0])
        );
      } else {
        //no colors
        geometry.faces[geometry.faces.length - 1].vertexColors.push(
          new THREE.Color(0xffffff),
          new THREE.Color(0xffffff),
          new THREE.Color(0xffffff)
        );
      }
      //the same, for the extra face if it is a quad
      if(prim.quad) {
        geometry.faces.push(
          new THREE.Face3(
            prim.vertIndexes[2],
            prim.vertIndexes[3],
            prim.vertIndexes[1]
          )
        );
        if(prim.textured) {
          geometry.faceVertexUvs[0].push([
            new THREE.Vector2(
              prim.texXY[2][0] / 2048,
              1 - prim.texXY[2][1] / 512
            ),
            new THREE.Vector2(
              prim.texXY[3][0] / 2048,
              1 - prim.texXY[3][1] / 512
            ),
            new THREE.Vector2(
              prim.texXY[1][0] / 2048,
              1 - prim.texXY[1][1] / 512
            )
          ]);
          if(checkTrans(prim.texXY, true)) {
            geometry.faces[geometry.faces.length - 1].materialIndex = 2;
          }
        } else {
          geometry.faceVertexUvs[0].push([
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0, 0)
          ]);
          if(prim.transparent) {
            geometry.faces[geometry.faces.length - 1].materialIndex = 1;
          }
        }
        if(prim.colors.length == 1) {
          geometry.faces[geometry.faces.length - 1].vertexColors.push(
            new THREE.Color(prim.realCol[0]),
            new THREE.Color(prim.realCol[0]),
            new THREE.Color(prim.realCol[0])
          );
        } else if(prim.colors.length > 1) {
          geometry.faces[geometry.faces.length - 1].vertexColors.push(
            new THREE.Color(prim.realCol[2]),
            new THREE.Color(prim.realCol[3]),
            new THREE.Color(prim.realCol[1])
          );
        } else {
          geometry.faces[geometry.faces.length - 1].vertexColors.push(
            new THREE.Color(0xffffff),
            new THREE.Color(0xffffff),
            new THREE.Color(0xffffff)
          );
        }
      }
    }
  }
  let materials;
  if(full) {
    materials = [
      new THREE.MeshBasicMaterial(
        {
          color: 0xffffff,
          map: texture,
          vertexColors: THREE.VertexColors
        }
      ),
      new THREE.MeshBasicMaterial(
        {
          color: 0xffffff,
          map: texture,
          transparent: true,
          opacity: globalOpacity,
          alphaTest: 0.5,
          vertexColors: THREE.VertexColors
        }
      ),
      new THREE.MeshBasicMaterial(
        {
          color: 0xffffff,
          map: texture,
          transparent: true,
          alphaTest: 0.5,
          vertexColors: THREE.VertexColors
        }
      )
    ];
  } else {
    materials = [
      new THREE.MeshBasicMaterial(
        {
          color: 0x000000,
          wireframe: true
        }
      ),
      new THREE.MeshBasicMaterial(
        {
          color: 0xff0000,
          wireframe: true
        }
      ),
      new THREE.MeshBasicMaterial(
        {
          color: 0x0000ff,
          wireframe: true
        }
      )
    ];
  }
  return new THREE.Mesh(geometry, materials);
}

function doTix(b) {
  //clear
  ctx.clearRect(0, 0, 2048, 512);
  //add white on vram part
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 640, 512);
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

function drawPixel(x, y, col) {
  let ind = (y * 2048 + x) * 4;
  pixelData.data[ind] = col[0];
  pixelData.data[ind + 1] = col[1];
  pixelData.data[ind + 2] = col[2];
  pixelData.data[ind + 3] = Math.floor(col[3] * 255);
}

function getPixelAlpha(x, y) {
  let ind = (y * 2048 + x) * 4;
  return pixelData.data[ind + 3];
}

function getMaxes() {
  if(spc) {
    let fir = ind >= file.comb.length ? 0 : file.comb[ind].count;
    let sec = file.comb.length;
    return [sec, fir];
  } else {
    let fir = ind >= file.tmds.length ? 0 : file.tmds[ind].objects.length;
    let sec = file.tmds.length;
    return [sec, fir];
  }
}

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
      num--;
      num = num < 0 ? 0 : num;
      rerender();
      break;
    case ".":
      num++;
      num = num >= getMaxes()[1] ? getMaxes()[1] - 1 : num;
      rerender();
      break;
    case "/":
      set = !set;
      rerender();
      break;
    case "]":
    case "'":
      ind++;
      if(ind >= getMaxes()[0]) {
        ind = getMaxes()[0] - 1;
      } else {
        num = 0;
      }
      rerender();
      break;
    case "[":
    case ";":
      ind--;
      if(ind < 0) {
        ind = 0;
      } else {
        num = 0;
      }
      rerender();
      break;
    case "\\":
      if(file.comb && file.comb.length > 0) {
        spc = !spc;
        ind = 0;
        num = 0;
        rerender();
      } else {
        spc = false;
      }
      break;
    case "p":
      if(spc && file.comb[ind].type == "anim") {
        next();
      }
      break;
  }
}
