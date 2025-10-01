'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { FileText, Filter, RefreshCw, ChevronLeft, ChevronRight, Eye } from 'lucide-react'

interface AuditLog {
  id: string
  action: string
  entityType: string
  entityId: string | null
  entityTitle: string | null
  changes: any
  ipAddress: string
  userAgent: string
  device: string | null
  browser: string | null
  os: string | null
  createdAt: string
  admin: {
    id: string
    username: string
    email: string
    role: string
  }
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [limit] = useState(50)
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [timezone, setTimezone] = useState('')
  
  // Filters
  const [actionFilter, setActionFilter] = useState('all')
  const [entityTypeFilter, setEntityTypeFilter] = useState('all')
  const [adminFilter, setAdminFilter] = useState('all')

  // Get user's timezone on mount
  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

  useEffect(() => {
    fetchLogs()
  }, [page, actionFilter, entityTypeFilter, adminFilter])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: (page * limit).toString(),
      })

      if (actionFilter && actionFilter !== 'all') params.append('action', actionFilter)
      if (entityTypeFilter && entityTypeFilter !== 'all') params.append('entityType', entityTypeFilter)
      if (adminFilter && adminFilter !== 'all') params.append('adminId', adminFilter)

      const response = await fetch(`/api/audit-logs?${params}`)
      if (!response.ok) throw new Error('Failed to fetch audit logs')

      const data = await response.json()
      setLogs(data.logs)
      setTotal(data.total)
    } catch (error) {
      console.error('Error fetching audit logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActionBadge = (action: string) => {
    const colors = {
      CREATE: 'bg-green-100 text-green-800',
      UPDATE: 'bg-blue-100 text-blue-800',
      DELETE: 'bg-red-100 text-red-800',
      LOGIN: 'bg-purple-100 text-purple-800',
      LOGOUT: 'bg-gray-100 text-gray-800',
    }
    return colors[action as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Audit Logs | 审计日志
              </CardTitle>
              <CardDescription>
                View all administrative actions and changes | 查看所有管理操作和更改
                {timezone && (
                  <span className="ml-2 text-xs text-gray-500">
                    • Timezone: {timezone}
                  </span>
                )}
              </CardDescription>
            </div>
            <Button onClick={fetchLogs} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh | 刷新
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4" />
              <h3 className="font-semibold">Filters | 筛选</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="action-filter">Action | 操作</Label>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger id="action-filter">
                    <SelectValue placeholder="All Actions | 所有操作" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions | 所有操作</SelectItem>
                    <SelectItem value="CREATE">Create | 创建</SelectItem>
                    <SelectItem value="UPDATE">Update | 更新</SelectItem>
                    <SelectItem value="DELETE">Delete | 删除</SelectItem>
                    <SelectItem value="LOGIN">Login | 登录</SelectItem>
                    <SelectItem value="LOGOUT">Logout | 退出</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="entity-filter">Entity Type | 实体类型</Label>
                <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
                  <SelectTrigger id="entity-filter">
                    <SelectValue placeholder="All Types | 所有类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types | 所有类型</SelectItem>
                    <SelectItem value="Course">Course | 课程</SelectItem>
                    <SelectItem value="Testimonial">Testimonial | 评价</SelectItem>
                    <SelectItem value="Partner">Partner | 合作伙伴</SelectItem>
                    <SelectItem value="FAQ">FAQ | 常见问题</SelectItem>
                    <SelectItem value="Feature">Feature | 功能</SelectItem>
                    <SelectItem value="SiteConfig">Site Config | 站点配置</SelectItem>
                    <SelectItem value="Admin">Admin | 管理员</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setActionFilter('all')
                    setEntityTypeFilter('all')
                    setAdminFilter('all')
                    setPage(0)
                  }}
                >
                  Clear Filters | 清除筛选
                </Button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading audit logs... | 加载审计日志中...</p>
              </div>
            </div>
          )}

          {/* Table */}
          {!loading && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time | 时间</TableHead>
                    <TableHead>Admin | 管理员</TableHead>
                    <TableHead>Action | 操作</TableHead>
                    <TableHead>Entity | 实体</TableHead>
                    <TableHead>IP / Device | IP / 设备</TableHead>
                    <TableHead>Details | 详情</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">
                        {formatDateTime(log.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{log.admin.username}</span>
                          <Badge variant="secondary" className="text-xs w-fit mt-1">
                            {log.admin.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getActionBadge(log.action)}>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{log.entityType}</span>
                          {log.entityTitle && (
                            <span className="text-xs text-gray-500 truncate max-w-[200px]">
                              {log.entityTitle}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex flex-col gap-1">
                          <span>{log.ipAddress}</span>
                          <div className="text-xs text-gray-500 flex gap-2">
                            {log.device && <span>{log.device}</span>}
                            {log.browser && <span>• {log.browser}</span>}
                            {log.os && <span>• {log.os}</span>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedLog(log)
                            setIsDetailDialogOpen(true)
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View | 查看
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {logs.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No audit logs found | 未找到审计日志
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    Showing {page * limit + 1} to {Math.min((page + 1) * limit, total)} of {total} logs
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.max(0, page - 1))}
                      disabled={page === 0}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous | 上一页
                    </Button>
                    <div className="flex items-center px-4 text-sm">
                      Page {page + 1} of {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                      disabled={page >= totalPages - 1}
                    >
                      Next | 下一页
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Audit Log Details | 审计日志详情</DialogTitle>
            <DialogDescription>
              Detailed information about this action | 此操作的详细信息
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-600 mb-1">Time | 时间</h4>
                  <p>{formatDateTime(selectedLog.createdAt)}</p>
                  <p className="text-xs text-gray-500 mt-1">{timezone}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600 mb-1">Admin | 管理员</h4>
                  <p>{selectedLog.admin.username} ({selectedLog.admin.email})</p>
                  <Badge variant="secondary" className="mt-1">
                    {selectedLog.admin.role}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600 mb-1">Action | 操作</h4>
                  <Badge className={getActionBadge(selectedLog.action)}>
                    {selectedLog.action}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600 mb-1">Entity | 实体</h4>
                  <p>{selectedLog.entityType}</p>
                  {selectedLog.entityTitle && (
                    <p className="text-sm text-gray-500 mt-1">{selectedLog.entityTitle}</p>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-sm text-gray-600 mb-2">Location & Device | 位置和设备</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">IP Address:</span> {selectedLog.ipAddress}
                  </div>
                  {selectedLog.device && (
                    <div>
                      <span className="text-gray-600">Device:</span> {selectedLog.device}
                    </div>
                  )}
                  {selectedLog.browser && (
                    <div>
                      <span className="text-gray-600">Browser:</span> {selectedLog.browser}
                    </div>
                  )}
                  {selectedLog.os && (
                    <div>
                      <span className="text-gray-600">OS:</span> {selectedLog.os}
                    </div>
                  )}
                </div>
              </div>

              {selectedLog.changes && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm text-gray-600 mb-2">Changes | 更改</h4>
                  <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-auto max-h-[300px]">
                    {JSON.stringify(selectedLog.changes, null, 2)}
                  </pre>
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="font-semibold text-sm text-gray-600 mb-2">User Agent | 用户代理</h4>
                <p className="text-xs text-gray-600 break-all">{selectedLog.userAgent}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

