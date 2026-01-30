//Load playwright module
import { test, expect } from '@playwright/test';
import bookingReq from '../../test-data/test-data.json' assert { type: 'json' };

//write tests
test('Create POST request using static JSON file', async ({ request }) => {
  //Create POST request
  const response = await request.post('/booking', {
    data: bookingReq,
  });

  const data = await response.json();
  console.log(data);

  //Validate status code
  expect(response.ok).toBeTruthy();
  expect(response.status()).toBe(200);

  //Validate JSON API response
  expect(data.booking.firstname).toBe('test');
  expect(data.booking).toHaveProperty('firstname', 'test');
  expect(data.booking.lastname).toBe('qa');

  //Validate nested JSON API response using destructuring
  const { checkin, checkout } = data.booking.bookingdates;
  expect(checkin).toBe('2018-01-01');
  expect(checkout).toBe('2019-01-01');
});
