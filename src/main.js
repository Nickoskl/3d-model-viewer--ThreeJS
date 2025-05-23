import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { colorSpaceToWorking } from 'three/tsl';
import { GLTFLoader, FBXLoader, OBJLoader } from 'three/examples/jsm/Addons.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
let frames = 0, prevTime = performance.now();

var addedHeavyMatts=false;

const loadermsg = document.getElementById('loadermsg')
const loadermain = document.getElementById('loadingmain')
loadermsg.innerHTML='Started Loading Scene'


if(screen.width<500){
}else{
  document.getElementById('loaderMsgs').style.transform ='translate(-75%,-50%)'
}


let stats,gui;

const state = {
  loadedAssets:0,
  can:{
    middle:{
      metalness:0.35,
      ior:0.9,
      roughness:0.1,
      normalScale:0.5,
    },
    topbottom:{
      metalness:0.5,
      ior:0.9,
      roughness:0.2,
      normalScale:0.5,
    }
  },
  floor:{
    visible:true
  },
  ice:{
    color:0xffffff,
    roughness:1,
    transmission:0.9,
    anisotropy:0.5,
    ior:1.3,
    bumpScale:2,
    reflectivity:1.34,
  },
  hdr: {
    rotateX: 4.2,
    rotateY: 1.8,
    rotateZ: 1,
    exposure:0.5,
    visible:false
  },
  env:{
    color:0xffffff
  },
  post:{
    dof:{
      enable:true,
      focus: 70.0,
      aperture: 0.0007,
      maxblur: 0.015,
    },
    bloom:{
      enable:false,
      strength:0.13, // strength
      radius:0.4, // radius
      threshold:0.15 // threshold
    },
  }
};



const scene = new THREE.Scene();

scene.background = new THREE.Color(0xffffff); // Replace 0x87CEEB with your desired color

stats = new Stats();
if(screen.width<500){
  stats.dom.style='position: fixed;bottom: 0px;right: 0px;cursor: pointer;opacity: 0.9;z-index: 10000;'
}
document.body.appendChild( stats.dom );




const textureLoader = new THREE.TextureLoader();
const textureLoader2 = new THREE.ImageBitmapLoader();//TODO



gui = new GUI();
				const canFolder = gui.addFolder( 'Can' );

        if(screen.width<500){
          canFolder.close();
        }else{
          canFolder.open();
        }

          const TopBottomFolder = canFolder.addFolder('Top/Bottom - Brushed Metal')
          TopBottomFolder.open();
          const MiddleFolder = canFolder.addFolder('Middle - Color/Logo')
          MiddleFolder.open();
        const iceFolder = gui.addFolder( 'Ice' );
        if(screen.width<500){
          iceFolder.close();
        }else{
          iceFolder.open();
        }
        const floorFolder = gui.addFolder( 'Floor' );
        if(screen.width<500){
          floorFolder.close();
        }else{
          floorFolder.open();
        }
        const envFolder = gui.addFolder( 'Enviroment' );
        if(screen.width<500){
          envFolder.close();
        }else{
          envFolder.open();
        }
				const POSTFolder = gui.addFolder( 'Post Processing' );
        if(screen.width<500){
          POSTFolder.close();
        }else{
          POSTFolder.open();
        }
          const BloomFolder = POSTFolder.addFolder( 'Bloom' );
          BloomFolder.open();
          const DepthOfFieldFolder = POSTFolder.addFolder( 'Depth Of Field' );
          DepthOfFieldFolder.open();






// ############################## START OF POLLIIGON EXAMPLE

// const aoMap = textureLoader.load('/pbr/GroundDirtRocky002/GroundDirtRocky002_AO_8K.jpg');
// const roughnessMap = textureLoader.load('/pbr/GroundDirtRocky002/GroundDirtRocky002_GLOSS_8K.jpg');
// // roughnessMap.colorSpace = THREE.SRGBColorSpace
// // const colorMap = textureLoader.load('/pbr/GroundDirtRocky002/GroundDirtRocky002_COL_8K.jpg')
// const colorMap = textureLoader.load('/pbr/GroundDirtRocky002/GroundDirtRocky002_COL_8K.jpg')
// colorMap.colorSpace = THREE.SRGBColorSpace
// const normalMap = textureLoader.load('/pbr/GroundDirtRocky002/GroundDirtRocky002_NRM_8K.jpg');
// const displacementMap = textureLoader.load('/pbr/GroundDirtRocky002/GroundDirtRocky002_DISP_8K.jpg'); // Load displacement map

