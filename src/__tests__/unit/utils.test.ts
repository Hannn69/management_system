// src/__tests__/unit/utils.test.ts
// Example unit test for utility functions

describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('should format a date correctly', () => {
      // Example: replace with actual utility function
      const formatDate = (date: Date) => date.toISOString().split('T')[0]
      
      const result = formatDate(new Date('2026-06-03'))
      expect(result).toBe('2026-06-03')
    })
  })

  describe('classNames', () => {
    it('should combine class names', () => {
      // Example with clsx which is already in your dependencies
      const clsx = (...args: any[]) => args.filter(Boolean).join(' ')
      
      const result = clsx('btn', true && 'btn-primary', false && 'btn-large')
      expect(result).toBe('btn btn-primary')
    })
  })
})
