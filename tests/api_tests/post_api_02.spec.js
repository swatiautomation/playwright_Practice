//Load playwright module
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { DateTime } from 'luxon';

//write tests
test('Create POST request using dynamic request body', async ({ request }) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const totalPrice = faker.number.int({ min: 1, max: 1000 });

  const checkinDate = DateTime.now().toFormat('yyyy-MM-dd');
  const checkoutDate = DateTime.now().plus({ days: 1 }).toFormat('yyyy-MM-dd');

  //Create POST request
  const response = await request.post('/booking', {
    data: {
      firstname: firstName,
      lastname: lastName,
      totalprice: totalPrice,
      depositpaid: true,
      bookingdates: {
        checkin: checkinDate,
        checkout: checkoutDate,
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
  expect(data.booking.firstname).toBe(firstName);
  expect(data.booking).toHaveProperty('firstname', firstName);
  expect(data.booking.lastname).toBe(lastName);

  //Validate nested JSON API response using destructuring
  const { checkin, checkout } = data.booking.bookingdates;
  expect(checkin).toBe(checkinDate);
  expect(checkout).toBe(checkoutDate);
});