// const bumpMap = textureLoader.load('/pbr/GroundDirtRocky002/GroundDirtRocky002_BUMP_8K.jpg');

// // Set the encoding for the color map
// colorMap.encoding = THREE.sRGBEncoding;

// // Set the scale of the textures
// const textureScale = 1; // Change this value to scale the textures

// aoMap.repeat.set(textureScale, textureScale);
// roughnessMap.repeat.set(textureScale, textureScale);
// colorMap.repeat.set(textureScale, textureScale);
// normalMap.repeat.set(textureScale, textureScale);
// bumpMap.repeat.set(textureScale, textureScale);
// displacementMap.repeat.set(textureScale, textureScale); // Set scale for displacement map


// // Enable texture repeating
// aoMap.wrapS = aoMap.wrapT = THREE.RepeatWrapping;
// roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;
// colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping;
// normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
// bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;
// displacementMap.wrapS = displacementMap.wrapT = THREE.RepeatWrapping; // Enable repeating for displacement map


// const geometry = new THREE.SphereGeometry(3, 1024, 1024);
// // geometry.setAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv.array, 2));



// const material = new THREE.MeshPhysicalMaterial({
//   map:colorMap,
//   aoMap: aoMap,
//   normalMap:normalMap,
//   bumpMap:bumpMap,
//   bumpScale:4,
//   roughnessMap: roughnessMap,
//   roughness:5,
//   displacementMap: displacementMap, // Add displacement map
//   displacementScale: 0.2
// })

// const mesh = new THREE.Mesh(geometry,material)
// scene.add(mesh);


// ############################## END OF POLLIIGON EXAMPLE


const rgbeLoader = new RGBELoader();
rgbeLoader.load('/pbr/blocky_photo_studio_1k.hdr',  async (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  // scene.background = texture;
  scene.environment = texture;
  scene.environmentRotation=new THREE.Euler(state.hdr.rotateX, state.hdr.rotateY, state.hdr.rotateZ, 'XYZ' );
  scene.backgroundRotation=new THREE.Euler(state.hdr.rotateX, state.hdr.rotateY, state.hdr.rotateZ, 'XYZ' );
  scene.environmentIntensity=0.7;
  scene.castShadow = true;

  envFolder.add( state.hdr, 'rotateX', 0.1, 10, 0.1 ).onChange( function () {

    scene.environmentRotation=new THREE.Euler(state.hdr.rotateX, state.hdr.rotateY, state.hdr.rotateZ, 'XYZ' );
    scene.backgroundRotation=new THREE.Euler(state.hdr.rotateX, state.hdr.rotateY, state.hdr.rotateZ, 'XYZ' );

  } );

  envFolder.add( state.hdr, 'rotateY', 0.1, 10, 0.1 ).onChange( function () {

    scene.environmentRotation=new THREE.Euler(state.hdr.rotateX, state.hdr.rotateY, state.hdr.rotateZ, 'XYZ' );
    scene.backgroundRotation=new THREE.Euler(state.hdr.rotateX, state.hdr.rotateY, state.hdr.rotateZ, 'XYZ' );

  } );

  envFolder.add( state.hdr, 'rotateZ', 0.1, 10, 0.1 ).onChange( function () {

    scene.environmentRotation=new THREE.Euler(state.hdr.rotateX, state.hdr.rotateY, state.hdr.rotateZ, 'XYZ' );
    scene.backgroundRotation=new THREE.Euler(state.hdr.rotateX, state.hdr.rotateY, state.hdr.rotateZ, 'XYZ' );

  } );

  envFolder.add( state.hdr, 'exposure', 0.1, 1, 0.1 ).onChange( function () {

    scene.environmentIntensity=state.hdr.exposure;

  } );

  envFolder.addColor( state.env, 'color',colorSpaceToWorking(state.env.color,'hex') ).onChange( function () {

    scene.background = new THREE.Color(state.env.color);
    state.hdr.visible=false

  } );


envFolder.add( state.hdr, 'visible').onChange( function () {

    if(state.hdr.visible){
      scene.background = texture;
    }else{
      scene.background = new THREE.Color(state.env.color);
    }

  } );

  loadermsg.innerHTML='Imported HDR Enviroment'
  state.loadedAssets++

});


