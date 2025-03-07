"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserFormProps {
  onSubmit: (data: { name: string; age: number; education: string }) => void
}

export default function UserForm({ onSubmit }: UserFormProps) {
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [education, setEducation] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, age: Number.parseInt(age), education })
  }

  return (
    <Card className="w-full p-6 shadow-xl bg-white">
      <h1 className="text-3xl font-bold text-[#1E3A8A] mb-6 text-center">Cognitive Games</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="education">Education Level</Label>
          <Select onValueChange={setEducation} required>
            <SelectTrigger>
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high_school">High School</SelectItem>
              <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
              <SelectItem value="masters">Master's Degree</SelectItem>
              <SelectItem value="phd">Ph.D.</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full bg-[#6D28D9] hover:bg-[#5B21B6]">
          Start Games
        </Button>
      </form>
    </Card>
  )
}

