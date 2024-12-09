"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Loader2, Power } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrainingPlot } from "@/components/training-plot"
import { BenchmarkTable } from "@/components/benchmark-table"
import { ManufacturerCombobox } from "@/components/manufacturer-combobox"
import { ParameterInput } from "@/components/parameter-input"
import { usePrediction } from "@/hooks/usePrediction"

interface Log {
  timestamp: string
  message: string
  type: "info" | "success" | "error"
}

export default function YieldStrengthPredictor() {
  const { prediction, isLoading, error, predict, isModelLoaded } = usePrediction();
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [logs, setLogs] = useState<Log[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addLog = (message: string, type: Log["type"] = "info") => {
    setLogs(prev => [...prev, {
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    }])
  }

  const handlePrediction = async (data: any) => {
    addLog("Starting prediction...")
    try {
      await predict(data);
      addLog("Prediction completed successfully!", "success")
    } catch (err) {
      addLog("Error during prediction", "error")
      console.error(err)
    }
  }

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-black text-blue-300">
      <header className="flex items-center justify-between p-4 border-b border-blue-900">
        <h1 className="text-2xl font-bold text-blue-400 flex items-center">
          <Power className="mr-2 h-6 w-6 text-blue-500" />
          Yield Strength Predictor
        </h1>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={!isModelLoaded}
            size="sm"
            className="bg-blue-900 hover:bg-blue-800 text-blue-100"
          >
            Import Data
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv,.xlsx"
            className="hidden"
          />
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="grid grid-cols-2 h-full">
          <div className="p-4 border-r border-blue-900 overflow-y-auto">
            <Card className="bg-gray-900 border-blue-800">
              <div className="space-y-4 p-4">
                <ParameterInput name="QC_Re" placeholder="QC_Re" explanation="Certificate yield strength" />
                <ParameterInput name="QC_Rm" placeholder="QC_Rm" explanation="Certificate tensile strength" />
                <ParameterInput name="QC_A" placeholder="QC_A" explanation="Certificate Elongation" />
                <ManufacturerCombobox />
                <ParameterInput name="Dimension" placeholder="Dimension" explanation="Thickness in mm" />
                <Button 
                  onClick={() => handlePrediction({
                    QC_Re: 400,
                    QC_Rm: 500,
                    QC_A: 20,
                    Dimension: 40,
                    Manufacturer: "acme",
                    Grade: "S355"
                  })}
                  disabled={isLoading || !isModelLoaded}
                  className="w-full bg-blue-700 hover:bg-blue-600 text-blue-100"
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? 'Predicting...' : 'Predict'}
                </Button>
              </div>
            </Card>
          </div>

          <div className="flex flex-col h-full">
            <Tabs defaultValue="log" className="flex-1 overflow-hidden">
              <TabsList className="w-full justify-start px-4 pt-4 bg-gray-900">
                <TabsTrigger value="log" className="data-[state=active]:bg-blue-900 data-[state=active]:text-blue-100">
                  Execution Log
                </TabsTrigger>
                <TabsTrigger value="plot" className="data-[state=active]:bg-blue-900 data-[state=active]:text-blue-100">
                  Results Plot
                </TabsTrigger>
                <TabsTrigger value="benchmarks" className="data-[state=active]:bg-blue-900 data-[state=active]:text-blue-100">
                  Benchmarks
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="log" className="flex-1 p-4 overflow-hidden bg-gray-900">
                <ScrollArea className="h-full w-full rounded-md border border-blue-900">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className={`mb-2 text-sm ${
                        log.type === "error" 
                          ? "text-red-400" 
                          : log.type === "success" 
                          ? "text-green-400" 
                          : "text-blue-300"
                      }`}
                    >
                      <span className="text-blue-500">{log.timestamp}</span>
                      {" "}
                      {log.message}
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="plot" className="flex-1 p-4 bg-gray-900">
                <TrainingPlot />
              </TabsContent>
              
              <TabsContent value="benchmarks" className="flex-1 p-4 bg-gray-900">
                <BenchmarkTable />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <footer className="p-2 border-t border-blue-900 text-center text-sm text-blue-400 bg-gray-900">
        Model Status: {isModelLoaded ? "Ready" : "Loading..."}
      </footer>
    </div>
  )
}