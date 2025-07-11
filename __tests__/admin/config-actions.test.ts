import { 
  getPartners, 
  createPartner, 
  updatePartner, 
  deletePartner,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getFeatures,
  createFeature,
  updateFeature,
  deleteFeature,
  authenticateAdmin,
  isAuthenticated
} from '@/app/actions/config'

// Mock Prisma client
const mockPrisma = {
  partner: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
  },
  testimonial: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
  },
  feature: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
  },
}

jest.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}))

// Mock Next.js cookies
const mockCookies = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
}

jest.mock('next/headers', () => ({
  cookies: () => mockCookies,
}))

// Mock Next.js redirect
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

describe('Admin Config Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Partner Actions', () => {
    it('should get all partners successfully', async () => {
      // Arrange
      const mockPartners = [
        { id: '1', name: 'Partner 1', logo: 'logo1.png', url: 'https://partner1.com' },
        { id: '2', name: 'Partner 2', logo: 'logo2.png', url: 'https://partner2.com' }
      ]
      mockPrisma.partner.findMany.mockResolvedValue(mockPartners)

      // Act
      const result = await getPartners()

      // Assert
      expect(result).toEqual(mockPartners)
      expect(mockPrisma.partner.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' }
      })
    })

    it('should create a new partner successfully', async () => {
      // Arrange
      const newPartner = { name: 'New Partner', logo: 'new-logo.png', url: 'https://new.com' }
      const createdPartner = { id: '3', ...newPartner, createdAt: new Date(), updatedAt: new Date() }
      mockPrisma.partner.create.mockResolvedValue(createdPartner)

      // Act
      const result = await createPartner(newPartner)

      // Assert
      expect(result).toEqual(createdPartner)
      expect(mockPrisma.partner.create).toHaveBeenCalledWith({ data: newPartner })
    })

    it('should update an existing partner successfully', async () => {
      // Arrange
      const partnerId = '1'
      const updateData = { name: 'Updated Partner', logo: 'updated-logo.png', url: 'https://updated.com' }
      const existingPartner = { id: partnerId, name: 'Old Partner', logo: 'old-logo.png', url: 'https://old.com' }
      const updatedPartner = { ...existingPartner, ...updateData }

      mockPrisma.partner.findUnique.mockResolvedValue(existingPartner)
      mockPrisma.partner.update.mockResolvedValue(updatedPartner)

      // Act
      const result = await updatePartner(partnerId, updateData)

      // Assert
      expect(result).toEqual(updatedPartner)
      expect(mockPrisma.partner.findUnique).toHaveBeenCalledWith({ where: { id: partnerId } })
      expect(mockPrisma.partner.update).toHaveBeenCalledWith({
        where: { id: partnerId },
        data: updateData
      })
    })

    it('should delete a partner successfully', async () => {
      // Arrange
      const partnerId = '1'
      const existingPartner = { id: partnerId, name: 'Partner to Delete', logo: 'logo.png', url: 'https://delete.com' }
      
      mockPrisma.partner.findUnique.mockResolvedValue(existingPartner)
      mockPrisma.partner.delete.mockResolvedValue(existingPartner)

      // Act
      const result = await deletePartner(partnerId)

      // Assert
      expect(result).toEqual(existingPartner)
      expect(mockPrisma.partner.findUnique).toHaveBeenCalledWith({ where: { id: partnerId } })
      expect(mockPrisma.partner.delete).toHaveBeenCalledWith({ where: { id: partnerId } })
    })

    it('should throw error when trying to update non-existent partner', async () => {
      // Arrange
      const partnerId = 'non-existent'
      const updateData = { name: 'Updated Partner' }
      
      mockPrisma.partner.findUnique.mockResolvedValue(null)

      // Act & Assert
      await expect(updatePartner(partnerId, updateData)).rejects.toThrow('Хамтрагч олдсонгүй')
    })

    it('should handle database errors gracefully', async () => {
      // Arrange
      mockPrisma.partner.findMany.mockRejectedValue(new Error('Database connection failed'))

      // Act & Assert
      await expect(getPartners()).rejects.toThrow('Өгөгдлийн санд холбогдож чадсангүй')
    })
  })

  describe('Testimonial Actions', () => {
    it('should get all testimonials successfully', async () => {
      // Arrange
      const mockTestimonials = [
        { id: '1', name: 'User 1', role: 'Student', content: 'Great!', rating: 5, image: 'user1.jpg' }
      ]
      mockPrisma.testimonial.findMany.mockResolvedValue(mockTestimonials)

      // Act
      const result = await getTestimonials()

      // Assert
      expect(result).toEqual(mockTestimonials)
      expect(mockPrisma.testimonial.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' }
      })
    })

    it('should create a new testimonial with validation', async () => {
      // Arrange
      const newTestimonial = { 
        name: 'New User', 
        role: 'Student', 
        content: 'Excellent course!', 
        rating: 5, 
        image: 'newuser.jpg' 
      }
      const createdTestimonial = { id: '2', ...newTestimonial, createdAt: new Date(), updatedAt: new Date() }
      mockPrisma.testimonial.create.mockResolvedValue(createdTestimonial)

      // Act
      const result = await createTestimonial(newTestimonial)

      // Assert
      expect(result).toEqual(createdTestimonial)
      expect(mockPrisma.testimonial.create).toHaveBeenCalledWith({ data: newTestimonial })
    })

    it('should validate rating range when creating testimonial', async () => {
      // Arrange
      const invalidTestimonial = { 
        name: 'User', 
        role: 'Student', 
        content: 'Review', 
        rating: 6, 
        image: 'user.jpg' 
      }

      // Act & Assert
      await expect(createTestimonial(invalidTestimonial)).rejects.toThrow('Үнэлгээ 1-5 хооронд байх ёстой')
    })

    it('should validate required fields when creating testimonial', async () => {
      // Arrange
      const incompleteTestimonial = { 
        name: 'User', 
        // Missing content and rating
        role: 'Student', 
        image: 'user.jpg' 
      }

      // Act & Assert
      await expect(createTestimonial(incompleteTestimonial)).rejects.toThrow('Нэр, сэтгэгдэл болон үнэлгээ заавал шаардлагатай')
    })
  })

  describe('Feature Actions', () => {
    it('should get all features ordered by order field', async () => {
      // Arrange
      const mockFeatures = [
        { id: '1', title: 'Feature 1', description: 'Description 1', icon: '🚀', order: 1 },
        { id: '2', title: 'Feature 2', description: 'Description 2', icon: '⭐', order: 2 }
      ]
      mockPrisma.feature.findMany.mockResolvedValue(mockFeatures)

      // Act
      const result = await getFeatures()

      // Assert
      expect(result).toEqual(mockFeatures)
      expect(mockPrisma.feature.findMany).toHaveBeenCalledWith({
        orderBy: { order: 'asc' }
      })
    })

    it('should create a new feature with validation', async () => {
      // Arrange
      const newFeature = { 
        title: 'New Feature', 
        description: 'New description', 
        icon: '🎯',
        order: 3
      }
      const createdFeature = { id: '3', ...newFeature, createdAt: new Date(), updatedAt: new Date() }
      mockPrisma.feature.create.mockResolvedValue(createdFeature)

      // Act
      const result = await createFeature(newFeature)

      // Assert
      expect(result).toEqual(createdFeature)
      expect(mockPrisma.feature.create).toHaveBeenCalledWith({ data: newFeature })
    })

    it('should validate required fields when creating feature', async () => {
      // Arrange
      const incompleteFeature = { 
        title: 'Feature',
        // Missing description and icon
        order: 1
      }

      // Act & Assert
      await expect(createFeature(incompleteFeature)).rejects.toThrow('Гарчиг, тайлбар болон icon заавал шаардлагатай')
    })
  })

  describe('Authentication', () => {
    it('should authenticate admin with correct credentials', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('username', 'admin')
      formData.append('password', 'admin123')

      // Act & Assert - Should not throw error and should call redirect
      await expect(authenticateAdmin(formData)).resolves.not.toThrow()
      expect(mockCookies.set).toHaveBeenCalledWith('admin-auth', 'authenticated', {
        httpOnly: true,
        secure: false, // NODE_ENV is not production in tests
        maxAge: 60 * 60 * 24
      })
    })

    it('should reject invalid credentials', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('username', 'wrong')
      formData.append('password', 'wrong')

      // Act & Assert
      await expect(authenticateAdmin(formData)).rejects.toThrow('Буруу нэвтрэх мэдээлэл')
    })

    it('should check authentication status correctly', async () => {
      // Arrange - Mock authenticated state
      mockCookies.get.mockReturnValue({ value: 'authenticated' })

      // Act
      const result = await isAuthenticated()

      // Assert
      expect(result).toBe(true)
      expect(mockCookies.get).toHaveBeenCalledWith('admin-auth')
    })

    it('should return false for unauthenticated state', async () => {
      // Arrange - Mock unauthenticated state
      mockCookies.get.mockReturnValue(undefined)

      // Act
      const result = await isAuthenticated()

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('Error Handling', () => {
    it('should handle Prisma P2002 (unique constraint) error', async () => {
      // Arrange
      const prismaError = {
        code: 'P2002',
        message: 'Unique constraint failed'
      }
      mockPrisma.partner.create.mockRejectedValue(prismaError)

      const partnerData = { name: 'Duplicate', logo: 'logo.png', url: 'https://dup.com' }

      // Act & Assert
      await expect(createPartner(partnerData)).rejects.toThrow('Давхардсан утга оруулж болохгүй')
    })

    it('should handle Prisma P2025 (not found) error', async () => {
      // Arrange
      const prismaError = {
        code: 'P2025',
        message: 'Record not found'
      }
      mockPrisma.partner.update.mockRejectedValue(prismaError)

      // Act & Assert
      await expect(updatePartner('non-existent', { name: 'Update' })).rejects.toThrow('Өгөгдөл олдсонгүй')
    })

    it('should handle generic database errors', async () => {
      // Arrange
      const genericError = new Error('Generic database error')
      mockPrisma.partner.findMany.mockRejectedValue(genericError)

      // Act & Assert
      await expect(getPartners()).rejects.toThrow('Систем алдаа: Generic database error')
    })
  })
})