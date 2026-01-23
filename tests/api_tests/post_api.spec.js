//Load playwright module
import { test, expect } from '@playwright/test';

//write tests
test('Create POST request using static request body', async ({ request }) => {
  //Create POST request
  const response = await request.post('/booking', {
    data: {
      firstname: 'Swati',
      lastname: 'Kumar',
      totalprice: 1000,
      depositpaid: true,
      bookingdates: {
        checkin: '2018-01-01',
        checkout: '2019-01-01',
      },
      additionalneeds: 'super bowls',
    },
  });

  const data = await response.json();
  console.log(data);

  //Validate status code
  expect(response.ok).toBeTruthy();
  expect(response.status()).toBe(200);

  //Validate JSON API response
  expect(data.booking.firstname).toBe('Swati');
  expect(data.booking).toHaveProperty('firstname', 'Swati');
  expect(data.booking.lastname).toBe('Kumar');

  //Validate nested JSON API response using destructuring
  const { checkin, checkout } = data.booking.bookingdates;
  expect(checkin).toBe('2018-01-01');
  expect(checkout).toBe('2019-01-01');
});