const mesh = new FBXLoader();


const sizes ={
  width: window.innerWidth,
  height: window.innerHeight,
}

// const direct = new THREE.DirectionalLight(0xffffff,1);
// direct.castShadow = true;
// direct.position.set( 1, 1, 0 );
// direct.castShadow=true;
// scene.add(direct)

// const light = new THREE.PointLight(0xffffA5,3000,3000);
// light.position.set(0,10,30)
// light.castShadow=true;
// scene.add(light)

// const light2 = new THREE.SpotLight(0xffff4a,10000,200,Math.PI/10,Math.PI/10);
// light2.position.set(-50,30,20)
// light2.castShadow=true;
// scene.add(light2)

// const light3 = new THREE.PointLight(0xffffff,500,1000);
// light3.position.set(-20,10,-10)
// light3.castShadow=true;
// scene.add(light3)

// const ambient = new THREE.AmbientLight(0xffffff,0.5,0.5);
// scene.add(ambient)

// const lightHelper = new THREE.PointLightHelper(light);
// const spotLightHelper = new THREE.SpotLightHelper( light2 );
// const lightHelper3 = new THREE.PointLightHelper(light3);
// scene.add(lightHelper)
// scene.add(spotLightHelper)
// scene.add(lightHelper3)



const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({canvas})


renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
THREE.ColorManagement.enabled = true; 
renderer.useLegacyLights = false; 

var gltf_val=''
var gltf_mat='';
var gltf_mat2='';
var gltf_mat3='';
var topbottomadded=false;
const addedMaterialsMiddle = new Set(); 
const addedMaterialsTopBottom = new Set(); 
const addedMaterialsNormalMap = new Set(); 

let floorMirror;

const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height,0.01,1000);

