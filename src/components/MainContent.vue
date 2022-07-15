<template>
  <div id="screen"></div>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { AnimationMixer } from "three/src/animation/AnimationMixer";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";
import { onMounted } from '@vue/runtime-core';

import { Water } from "three/examples/jsm/objects/Water";
// import { Water2 } from "three/examples/jsm/objects/Water2";
import { Sky } from "three/examples/jsm/objects/Sky";




export default {
  setup() {
    let scene, camera1, camera2, cameraActive, renderer, width, height, aspect, mixer, clock1, clock2, action, animation, controls, obj, pos_obj;
    let water, sun;

    // SCENE
    scene = new THREE.Scene();
    const colorBg = new THREE.Color("rgb(255, 255, 255)");
    // const colorBg = new THREE.Color("rgb(0, 0, 0)");
    // const colorBg = new THREE.Color('rgb(20, 25, 46)');
    scene.background = colorBg;
    // scene.fog = new THREE.Fog(color1, 50, 2000);


    // // XYZ AXES
    // const axes = new THREE.AxesHelper(10000);
    // scene.add(axes);


    // LIGHTS
    const ambient = new THREE.AmbientLight( 0xffffff, 0.4 );
    scene.add( ambient );
    // const lightCol = new THREE.Color('rgb(250, 243, 57)');
    const point = new THREE.PointLight(0xffffff, 0.5);
    point.position.set(0, 1500, 0);
    scene.add(point);

    // const light = new THREE.HemisphereLight( 0xffffff, 0x080820, 1 );
    // scene.add( light );


    onMounted(() => {
      // SETTINGS
      const target = document.getElementById('screen');
      width = target.clientWidth;
      height = target.clientHeight;
      aspect = width / height;


      // RENDERER
      renderer = new THREE.WebGLRenderer( {antialias: true} );
      renderer.setSize( width, height );
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      document.getElementById('screen').appendChild( renderer.domElement );


      // CAMERA
      camera1 = new THREE.PerspectiveCamera( 100, aspect, 0.1, 10000 );
      camera1.position.set( 0, 0, 0 );
      camera1.lookAt( new THREE.Vector3( 0, 0, 0 ));
      camera2 = new THREE.PerspectiveCamera(  100, aspect, 0.1, 10000 );
      camera2.position.set( 0, 1500, 0 );
      camera2.lookAt( new THREE.Vector3( 0, 0, 0 ));
      scene.add( camera2 );

      cameraActive = false;


      // SETTING
      const rotationX = 3 * Math.PI / 2 + Math.atan(camera2.position.z / camera2.position.y);
      

      // CONTROLLING CAMERA
      // controls = new OrbitControls( camera1, renderer.domElement );
      // controls.update();

      controls = new FirstPersonControls( camera1, renderer.domElement );
      controls.movementSpeed = 150;
      controls.lookSpeed = 0.1;


      // STANDARD PLANE
      const planeGeo = new THREE.PlaneGeometry( 1, 1 );
      const planeCol = new THREE.Color('rgb(94, 166, 161)')
      const planeMat = new THREE.MeshBasicMaterial( {color: planeCol, side: THREE.DoubleSide} );
      const plane = new THREE.Mesh( planeGeo, planeMat );
      plane.material.transparent = true;
      plane.material.alphaToCoverage = true;
      plane.material.opacity = 0;
      plane.rotation.x = rotationX;
      scene.add( plane );



      sun = new THREE.Vector3();

      // Water
      const waterGeo = new THREE.PlaneGeometry( 50000, 50000 );

      water = new Water(
        waterGeo,
        {
          textureWidth: 5000,
          textureHeight: 5000,
          waterNormals: new THREE.TextureLoader().load( '${publicPath}textures/waternormals.jpg', function ( texture ) {

            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

          } ),
          sunDirection: new THREE.Vector3(),
          sunColor: 0xffffff,
          waterColor: new THREE.Color('rgb(89, 206, 212)'),
          // waterColor: 0x001e0f,
          distortionScale: 3.7,
          fog: scene.fog !== undefined
        }
      );

      water.rotation.x = rotationX;
      water.position.y = -100;

      scene.add( water );


      // Skybox
      const sky = new Sky();
      sky.scale.setScalar( 450000 );
      scene.add( sky );

      const skyUniforms = sky.material.uniforms;

      skyUniforms[ 'turbidity' ].value = 10;
      skyUniforms[ 'rayleigh' ].value = 2;
      skyUniforms[ 'mieCoefficient' ].value = 0.005;
      skyUniforms[ 'mieDirectionalG' ].value = 0.8;

      const parameters = {
        elevation: 2,
        azimuth: 180
      };

      const pmremGenerator = new THREE.PMREMGenerator( renderer );

      function updateSun() {

        const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
        const theta = THREE.MathUtils.degToRad( parameters.azimuth );

        sun.setFromSphericalCoords( 1, phi, theta );

        sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
        water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

        scene.environment = pmremGenerator.fromScene( sky ).texture;

      }

      updateSun();




      // TEXT LOADER
      // const fontLoader = new FontLoader();
      // fontLoader.load(
      //   '/fonts/helvetiker_regular.typeface.json',
      //   function ( font ) {
      //     // const fontcolor1 = 0x006699;
      //     const fontcolor2 = new THREE.Color( "rgb(188, 143, 143)" );

      //     const matDark = new THREE.LineBasicMaterial( {
      //       // color: 0x006699,
      //       color: fontcolor2,
      //       side: THREE.DoubleSide
      //     } );

      //     const matLite = new THREE.MeshBasicMaterial( {
      //       // color: 0x006699,
      //       color: fontcolor2,
      //       transparent: true,
      //       opacity: 1,
      //       side: THREE.DoubleSide
      //     } );

      //     const message = 'Congratulations on your graduation!\nWishing you many more successes in the future.';
      //     const shapes = font.generateShapes( message, 50 );
      //     const geometry = new THREE.ShapeGeometry( shapes );
      //     geometry.computeBoundingBox();
      //     const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
      //     geometry.translate( xMid, 200, 0 );
      //     const text = new THREE.Mesh( geometry, matLite );
      //     text.position.z = - 50;
      //     scene.add( text );

      //     const holeShapes = [];
      //     for ( let i = 0; i < shapes.length; i ++ ) {
      //       const shape = shapes[ i ];
      //       if ( shape.holes && shape.holes.length > 0 ) {
      //         for ( let j = 0; j < shape.holes.length; j ++ ) {
      //           const hole = shape.holes[ j ];
      //           holeShapes.push( hole );
      //         }
      //       }
      //     }

      //     shapes.push.apply( shapes, holeShapes );

      //     const lineText = new THREE.Object3D();
      //     for ( let i = 0; i < shapes.length; i ++ ) {
      //       const shape = shapes[ i ];

      //       const points = shape.getPoints();
      //       const geometry = new THREE.BufferGeometry().setFromPoints( points );

      //       geometry.translate( xMid, 200, 0 );

      //       const lineMesh = new THREE.Line( geometry, matDark );
      //       lineText.add( lineMesh );
      //     }

      //     scene.add( lineText );
      //   }
      // )





      // TEXT
      const loader = new FontLoader();
      loader.load( '${publicPath}fonts/helvetiker_regular.typeface.json', function ( font ) {

        const textGeo1 = new TextGeometry( 'Congratulations', {
          font: font,
          size: 200,
          height: 50,
          curveSegments: 10,
          bevelThickness: 2,
          bevelSize: 0.5,
          bevelEnabled: true
        } );

        // textGeo1.computeBoundingBox();
        // const centerOffset1 = - 0.5 * ( textGeo1.boundingBox.max.x - textGeo1.boundingBox.min.x );      
        // const color3 = new THREE.Color("rgb(222, 166, 166)");
        // const textMaterial = new THREE.MeshPhongMaterial( { color: color3, specular: 0xffffff } );
        // const text1 = new THREE.Mesh( textGeo1, textMaterial );
        // text1.position.set(centerOffset1, 1000 * Math.cos( rotationX ), 1000 * Math.sin( rotationX ));
        // text1.rotation.x = rotationX;
        // text1.castShadow = true;
        // text1.receiveShadow = true;


        textGeo1.computeBoundingBox();
        const centerOffset1 = - 0.5 * ( textGeo1.boundingBox.max.x - textGeo1.boundingBox.min.x );      
        // const color3 = new THREE.Color("rgb(222, 166, 166)");
        // const textMaterial = new THREE.MeshToonMaterial({
        //   color: 0xffffff,
        //   // color: color3,
        //   gradientMap: 5,
        //   // lightMapIntensity: 1,
        // });
        const textMaterial = new THREE.MeshPhongMaterial();
        const text1 = new THREE.Mesh( textGeo1, textMaterial );
        text1.position.set(centerOffset1, 1000 * Math.cos( rotationX ), 1000 * Math.sin( rotationX ));
        text1.rotation.x = rotationX;
        text1.castShadow = true;
        text1.receiveShadow = true;




        scene.add( text1 );


        const textGeo2 = new TextGeometry( 'on your graduation!', {
          font: font,
          size: 200,
          height: 50,
          curveSegments: 10,
          bevelThickness: 2,
          bevelSize: 0.5,
          bevelEnabled: true
        } );

        textGeo2.computeBoundingBox();
        const centerOffset2 = - 0.5 * ( textGeo2.boundingBox.max.x - textGeo2.boundingBox.min.x );
        const text2 = new THREE.Mesh( textGeo2, textMaterial );
        text2.position.set( centerOffset2, 500 * Math.cos( rotationX ), 500 * Math.sin( rotationX ) );
        text2.rotation.x = rotationX;
        text2.castShadow = true;
        text2.receiveShadow = true;
        
        scene.add( text2 );


        const textGeo3 = new TextGeometry( 'Wishing you', {
          font: font,
          size: 200,
          height: 50,
          curveSegments: 10,
          bevelThickness: 2,
          bevelSize: 0.5,
          bevelEnabled: true
        } );

        textGeo3.computeBoundingBox();
        const centerOffset3 = - 0.5 * ( textGeo3.boundingBox.max.x - textGeo3.boundingBox.min.x );
        const text3 = new THREE.Mesh( textGeo3, textMaterial );
        text3.position.set( centerOffset3, 0, 0 );
        text3.rotation.x = rotationX;
        text3.castShadow = true;
        text3.receiveShadow = true;
        
        scene.add( text3 );


        const textGeo4 = new TextGeometry( 'many more successes.', {
          font: font,
          size: 200,
          height: 50,
          curveSegments: 10,
          bevelThickness: 2,
          bevelSize: 0.5,
          bevelEnabled: true
        } );

        textGeo4.computeBoundingBox();
        const centerOffset4 = - 0.5 * ( textGeo4.boundingBox.max.x - textGeo4.boundingBox.min.x );
        const text4 = new THREE.Mesh( textGeo4, textMaterial );
        text4.position.set( centerOffset4, -500 * Math.cos( rotationX ), -500 * Math.sin( rotationX ) );
        text4.rotation.x = rotationX;
        text4.castShadow = true;
        text4.receiveShadow = true;
        
        scene.add( text4 );


        const textGeo5 = new TextGeometry( 'in the future.', {
          font: font,
          size: 200,
          height: 50,
          curveSegments: 10,
          bevelThickness: 2,
          bevelSize: 0.5,
          bevelEnabled: true
        } );

        textGeo5.computeBoundingBox();
        const centerOffset5 = - 0.5 * ( textGeo5.boundingBox.max.x - textGeo5.boundingBox.min.x );
        const text5 = new THREE.Mesh( textGeo5, textMaterial );
        text5.position.set( centerOffset5, -1000 * Math.cos( rotationX ), -1000 * Math.sin( rotationX ) );
        text5.rotation.x = rotationX;
        text5.castShadow = true;
        text5.receiveShadow = true;
        
        scene.add( text5 );
      } );




      // MODEL LOADER
      const modelLoader = new GLTFLoader();
      const url = '${publicPath}models/Stork.glb';
      modelLoader.load(
        url,
        function( glb ) {
          obj = glb.scene;
          obj.scale.set( 0.1, 0.1, 0.1 );

          let dir_cam1 = camera1.getWorldDirection( new THREE.Vector3() );
          pos_obj = camera1.position.clone().addScaledVector(dir_cam1, 20);
          obj.position.set( pos_obj.x, pos_obj.y, pos_obj.z );
          obj.lookAt( new THREE.Vector3(0, 0, 0));

          const animations = glb.animations;

          if (animations && animations.length) {
            mixer = new AnimationMixer( obj );

            for (let i = 0; i < animations.length; i++) {
              animation = animations[i];
              
              action = mixer.clipAction( animation );
              action.setLoop( THREE.LoopRepeat );
              action.clampWhenFinished = true;
              action.play();
            }
          }

          scene.add( obj );

          function animate() {
            requestAnimationFrame( animate );

            //
            water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

            if (!cameraActive) {
              renderer.render( scene, camera1 );
            } else {
              renderer.render( scene, camera2 );
            }

            dir_cam1 = camera1.getWorldDirection( new THREE.Vector3() );
            pos_obj = camera1.position.clone().addScaledVector(dir_cam1, 20);
            obj.position.set( pos_obj.x, pos_obj.y, pos_obj.z );

            let dir_cam1_inf = dir_cam1.clone().multiplyScalar(5000);
            obj.lookAt(dir_cam1_inf.x, dir_cam1_inf.y, dir_cam1_inf.z);
            // obj.lookAt(dir_cam1_inf.negate().x, dir_cam1_inf.negate().y, dir_cam1_inf.negate().z);
            

            if (mixer) {
              mixer.update( clock1.getDelta() );
              controls.update( clock2.getDelta() );
            }
          }

          animate();
        }
      );


      // RENDERING FUNCTION
      clock1 = new THREE.Clock();
      clock2 = new THREE.Clock();


      // RESIZING WINDOW
      function onWindowResize() {
        width = target.clientWidth;
        height = target.clientHeight;
        aspect = width / height;

        camera1.aspect = aspect;
        camera1.updateProjectionMatrix();

        camera2.aspect = aspect;
        camera2.updateProjectionMatrix();

        renderer.setSize( width, height );


        controls.handleResize();
      }

      window.addEventListener( 'resize', onWindowResize );
      onWindowResize();


      window.addEventListener("keydown", function(e){
        if (e.keyCode == 74) {
          cameraActive = true;
        }

        if (e.keyCode == 32) {
          cameraActive = false;
        }
      },false);

      window.addEventListener("mousedown", function(e) {
        if (typeof e === 'object') {
          switch (e.button) {
            case 1:
              cameraActive = true;
              break;
          }
        }
      });

      window.addEventListener('mouseup', function () {
        cameraActive = false;
      });

    })

  }
}
</script>

<style scoped>
#screen {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 1000;
  margin: 0;
  padding: 0;
}
</style>