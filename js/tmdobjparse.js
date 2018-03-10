
//parses a tmd object and creates a mesh
function createObj(tmd, num, full) {
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
    addPrim(geometry, prim, false);
    if(prim.quad) {
      //again, for the second half of the quad
      addPrim(geometry, prim, true);
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

//parses a primitive and adds to geometry
function addPrim(geometry, prim, isSecond) {
  let id = isSecond ? [2, 3, 1] : [2, 1, 0];

  if(prim.vertIndexes.length > 0) {
    //add the faces
    geometry.faces.push(
      new THREE.Face3(
        prim.vertIndexes[id[0]],
        prim.vertIndexes[id[1]],
        prim.vertIndexes[id[2]]
      )
    );
    //add the texture UV's, if it is textured
    if(prim.textured) {
      geometry.faceVertexUvs[0].push([
        new THREE.Vector2(
          prim.texXY[id[0]][0] / 2048,
          1 - prim.texXY[id[0]][1] / 512
        ),
        new THREE.Vector2(
          prim.texXY[id[1]][0] / 2048,
          1 - prim.texXY[id[1]][1] / 512
        ),
        new THREE.Vector2(
          prim.texXY[id[2]][0] / 2048,
          1 - prim.texXY[id[2]][1] / 512
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
      //3 colors
      geometry.faces[geometry.faces.length - 1].vertexColors.push(
        new THREE.Color(prim.realCol[id[0]]),
        new THREE.Color(prim.realCol[id[1]]),
        new THREE.Color(prim.realCol[id[2]])
      );
    } else {
      //no colors
      geometry.faces[geometry.faces.length - 1].vertexColors.push(
        new THREE.Color(0xffffff),
        new THREE.Color(0xffffff),
        new THREE.Color(0xffffff)
      );
    }
  }
}