mesh.load('/webexpfbx2.fbx', async function (gltf) {

  console.log(gltf)
  gltf_val= gltf

    const textures = new Set();


    gltf.traverse((node) => {
      if (node.isMesh) {
        const material = node.material;
        console.log(material)
        loadermain.innerHTML='LOADING TEXTURES';
        // const colorMap = textureLoader.load('/pbr/icecuvetest.png')
        const colorMap = textureLoader.load('/pbr/ice_color.png')
        const roughnessMap = textureLoader.load('/pbr/ice_roughness3.png', (texture) => {
          texture.encoding = THREE.LinearEncoding;
          // texture.format = THREE.AlphaFormat ;
          texture.type = THREE.FloatType;
          texture.repeat.set(0.7, 0.8);
        
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            loadermsg.innerHTML='Imported Ice (roughness)'
            state.loadedAssets++
        });
        const specularMap = textureLoader.load('/pbr/ice_specular.png', (texture) => {
          texture.encoding = THREE.LinearEncoding;
          // texture.format = THREE.AlphaFormat ;
          texture.type = THREE.FloatType;
          
        });
        const specularInvMap = textureLoader.load('/pbr/ice_specular_inv.png', (texture) => {
          texture.encoding = THREE.LinearEncoding;
          // texture.format = THREE.AlphaFormat ;
          texture.type = THREE.FloatType;
        });

        const transMap = textureLoader.load('/pbr/ice_transmission.png', (texture) => {
          texture.encoding = THREE.LinearEncoding;
          // texture.format = THREE.AlphaFormat ;
          texture.type = THREE.FloatType;
        });

        const displacementMap = textureLoader.load('/pbr/ice_disp.png', (texture) => {
          texture.encoding = THREE.LinearEncoding;
          // texture.format = THREE.AlphaFormat ;
          texture.type = THREE.FloatType;
        });

        const combColorAndDispMap = textureLoader.load('/pbr/ice_color_with_disp_for_bump.png', (texture) => {
          texture.encoding = THREE.LinearEncoding;
          // texture.format = THREE.AlphaFormat ;
          texture.type = THREE.FloatType;
          loadermsg.innerHTML='Imported Ice (bump)'
          state.loadedAssets++
        });
        // specularInvMap.colorSpace = THREE.SRGBColorSpace



        if(material.name=='Ice_cube'){
          gltf_mat = new THREE.MeshPhysicalMaterial({
            color:state.ice.color,
            roughnessMap:roughnessMap,
            roughness:state.ice.roughness,
            transmission:state.ice.transmission,
            anisotropy:state.ice.anisotropy,
            ior:state.ice.ior,
            bumpMap:combColorAndDispMap,
            bumpScale:state.ice.bumpScale,
            reflectivity:state.ice.reflectivity,
          });


          iceFolder.addColor(state.ice, 'color').onChange(function (value) {
            gltf_mat.color.set(value);
          });
  
          iceFolder.add(state.ice, 'roughness', 0.01, 1, 0.01).onChange(function (value) {
            gltf_mat.roughness = value;
          });
  
          iceFolder.add(state.ice, 'transmission', 0.01, 1, 0.01).onChange(function (value) {
            gltf_mat.transmission = value;
          });
  
          iceFolder.add(state.ice, 'anisotropy', 0.01, 1, 0.01).onChange(function (value) {
            gltf_mat.anisotropy = value;
          });
  
          iceFolder.add(state.ice, 'ior', 0.1, 2.3, 0.1).onChange(function (value) {
            gltf_mat.ior = state.ice.ior;
          });
  
          iceFolder.add(state.ice, 'bumpScale', 0.1, 10, 0.1).onChange(function (value) {
            gltf_mat.bumpScale = value;
          });
  
          iceFolder.add(state.ice, 'reflectivity', 0.01, 10, 0.01).onChange(function (value) {
            gltf_mat.reflectivity = value;
          });
  

          node.material = gltf_mat
        }

      



        
      if (material.name === 'floor') {


        

        gltf_mat = new THREE.MeshPhysicalMaterial({
          color:0xffffff,
        });

        node.material = gltf_mat
      }

      const can_colorMap = textureLoader.load('/pbr/can_color.png', (texture) => {
          texture.repeat.set(0.7, 0.8);
          
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        
          texture.offset.set(1.36, 0.4); 

          loadermsg.innerHTML='Imported Can Texture (color)';
          state.loadedAssets++
        });

        


        const can_Metalness = textureLoader.load('/pbr/can_metalness.jpg', (texture) => {

          texture.repeat.set(0.7, 0.8);

          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        
          texture.offset.set(1.37, 0.4);
          loadermsg.innerHTML='Imported Can Texture (metalness)';
          state.loadedAssets++
        });
        

        const can_Specular = textureLoader.load('/pbr/can_specular.jpg', (texture) => {

          texture.colorSpace = THREE.SRGBColorSpace

          texture.repeat.set(0.7, 0.8);

          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        
          texture.offset.set(1.37, 0.4);
          loadermsg.innerHTML='Imported Can Texture (specular)';
          state.loadedAssets++
        });

        


        if(material.name=='ScratchesLight001_6K_DIALECTRIC'){
          gltf_mat2 = new THREE.MeshPhysicalMaterial({
            map:can_colorMap,
            metalnessMap:can_Metalness,
            metalness:state.can.middle.metalness,
            ior:state.can.middle.ior,
            roughness:state.can.middle.roughness,
            specularColorMap:can_Specular,
            specularIntensityMap:can_Specular,
          });




          MiddleFolder.add(state.can.middle, 'metalness', 0.01, 1, 0.01).onChange(function (value) {
            gltf_mat2.metalness = value;
          });
  
          MiddleFolder.add(state.can.middle, 'ior', 0.1, 2.3, 0.1).onChange(function (value) {
            gltf_mat2.ior = value;
          });
  
          MiddleFolder.add(state.can.middle, 'roughness', 0.01, 1, 0.01).onChange(function (value) {
            gltf_mat2.roughness = value;
          });

          if (!addedMaterialsNormalMap.has(gltf_mat2)) {
            addedMaterialsNormalMap.add(gltf_mat2);
          }
          if (!addedMaterialsMiddle.has(gltf_mat2)) {
            addedMaterialsMiddle.add(gltf_mat2);
        }


          node.material = gltf_mat2
        }


        const lid_colorMap = textureLoader.load('/pbr/lid_color.jpg', (texture) => {
          texture.repeat.set(0.7, 0.8);
        
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          texture.rotation= Math.PI /2

          texture.offset.set(1.37, 0.4); 
          loadermsg.innerHTML='Imported Can Metal (color)';
          state.loadedAssets++
        });





        if(material.name=='aiStandardSurface2'){
          gltf_mat3 = new THREE.MeshPhysicalMaterial({
            map:lid_colorMap,
            metalnessMap:can_Metalness,
            metalness:state.can.topbottom.roughness,
            ior:state.can.topbottom.roughness,
            roughness:state.can.topbottom.roughness,
          });



          if (!addedMaterialsTopBottom.has(gltf_mat3)) {
            addedMaterialsTopBottom.add(gltf_mat3);
        }
        if (!addedMaterialsNormalMap.has(gltf_mat3)) {
          addedMaterialsNormalMap.add(gltf_mat3);
        }


          node.material = gltf_mat3
        }


      }
    });
  
    // Log the extracted textures
    textures.forEach((texture) => {
      // console.log(texture);
    });
  


  gltf.children.forEach(element => {
    if (element.isMesh) {
      element.castShadow=true;
      element.receiveShadow=true;
      element.rotateY(Math.PI/2*7)
      scene.add(element);
    }
  });
  // gltf.children[2].children.forEach(element => {
  //   if (element.isMesh) {
  //     element.castShadow=true;
  //     element.receiveShadow=true;
  //     scene.add(element);
  //   }
  // });

  // gltf.children[2].children[1].children[1].children.forEach(element => {
  //   if (element.isMesh) {
  //     element.castShadow=true;
  //     element.receiveShadow=true;
  //     scene.add(element);
  //   }
  // });

  // gltf.children[2].children[1].children[1].children.forEach(element => {
  //   if (element.isMesh) {
  //     element.castShadow=true;
  //     element.receiveShadow=true;
  //     console.log(element);
  //     scene.add(element);
  //   }
  // });

    gltf.children[2].children[2].children.forEach(element => {
    if (element.isMesh) {
      element.castShadow=true;
      element.receiveShadow=true;
      console.log(element);
      scene.add(element);
    }
  });

  gltf.children[2].children[2].children[0].children.forEach(element => {
    if (element.isMesh) {
      element.castShadow=true;
      element.receiveShadow=true;
      console.log(element);
      scene.add(element);
    }
  });

  gltf.children[2].children[2].children[0].children.forEach(element => {
    if (element.isMesh) {
      element.castShadow=true;
      element.receiveShadow=true;
      console.log(element);
      scene.add(element);
    }
  });


  gltf.children[2].children[1].children.forEach(element => {
    if (element.isMesh) {
      element.castShadow=true;
      element.receiveShadow=true;
      scene.add(element);
    }
  });

  let geometry;

  geometry = new THREE.CircleGeometry( 400, 64 );



  floorMirror = new Reflector( geometry, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
  } );



  floorMirror.position.y = -10.8;
  floorMirror.rotation.x= - Math.PI /2;
  if(state.floor.visible){
    scene.add( floorMirror );
  }

  floorFolder.add(state.floor,'visible').onChange(()=>{
    if(state.floor.visible){
      scene.add( floorMirror );
    }else{
      scene.remove(floorMirror);
    }
  })




  camera.position.z=10;
  camera.position.copy(gltf_val.children[2].children[0].position);
  camera.quaternion.copy(gltf_val.children[2].children[0].quaternion);
  camera.scale.copy(gltf_val.children[2].children[0].scale);
  camera.fov = gltf_val.children[2].children[0].fov; 
  camera.updateProjectionMatrix();
  scene.add(camera);

  loadermsg.innerHTML='Imported FBX Model';
  document.getElementById('loader').style.backgroundColor='#00000056';
  state.loadedAssets++;

});



