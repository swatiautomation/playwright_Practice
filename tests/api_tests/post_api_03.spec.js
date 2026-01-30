//Load playwright module
import { test, expect } from '@playwright/test';
import bookingDynamicReq from '../../test-data/test-data-dynamic.json' assert { type: 'json' };
import { stringFormat } from '../../utils/common.js';

//write tests
test('Create POST request using dynamic request body', async ({ request }) => {
  const formattedRequestBody = stringFormat(
    JSON.stringify(bookingDynamicReq),
    'tester',
    'sharma',
    'super bowls',
  );

  //Create POST request
  const response = await request.post('/booking', {
    data: JSON.parse(formattedRequestBody),
  });

  const data = await response.json();
  console.log(data);

  //Validate status code
  expect(response.ok).toBeTruthy();
  expect(response.status()).toBe(200);

  //Validate JSON API response
  expect(data.booking.firstname).toBe('tester');
  expect(data.booking).toHaveProperty('firstname', 'tester');
  expect(data.booking.lastname).toBe('sharma');
});
