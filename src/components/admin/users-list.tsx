"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Search, UserCog, Lock } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

// Sample user data for the demo
// In a real app, this would come from a database
const usersData = [
  {
    id: "user1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    status: "active",
    createdAt: "2023-08-15",
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "editor",
    status: "active",
    createdAt: "2023-09-20",
  },
  {
    id: "user3",
    name: "Robert Johnson",
    email: "robert@example.com",
    role: "viewer",
    status: "active",
    createdAt: "2023-10-05",
  },
  {
    id: "user4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    role: "editor",
    status: "inactive",
    createdAt: "2023-06-12",
  },
  {
    id: "user5",
    name: "Michael Brown",
    email: "michael@example.com",
    role: "viewer",
    status: "active",
    createdAt: "2023-11-01",
  },
]

// In a real app, these would be server actions
async function deleteUser(userId: string) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  console.log(`Deleting user with ID: ${userId}`)
  return { success: true }
}

export function UsersList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const { toast } = useToast()

  // Filter users based on search term
  const filteredUsers = usersData.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (userId: string) => {
    try {
      // Call the function to delete the user
      await deleteUser(userId)
      
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted.",
      })
      
      setDeleteUserId(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the user. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Get role badge styling
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-100 text-red-700">Admin</Badge>
      case "editor":
        return <Badge className="bg-blue-100 text-blue-700">Editor</Badge>
      case "viewer":
        return <Badge className="bg-green-100 text-green-700">Viewer</Badge>
      default:
        return <Badge className="bg-slate-100 text-slate-700">{role}</Badge>
    }
  }

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
      case "inactive":
        return <Badge className="bg-amber-100 text-amber-700">Inactive</Badge>
      default:
        return <Badge className="bg-slate-100 text-slate-700">{status}</Badge>
    }
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  No users found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <UserCog className="h-4 w-4" />
                        <span className="sr-only">Edit Role</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Lock className="h-4 w-4" />
                        <span className="sr-only">Reset Password</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteUserId(user.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUserId && handleDelete(deleteUserId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 