TopBottomFolder.add(state.can.topbottom, 'metalness', 0.01, 1, 0.01).onChange(function (value) {
  addedMaterialsMiddle.forEach(material => {
    material.metalness = state.can.topbottom.metalness;
  });
});

TopBottomFolder.add(state.can.topbottom, 'ior', 0.1, 2.3, 0.1).onChange(function (value) {
  addedMaterialsMiddle.forEach(material => {
    material.ior = state.can.topbottom.ior;
  });
});

TopBottomFolder.add(state.can.topbottom, 'roughness', 0.01, 1, 0.01).onChange(function (value) {
  addedMaterialsMiddle.forEach(material => {
    material.roughness = state.can.topbottom.roughness;
  });
});






renderer.setSize(sizes.width,sizes.height);
renderer.setPixelRatio(2);
renderer.shadowMap.enabled=true;



const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));


const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  state.post.bloom.strength, // strength
  state.post.bloom.radius, // radius
  state.post.bloom.threshold // threshold
);
if(state.post.bloom.enable){
  composer.addPass(bloomPass);
}else{
  composer.removePass(bloomPass);
}


BloomFolder.add(state.post.bloom, 'strength', 0.01, 1.00, 0.01).onChange(function () {
  bloomPass.strength = state.post.bloom.strength;
});

