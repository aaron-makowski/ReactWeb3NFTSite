import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { useRef, Suspense, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'; //useLoader
import { OrbitControls, Html, useProgress } from "@react-three/drei";
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib'
RectAreaLightUniformsLib.init()

function Loader() {
  const { progress } = useProgress()
  return <Html center>{progress} % loaded</Html>
}

import { TextureLoader } from 'three/src/loaders/TextureLoader'

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

import * as THREE from 'three';

function Stars({ count = 5000 }) {
      // const positions = useMemo(() => {
        let _positions = []
        for (let i = 0; i < count; i++) {
          const r = 4000
          const theta = 2 * Math.PI * Math.random()
          const phi = Math.acos(2 * Math.random() - 1)
          const x = r * Math.cos(theta) * Math.sin(phi) + (-2000 + Math.random() * 4000)
          const y = r * Math.sin(theta) * Math.sin(phi) + (-2000 + Math.random() * 4000)
          const z = r * Math.cos(phi) + (-1000 + Math.random() * 2000)
          _positions.push(x)
          _positions.push(y)
          _positions.push(z)
        }
      //   return new Float32Array(_positions)
      // }, [count])
      let positions = new Float32Array(_positions)

      return (positions ?
        <points>
          <bufferGeometry attach="geometry">
            <bufferAttribute attachObject={['attributes', 'position']} 
                              count={positions.length / 3} 
                              array={positions} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial attach="material" size={12.5} 
                          sizeAttenuation color="white" fog={false} />
        </points>
        : <Loader />
      )
}


function Model(){
      const ref = useRef();
      const [model, setModel] = useState(null);
      const url = '/world/untitled.obj'
      const mtlUrl = '/world/untitled.mtl'

      const loaderObj = new OBJLoader();
      const loaderMtl = new MTLLoader();
      useEffect(() => {
      loaderMtl.load(
            mtlUrl, mtl => {
              mtl.preload();
              loaderObj.setMaterials(mtl);
              loaderObj.load(
                url, obj => {
                  // console.log(obj)
                  // obj.traverse((child) => {
                  //       if (child.isMesh) {
                  //             child.material.displacementMap = new TextureLoader().load('/world/DisplacementMap.png');
                  //             child.material.displacementScale=0.15;
                  //       }
                  // });
                  setModel(obj);                        
                });
            });
      }, [])

      // console.log(ref)
      useFrame( ( {clock} ) => {
            if (ref.current) {
                  // traverse children
                  ref.current.rotation.x = Math.cos(clock.getElapsedTime() / 21) * -Math.PI /2
                  ref.current.rotation.y = Math.cos(clock.getElapsedTime() / 21) * Math.PI /2
                  ref.current.rotation.z = Math.cos(clock.getElapsedTime() / 21) * Math.PI /2

                  ref.current.children.forEach(child => {
                        if (child.isMesh) {
                              child.rotation.y += 0.007;
                        }
                  });
            }
      });

      return (model ? 
            <group ref={ref}>
                  <Stars />
                  <rectAreaLight intensity={1} position={[10, 10, 10]} width={10} height={1000} onUpdate={(self) => self.lookAt(new THREE.Vector3(0, 0, 0))} />
                  <rectAreaLight intensity={1} position={[-10, -10, -10]} width={1000} height={10} onUpdate={(self) => self.lookAt(new THREE.Vector3(0, 0, 0))} />
                  <ambientLight intensity={0.8} />
                  <mesh position={[0, 0, 0]}> 
                        {/* add rotation counter clockwise o nthe y axis */}
                        <bufferGeometry attach="geometry" {...model.children[0].geometry} />
                        <meshPhongMaterial attach="material" {...model.children[0].material} roughness={0.5} metalness={0.5}/>
                  </mesh>
                  <mesh position={[7, 2, -10]}>
                        <sphereBufferGeometry attach="geometry" args={[0.5, 64, 64]} />
                        <meshStandardMaterial attach="material" color="gray" map={new TextureLoader().load('/world/None-color.png')}/>
                  </mesh>
            </group>
      : <Loader />)   
}


export default function Index() {
  return (
    <div className={styles.worldContainer}>
      <Head>
        <title>MENJi NFT Drop</title>
        <meta name="description" content="MENJi NFT Site by Kodiak" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <a href="/home">
            <Canvas style={{ width: '100%', height: '100%' }}
                    camera={{ position: [0, 0, 20], fov: 40, far: 10000 }}
                    onCreated={({ gl }) => {
                        gl.toneMapping = THREE.ACESFilmicToneMapping
                    }}>
                  <OrbitControls
                        enablePan={true}
                        enableZoom={true}
                        enableRotate={true}
                        addEventListener={undefined}
                        hasEventListener={undefined}
                        removeEventListener={undefined}
                        dispatchEvent={undefined}
                  />
                  <Suspense fallback={<Loader />}>
                        <Model />
                  </Suspense>

            </Canvas>
      </a>
    </div>
  )
}
{/* <pointLight    intensity={0.1} position={[10, 10, 10]} />
<rectAreaLight intensity={3} position={[0, 10, -10]} 
                  width={30} height={30} 
                  onUpdate={(self) => self.lookAt(
                      new THREE.Vector3(0, 0, 0))} /> */}