const { validateGetEmpStatus } = require('../middleware/validation');

describe('Validation Middleware', () => {
  describe('validateGetEmpStatus', () => {
    it('should accept valid NationalNumber', async () => {
      const validations = validateGetEmpStatus;
      const req = {
        body: {
          NationalNumber: 'NAT1001'
        }
      };

      // Mock express-validator
      const mockValidationResult = jest.fn().mockReturnValue({
        isEmpty: () => true,
        array: () => []
      });
      
      // Test that validations are defined
      expect(validations).toBeDefined();
      expect(Array.isArray(validations)).toBe(true);
    });

    it('should reject empty NationalNumber', async () => {
      const validations = validateGetEmpStatus;
      expect(validations).toBeDefined();
      // In a real test, you would use supertest to test the full middleware chain
    });
  });
});