BloomFolder.add(state.post.bloom, 'radius', 0.01, 1.00, 0.01).onChange(function () {
  bloomPass.radius = state.post.bloom.radius;
});

BloomFolder.add(state.post.bloom, 'threshold', 0.01, 1.00, 0.01).onChange(function () {
  bloomPass.threshold = state.post.bloom.threshold;
});


BloomFolder.add( state.post.bloom, 'enable').onChange( function () {

  if(state.post.bloom.enable){
    composer.addPass(bloomPass);
  }else{
    composer.removePass(bloomPass);
  }

} );

const bokehPass = new BokehPass(scene, camera, {
  focus: state.post.dof.focus,
  aperture: state.post.dof.aperture,
  maxblur: state.post.dof.maxblur,
  
});

if(state.post.dof.enable){
  composer.addPass(bokehPass);
}else{
  composer.removePass(bokehPass);
}


DepthOfFieldFolder.add(state.post.dof, 'focus', 1, 200, 1).onChange(function () {
  bokehPass.materialBokeh.uniforms['focus'].value = state.post.dof.focus;
});

DepthOfFieldFolder.add(state.post.dof, 'aperture', 0.0001, 0.0050, 0.0001).onChange(function () {
  bokehPass.materialBokeh.uniforms['aperture'].value = state.post.dof.aperture;
});

DepthOfFieldFolder.add(state.post.dof, 'maxblur', 0.001, 0.050, 0.001).onChange(function () {
  bokehPass.materialBokeh.uniforms['maxblur'].value = state.post.dof.maxblur;
});



DepthOfFieldFolder.add( state.post.dof, 'enable').onChange( function () {

  if(state.post.dof.enable){
    composer.addPass(bokehPass);
  }else{
    composer.removePass(bokehPass);
  }

} );
const controls = new OrbitControls(camera,canvas);
// controls.enableDamping=true;
// controls.enablePan=false;
// controls.enableZoom=false;

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  composer.setSize(sizes.width, sizes.height);
});

var addedEL=false;

const addHeavyMaterials= async()=>{
  addedMaterialsNormalMap.forEach(material => {
    const can_normals = textureLoader.load('/pbr/can_normals.png', (texture) => {
      texture.repeat.set(0.7, 0.8);
    
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.rotation=Math.PI / 2;
      texture.offset.set(1.37, 0.4); 
      // loadermsg.innerHTML='Imported Can Texture (normals)';
      state.loadedAssets++
      document.getElementById('specsUpdText').innerHTML='Your Device Hardware is Capable. Added Can Texture (metalness)'
      document.getElementById('specsUpdText').innerHTML=document.getElementById('specsUpdText').innerHTML+'<br><i class="pi pi-check" style="font-size: 2rem"></i>'
      setTimeout(()=>{document.getElementById('specsUpd').style.opacity=0},8000)
    });


    material.normalMap = can_normals;
    material.normalScale=new THREE.Vector2( state.can.middle.normalScale, state.can.middle.normalScale )


    

    // normalMap:can_normals,
    //         normalScale:new THREE.Vector2( state.can.middle.normalScale, state.can.middle.normalScale ),
    console.log("LOADED HEAVY MATTERIALS")
  });
      
  MiddleFolder.add(state.can.middle, 'normalScale', 0.01, 10, 0.01).onChange(function (value) {
    addedMaterialsMiddle.forEach(material => {
      material.normalScale = new THREE.Vector2( state.can.middle.normalScale, state.can.middle.normalScale )
    });
  });
  TopBottomFolder.add(state.can.topbottom, 'normalScale', 0.01, 10, 0.01).onChange(function (value) {
    addedMaterialsTopBottom.forEach(material => {
      material.normalScale = new THREE.Vector2(state.can.topbottom.normalScale, state.can.topbottom.normalScale);
    });
  });
}

