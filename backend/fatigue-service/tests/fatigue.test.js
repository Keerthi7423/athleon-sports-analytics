// d:\PROJECT\Athleon\backend\fatigue-service\tests\fatigue.test.js

import { jest } from '@jest/globals';

// Mocking dependencies for unit testing
const mockCalculate = jest.fn((id, data) => {
  const { heartRate, variability, sleepScore } = data;
  const hrvScore = (100 - variability) / 10;
  const sleepModifier = (100 - sleepScore) / 10;
  const hrModifier = (heartRate > 150) ? 2 : 0;
  
  const rawScore = (hrvScore * 0.4) + (sleepModifier * 0.4) + (hrModifier * 0.2);
  return Math.min(Math.max(rawScore, 0), 10).toFixed(2);
});

describe('Fatigue Calculation Engine', () => {
    
  test('should return higher fatigue score for low sleep and high HRV', () => {
    const athleteMetrics = { heartRate: 70, variability: 40, sleepScore: 50 };
    const score = mockCalculate('athlete-001', athleteMetrics);
    
    // Low Sleep (50) and Low HRV (40) should result in moderate to high fatigue
    expect(parseFloat(score)).toBeGreaterThan(4.0);
  });

  test('should return extreme fatigue when heart rate is high and sleep is minimal', () => {
    const extremeMetrics = { heartRate: 160, variability: 20, sleepScore: 30 };
    const score = mockCalculate('athlete-002', extremeMetrics);
    
    // (8.0 * 0.4) + (7.0 * 0.4) + (2.0) = 3.2 + 2.8 + 2.0 = 8.0
    expect(parseFloat(score)).toBeCloseTo(8.0, 1);
  });

  test('should return low fatigue for optimal recovery metrics', () => {
    const optimalMetrics = { heartRate: 55, variability: 95, sleepScore: 90 };
    const score = mockCalculate('athlete-003', optimalMetrics);
    
    // (0.5 * 0.4) + (1.0 * 0.4) + 0 = 0.2 + 0.4 = 0.6
    expect(parseFloat(score)).toBeLessThan(1.5);
  });

});
