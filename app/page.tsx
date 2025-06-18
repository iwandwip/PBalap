'use client'

import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RotateCcw, Play, Pause } from 'lucide-react'
import RobotArm from '@/components/RobotArm'

export default function Home() {
  const [joints, setJoints] = useState({
    base: 0,
    shoulder: 30,
    elbow: -45
  })
  
  const [isAnimating, setIsAnimating] = useState(false)
  const [endEffectorPos, setEndEffectorPos] = useState({ x: 0, y: 0, z: 0 })

  const updateJoint = (joint: keyof typeof joints, value: number) => {
    setJoints(prev => ({ ...prev, [joint]: value }))
  }

  const resetJoints = () => {
    setJoints({ base: 0, shoulder: 30, elbow: -45 })
    setIsAnimating(false)
  }

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto p-4 h-screen flex gap-4">
        
        <div className="flex-1 relative">
          <div className="absolute top-4 left-4 z-10">
            <Badge variant="outline" className="bg-black/50 text-white border-white/20">
              Robot Arm Simulator 3DOF
            </Badge>
          </div>
          
          <Canvas
            camera={{ position: [3, 3, 3], fov: 60 }}
            className="rounded-lg border border-white/10 bg-black/20"
          >
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
            <pointLight position={[-3, 3, -3]} intensity={0.3} />
            
            <RobotArm 
              joints={joints} 
              isAnimating={isAnimating}
              onPositionUpdate={setEndEffectorPos}
            />
            
            <Grid 
              infiniteGrid 
              size={0.5} 
              cellColor="#404040" 
              sectionColor="#606060" 
              fadeDistance={8}
            />
            
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={2}
              maxDistance={10}
            />
          </Canvas>
        </div>

        <div className="w-80 space-y-4">
          <Card className="bg-black/20 border-white/10 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                Joint Controls
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={toggleAnimation}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetJoints}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Base (θ₁)</label>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                    {joints.base}°
                  </Badge>
                </div>
                <Slider
                  value={[joints.base]}
                  onValueChange={(value) => updateJoint('base', value[0])}
                  min={-180}
                  max={180}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Shoulder (θ₂)</label>
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-300">
                    {joints.shoulder}°
                  </Badge>
                </div>
                <Slider
                  value={[joints.shoulder]}
                  onValueChange={(value) => updateJoint('shoulder', value[0])}
                  min={-90}
                  max={90}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Elbow (θ₃)</label>
                  <Badge variant="secondary" className="bg-pink-500/20 text-pink-300">
                    {joints.elbow}°
                  </Badge>
                </div>
                <Slider
                  value={[joints.elbow]}
                  onValueChange={(value) => updateJoint('elbow', value[0])}
                  min={-120}
                  max={120}
                  step={1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">End Effector Position</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">X</div>
                  <div className="text-sm font-mono bg-red-500/20 text-red-300 px-2 py-1 rounded">
                    {endEffectorPos.x.toFixed(2)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">Y</div>
                  <div className="text-sm font-mono bg-green-500/20 text-green-300 px-2 py-1 rounded">
                    {endEffectorPos.y.toFixed(2)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">Z</div>
                  <div className="text-sm font-mono bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                    {endEffectorPos.z.toFixed(2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Robot Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Link 1:</span>
                <span>1.0 units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Link 2:</span>
                <span>0.8 units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Link 3:</span>
                <span>0.6 units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">DOF:</span>
                <span>3 Degrees</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}