const addEventListeners=()=>{
  const sliderElm = document.getElementsByClassName('controller');
  const colorElm = document.querySelectorAll('input[type=color]');
  const cont = document.getElementsByClassName('lil-gui');
    // console.log(elm)
    Array.from(sliderElm).forEach(indElm=>{

      indElm.addEventListener("touchstart",function(){
        cont[0].style.opacity='0.1'
      })
  
      indElm.addEventListener("touchend",function(){
        cont[0].style.opacity='0.6'
      })

    })

    Array.from(colorElm).forEach(indElm=>{

      indElm.addEventListener("input",function(){
        cont[0].style.opacity='0.1'
      })
  
      indElm.addEventListener("touchend",function(){
        cont[0].style.opacity='0.6'
      })

    })

    console.log(stats)
}

const loop = async () => {
  controls.update();
  composer.render();
  stats.update();
  window.requestAnimationFrame(loop);

  frames ++;
  const time = performance.now();
  
  if ( time >= prevTime + 1000 ) {
  
    console.log( Math.round( ( frames * 1000 ) / ( time - prevTime ) ) );

    if((Math.round( ( frames * 1000 ) / ( time - prevTime ) ))>19&& !addedHeavyMatts&& state.loadedAssets>=38){
      await addHeavyMaterials()
      document.getElementById('specsUpdText').innerHTML='Your Device Hardware is Capable. Adding Heavy Materials'
      document.getElementById('specsUpdText').innerHTML=document.getElementById('specsUpdText').innerHTML+'<br><i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>'
      addedHeavyMatts=true;
    }
    if((Math.round( ( frames * 1000 ) / ( time - prevTime ) ))<=19&& !addedHeavyMatts&& state.loadedAssets>=38){
      document.getElementById('specsUpdText').innerHTML='Your Device Hardware is Not Capable. Added Light Materials'
      document.getElementById('specsUpdText').innerHTML=document.getElementById('specsUpdText').innerHTML+'<br><i class="pi pi-exclamation-circle" style="font-size: 2rem"></i>'
    }
    
    frames = 0;
    prevTime = time;
    
  }
  
  console.log(state.loadedAssets);
  if(state.loadedAssets>=38){
    // if(true){
    if(!addedEL){
      addEventListeners();
      addedEL=true;
    }
    setTimeout(()=>{ loadermain.innerHTML='';document.getElementById('loaderMsgs').style.padding='2% 0';document.getElementById('updContainer').innerHTML='<i class="pi pi-check"></i><p id="loadermsg">Done</p>'},1000);
    setTimeout(()=>{document.getElementById('loader').style.backdropFilter='blur(0)';document.getElementById('loader').style.backgroundColor='#00000000';document.getElementById('loaderMsgs').style.opacity=0;},1500);
  }
};



loop();

// const tl = gsap.timeline({defaults:{
//   duration:1,
// }})

// tl.fromTo(mesh.scale, {z:0,x:0,y:0},{z:1,x:1,y:1})

// let mouseDown = false;
// let rgb=[];

// window.addEventListener('mousedown',()=>{
//   mouseDown=true;
// })
// window.addEventListener('mouseup',()=>{
//   mouseDown=false;
// })

// window.addEventListener('mousemove',(e)=>{
//   if(mouseDown){
//     rgb=[
//       Math.round((e.pageX/sizes.width)*255),
//       Math.round((e.pageY/sizes.height)*255),
//       150,
//     ]

//     let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
//     gsap.to(mesh.material.color, {r:newColor.r,g:newColor.g,b:newColor.b})
//   }
// })