function doObj() {
  let obj = createObj(file.tmds[ind], num, set);
  scene.add(obj);
}

function doSpc() {
  if(file.comb[ind].type == "tiles") {
    doTiles();
  } else {
    next();
  }
}

function resetAnimState() {
  animState.parts = [];
  animState.frame = -1;
}

let animState = {
  parts: [],
  frame: -1
};

function next() {
  animState.frame++;
  if(animState.frame >= file.comb[ind].mom.tods[num].frames.length) {
    animState.frame = 0;
    animState.parts = [];
    clearScene(scene);
    if(file.comb[ind].mom.tods[num].frames.length > 1) {
      doAnim();
      animState.frame++;
    }
  }
  doAnim();
  render();
}


function doAnim() {
  let all;
  if(animState.frame == 0) {
    all = new THREE.Group();
  }
  let tod = file.comb[ind].mom.tods[num];
  for(let j = 0; j < tod.frames[animState.frame].packet.length; j++) {
    let packet = tod.frames[animState.frame].packet[j];
    let tmd = file.comb[ind].mom.tmds[0];
    switch(packet.type) {
      case 0:
        //state change
        break;
      case 1:
        //tra/rot/scl
        if(packet.diff) {
          if(packet.hasRot) {
            animState.parts[packet.objectId].rotateX(degToRad(packet.rotX));
            animState.parts[packet.objectId].rotateY(degToRad(packet.rotY));
            animState.parts[packet.objectId].rotateZ(degToRad(packet.rotZ));
          }
          if(packet.hasScl) {
            let oldRot = animState.parts[packet.objectId].rotation.clone();
            animState.parts[packet.objectId].rotation.set(0, 0, 0);
            animState.parts[packet.objectId].scale.set(
              animState.parts[packet.objectId].scale.x * (packet.sclX),
              animState.parts[packet.objectId].scale.y * (packet.sclY),
              animState.parts[packet.objectId].scale.z * (packet.sclZ)
            );
            //when negative scaling, also invert if 1 or 3 negatives
            //fixes bugs with stg5 entities
            if(packet.sclX * packet.sclY * packet.sclZ < 0) {
              InvertObject(animState.parts[packet.objectId]);
            }
            animState.parts[packet.objectId].setRotationFromEuler(oldRot);
          }
          if(packet.hasTra) {
            let oldRot = animState.parts[packet.objectId].rotation.clone();
            animState.parts[packet.objectId].rotation.set(0, 0, 0);
            animState.parts[packet.objectId].translateX(packet.traX * globalScale);
            animState.parts[packet.objectId].translateY(packet.traY * globalScale);
            animState.parts[packet.objectId].translateZ(packet.traZ * globalScale);
            animState.parts[packet.objectId].setRotationFromEuler(oldRot);
          }
        } else {
          if(packet.hasRot) {
            animState.parts[packet.objectId].rotation.set(
              degToRad(packet.rotX),
              degToRad(packet.rotY),
              degToRad(packet.rotZ)
            );
          }
          if(packet.hasScl) {
            let oldRot = animState.parts[packet.objectId].rotation.clone();
            animState.parts[packet.objectId].rotation.set(0, 0, 0);
            animState.parts[packet.objectId].scale.set(
              packet.sclX,
              packet.sclY,
              packet.sclZ
            );
            if(packet.sclX < 0 || packet.sclY < 0 || packet.sclZ < 0) {
              console.log("Warning: Absolute negative scale in frame\n0x" + animState.frame.toString(16));
            }
            animState.parts[packet.objectId].setRotationFromEuler(oldRot);
          }
          if(packet.hasTra) {
            let oldRot = animState.parts[packet.objectId].rotation.clone();
            animState.parts[packet.objectId].rotation.set(0, 0, 0);
            animState.parts[packet.objectId].position.set(
              packet.traX * globalScale,
              packet.traY * globalScale,
              packet.traZ * globalScale
            );
            animState.parts[packet.objectId].setRotationFromEuler(oldRot);
          }
        }
        break;
      case 2:
        //set tmd part
        animState.parts[packet.objectId].add(createObj(tmd, packet.tmdId - 1, set));
        break;
      case 3:
        //set parent
        if(packet.parId == 0) {
          all.add(animState.parts[packet.objectId]);
        } else {
          animState.parts[packet.parId].add(animState.parts[packet.objectId]);
        }
        break;
      case 8:
        //enable/disable
        if(packet.create) {
          animState.parts[packet.objectId] = new THREE.Group();
        } else {
          clearScene(animState.parts[packet.objectId]);
        }
        break;
      case 15:
        //reset??
        break;
      default:
        console.log("Warning: Skipped TOD-packet\n0x" + packet.type.toString(16));
        break;
    }
  }
  if(animState.frame == 0) {
    scene.add(all);
  }
}

function doTiles() {
  let area = new THREE.Group();
  for(let i = 0; i < 400; i++) {
    if(file.tiles[i].render) {
      drawTile(file.tiles[i], i, area);
    }
  }
  scene.add(area);
}

function drawTile(tile, i, master) {
  let obj = createObj(file.tmds[0], tile.type, set);
  obj.translateX(-2048 * globalScale * (i % 20));
  obj.translateZ(-2048 * globalScale * Math.floor(i / 20));
  obj.translateY(globalScale * 2048 * tile.height);
  obj.rotateY((Math.PI / 2) * fixRot(tile.rotation));
  master.add(obj);
  if(tile.extraInd > -1) {
    drawTile(file.extraTiles[tile.extraInd], i, master);
  }
}

function degToRad(deg) {
  return deg * Math.PI / 180;
}

function InvertObject(obj) {
  for(let i = 0; i < obj.children.length; i++) {
    if(obj.children[i].geometry) {
      invertGeometry(obj.children[i].geometry);
    }
    if(obj.children[i].children) {
      InvertObject(obj.children[i]);
    }
  }
}

function invertGeometry(geo) {
  for(let i = 0; i < geo.faces.length; i++) {
    let temp = geo.faces[i].clone();
    geo.faces[i].a = temp.c;
    geo.faces[i].c = temp.a;
    temp = geo.faces[i].vertexColors[0].clone();
    geo.faces[i].vertexColors[0] = geo.faces[i].vertexColors[2].clone();
    geo.faces[i].vertexColors[2] = temp;
    //normals need to be flipped too if they are used
  }
  geo.elementsNeedUpdate = true;
  for(let i = 0; i < geo.faceVertexUvs[0].length; i++) {
    let temp = geo.faceVertexUvs[0][i][0].clone();
    geo.faceVertexUvs[0][i][0] = geo.faceVertexUvs[0][i][2].clone();
    geo.faceVertexUvs[0][i][2] = temp;
  }
  geo.uvsNeedUpdate = true;
}
