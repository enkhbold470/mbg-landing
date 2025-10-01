'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Users, UserPlus, Edit, Trash2, Shield, User } from 'lucide-react'

interface Admin {
  id: string
  username: string
  email: string
  role: 'SUPER_ADMIN' | 'ADMIN'
  isActive: boolean
  lastLoginAt: string | null
  lastLoginIp: string | null
  lastLoginDevice: string | null
  createdAt: string
  _count?: {
    auditLogs: number
  }
}

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/admins')
      if (!response.ok) {
        if (response.status === 403) {
          toast({
            title: "Access Denied | 访问被拒绝",
            description: "Only super admins can manage users | 只有超级管理员可以管理用户",
            variant: "destructive"
          })
          return
        }
        throw new Error('Failed to fetch admins')
      }
      const data = await response.json()
      setAdmins(data.admins)
    } catch (error) {
      console.error('Error fetching admins:', error)
      toast({
        title: "Error | 错误",
        description: "Failed to load admin users | 加载管理员失败",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    
    try {
      const response = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.get('username'),
          email: formData.get('email'),
          password: formData.get('password'),
          role: formData.get('role'),
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create admin')
      }

      toast({
        title: "Success | 成功",
        description: "Admin user created successfully | 管理员创建成功",
      })

      setIsCreateDialogOpen(false)
      fetchAdmins()
    } catch (error: any) {
      toast({
        title: "Error | 错误",
        description: error.message || "Failed to create admin | 创建管理员失败",
        variant: "destructive"
      })
    }
  }

  const handleUpdateAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedAdmin) return
    
    const formData = new FormData(event.currentTarget)
    const password = formData.get('password') as string
    
    try {
      const body: any = {
        id: selectedAdmin.id,
        username: formData.get('username'),
        email: formData.get('email'),
        role: formData.get('role'),
        isActive: formData.get('isActive') === 'true'
      }
      
      if (password && password.trim()) {
        body.password = password
      }

      const response = await fetch('/api/admins', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update admin')
      }

      toast({
        title: "Success | 成功",
        description: "Admin user updated successfully | 管理员更新成功",
      })

      setIsEditDialogOpen(false)
      setSelectedAdmin(null)
      fetchAdmins()
    } catch (error: any) {
      toast({
        title: "Error | 错误",
        description: error.message || "Failed to update admin | 更新管理员失败",
        variant: "destructive"
      })
    }
  }

  const handleDeleteAdmin = async (admin: Admin) => {
    if (!confirm(`Are you sure you want to delete admin "${admin.username}"? This action cannot be undone.\n确定要删除管理员"${admin.username}"吗？此操作无法撤销。`)) {
      return
    }

    try {
      const response = await fetch(`/api/admins?id=${admin.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete admin')
      }

      toast({
        title: "Success | 成功",
        description: "Admin user deleted successfully | 管理员删除成功",
      })

      fetchAdmins()
    } catch (error: any) {
      toast({
        title: "Error | 错误",
        description: error.message || "Failed to delete admin | 删除管理员失败",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin users... | 加载管理员中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6" />
                Admin User Management | 管理员用户管理
              </CardTitle>
              <CardDescription>
                Create and manage admin users and their roles | 创建和管理管理员用户及其角色
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Create Admin | 创建管理员
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username | 用户名</TableHead>
                <TableHead>Email | 邮箱</TableHead>
                <TableHead>Role | 角色</TableHead>
                <TableHead>Status | 状态</TableHead>
                <TableHead>Last Login | 最后登录</TableHead>
                <TableHead>Actions | 操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.username}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <Badge variant={admin.role === 'SUPER_ADMIN' ? 'default' : 'secondary'}>
                      {admin.role === 'SUPER_ADMIN' ? (
                        <><Shield className="w-3 h-3 mr-1 inline" />Super Admin</>
                      ) : (
                        <><User className="w-3 h-3 mr-1 inline" />Admin</>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={admin.isActive ? 'default' : 'destructive'}>
                      {admin.isActive ? 'Active | 激活' : 'Inactive | 未激活'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {admin.lastLoginAt ? (
                      <div className="text-sm">
                        <div>{new Date(admin.lastLoginAt).toLocaleString()}</div>
                        <div className="text-xs text-gray-500">
                          {admin.lastLoginIp && `IP: ${admin.lastLoginIp}`}
                          {admin.lastLoginDevice && ` (${admin.lastLoginDevice})`}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Never | 从未</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedAdmin(admin)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteAdmin(admin)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {admins.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No admin users found | 未找到管理员用户
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Admin Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Admin User | 创建管理员用户</DialogTitle>
            <DialogDescription>
              Add a new admin user to the system | 向系统添加新的管理员用户
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateAdmin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="create-username">Username | 用户名</Label>
                <Input id="create-username" name="username" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-email">Email | 邮箱</Label>
                <Input id="create-email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-password">Password | 密码</Label>
                <Input id="create-password" name="password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-role">Role | 角色</Label>
                <Select name="role" defaultValue="ADMIN">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin | 管理员</SelectItem>
                    <SelectItem value="SUPER_ADMIN">Super Admin | 超级管理员</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel | 取消
              </Button>
              <Button type="submit">Create | 创建</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Admin Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Admin User | 编辑管理员用户</DialogTitle>
            <DialogDescription>
              Update admin user information | 更新管理员用户信息
            </DialogDescription>
          </DialogHeader>
          {selectedAdmin && (
            <form onSubmit={handleUpdateAdmin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-username">Username | 用户名</Label>
                  <Input
                    id="edit-username"
                    name="username"
                    defaultValue={selectedAdmin.username}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email | 邮箱</Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    defaultValue={selectedAdmin.email}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-password">New Password (leave blank to keep current) | 新密码（留空保持不变）</Label>
                  <Input
                    id="edit-password"
                    name="password"
                    type="password"
                    placeholder="Leave blank to keep current password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role | 角色</Label>
                  <Select name="role" defaultValue={selectedAdmin.role}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin | 管理员</SelectItem>
                      <SelectItem value="SUPER_ADMIN">Super Admin | 超级管理员</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status | 状态</Label>
                  <Select name="isActive" defaultValue={selectedAdmin.isActive.toString()}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active | 激活</SelectItem>
                      <SelectItem value="false">Inactive | 未激活</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel | 取消
                </Button>
                <Button type="submit">Save Changes | 保存更改</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

