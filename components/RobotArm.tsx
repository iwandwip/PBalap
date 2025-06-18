'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Vector3 } from 'three'
import * as THREE from 'three'

interface RobotArmProps {
  joints: {
    base: number
    shoulder: number
    elbow: number
  }
  isAnimating: boolean
  onPositionUpdate: (position: { x: number, y: number, z: number }) => void
}

const RobotArm = ({ joints, isAnimating, onPositionUpdate }: RobotArmProps) => {
  const groupRef = useRef<Group>(null)
  const baseRef = useRef<Group>(null)
  const shoulderRef = useRef<Group>(null)
  const elbowRef = useRef<Group>(null)
  const endEffectorRef = useRef<Group>(null)

  const L1 = 1.0
  const L2 = 0.8
  const L3 = 0.6

  const calculateForwardKinematics = (theta1: number, theta2: number, theta3: number) => {
    const t1 = (theta1 * Math.PI) / 180
    const t2 = (theta2 * Math.PI) / 180
    const t3 = (theta3 * Math.PI) / 180

    const x = (L2 * Math.cos(t2) + L3 * Math.cos(t2 + t3)) * Math.cos(t1)
    const y = (L2 * Math.cos(t2) + L3 * Math.cos(t2 + t3)) * Math.sin(t1)
    const z = L1 + L2 * Math.sin(t2) + L3 * Math.sin(t2 + t3)

    return { x, y, z }
  }

  useEffect(() => {
    if (baseRef.current) {
      baseRef.current.rotation.z = (joints.base * Math.PI) / 180
    }
    if (shoulderRef.current) {
      shoulderRef.current.rotation.y = (joints.shoulder * Math.PI) / 180
    }
    if (elbowRef.current) {
      elbowRef.current.rotation.y = (joints.elbow * Math.PI) / 180
    }

    const pos = calculateForwardKinematics(joints.base, joints.shoulder, joints.elbow)
    onPositionUpdate(pos)
  }, [joints, onPositionUpdate])

  useFrame((state) => {
    if (isAnimating && baseRef.current) {
      baseRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.5
      
      if (shoulderRef.current) {
        shoulderRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3
      }
      
      if (elbowRef.current) {
        elbowRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.4
      }
    }
  })

  return (
    <group ref={groupRef}>
      <group ref={baseRef}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.4, 0.2, 16]} />
          <meshStandardMaterial color="#4ade80" />
        </mesh>

        <group position={[0, L1 / 2, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.05, 0.05, L1, 8]} />
            <meshStandardMaterial color="#3b82f6" />
          </mesh>

          <group ref={shoulderRef} position={[0, L1 / 2, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#f59e0b" />
            </mesh>

            <group position={[L2 / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.04, 0.04, L2, 8]} />
                <meshStandardMaterial color="#f59e0b" />
              </mesh>

              <group ref={elbowRef} position={[0, L2 / 2, 0]}>
                <mesh castShadow>
                  <sphereGeometry args={[0.06, 16, 16]} />
                  <meshStandardMaterial color="#ec4899" />
                </mesh>

                <group position={[L3 / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <mesh castShadow>
                    <cylinderGeometry args={[0.03, 0.03, L3, 8]} />
                    <meshStandardMaterial color="#ec4899" />
                  </mesh>

                  <group ref={endEffectorRef} position={[0, L3 / 2, 0]}>
                    <mesh castShadow>
                      <boxGeometry args={[0.1, 0.05, 0.15]} />
                      <meshStandardMaterial color="#ef4444" />
                    </mesh>

                    <group position={[0, 0.1, 0]}>
                      <mesh>
                        <cylinderGeometry args={[0.01, 0.01, 0.15]} />
                        <meshStandardMaterial color="#dc2626" />
                      </mesh>
                      <mesh position={[0, 0.08, 0]}>
                        <coneGeometry args={[0.02, 0.05]} />
                        <meshStandardMaterial color="#dc2626" />
                      </mesh>
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

export default RobotArm