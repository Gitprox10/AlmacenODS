'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type InventoryItem = {
  id: number;
  family: string;
  name: string;
  quantity: number;
}

export default function Component() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [families, setFamilies] = useState<string[]>(['Paneles solares', 'Inversores', 'Baterías'])
  const [newFamily, setNewFamily] = useState('')
  const [newItem, setNewItem] = useState({ family: '', name: '', quantity: 0 })
  const [selectedFamily, setSelectedFamily] = useState('')
  const [selectedItem, setSelectedItem] = useState('')
  const [quantityToChange, setQuantityToChange] = useState(0)

  const addNewFamily = (e: React.FormEvent) => {
    e.preventDefault()
    if (newFamily && !families.includes(newFamily)) {
      setFamilies([...families, newFamily])
      setNewFamily('')
    }
  }

  const addNewItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (newItem.family && newItem.name && newItem.quantity > 0) {
      setInventory([...inventory, { ...newItem, id: Date.now() }])
      setNewItem({ family: '', name: '', quantity: 0 })
    }
  }

  const updateInventory = (action: 'add' | 'remove') => {
    if (selectedFamily && selectedItem && quantityToChange > 0) {
      setInventory(inventory.map(item => 
        item.family === selectedFamily && item.name === selectedItem
          ? { 
              ...item, 
              quantity: action === 'add' 
                ? item.quantity + quantityToChange 
                : Math.max(0, item.quantity - quantityToChange)
            }
          : item
      ))
      setSelectedItem('')
      setQuantityToChange(0)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Inventario de Materiales Fotovoltaicos</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Agregar Nueva Familia</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addNewFamily} className="space-y-2">
              <Input
                type="text"
                placeholder="Nombre de la nueva familia"
                value={newFamily}
                onChange={(e) => setNewFamily(e.target.value)}
              />
              <Button type="submit" className="w-full">Agregar Familia</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agregar Nuevo Material</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addNewItem} className="space-y-2">
              <Select value={newItem.family} onValueChange={(value) => setNewItem({ ...newItem, family: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar familia" />
                </SelectTrigger>
                <SelectContent>
                  {families.map((family) => (
                    <SelectItem key={family} value={family}>{family}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="text"
                placeholder="Nombre del material"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Cantidad inicial"
                value={newItem.quantity || ''}
                onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
              />
              <Button type="submit" className="w-full">Agregar al Inventario</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actualizar Inventario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Select value={selectedFamily} onValueChange={setSelectedFamily}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar familia" />
                </SelectTrigger>
                <SelectContent>
                  {families.map((family) => (
                    <SelectItem key={family} value={family}>{family}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedItem} onValueChange={setSelectedItem}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar material" />
                </SelectTrigger>
                <SelectContent>
                  {inventory
                    .filter(item => item.family === selectedFamily)
                    .map((item) => (
                      <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Cantidad"
                value={quantityToChange || ''}
                onChange={(e) => setQuantityToChange(parseInt(e.target.value) || 0)}
              />
              <div className="flex gap-2">
                <Button onClick={() => updateInventory('add')} className="flex-1">Agregar al Stock</Button>
                <Button onClick={() => updateInventory('remove')} className="flex-1">Sacar del Stock</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Inventario Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Familia</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Cantidad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.family}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}