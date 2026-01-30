//Load playwright module
import { test, expect } from '@playwright/test';
import bookingDynamicReq from '../../test-data/test-data-dynamic.json' assert { type: 'json' };
import { stringFormat } from '../../utils/common.js';
import { get } from 'node:http';

//write tests
test('Create GET request', async ({ request }) => {
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
  const bookingID = data.bookingid;
  //console.log(data);

  //Validate status code
  expect(response.ok).toBeTruthy();
  expect(response.status()).toBe(200);

  //Validate JSON API response
  expect(data.booking.firstname).toBe('tester');
  expect(data.booking).toHaveProperty('firstname', 'tester');
  expect(data.booking.lastname).toBe('sharma');

  //GET request to fetch the created booking
  const getResponse = await request.get(`/booking/${bookingID}`);
  console.log(await getResponse.json());

  expect(getResponse.ok).toBeTruthy();
  expect(getResponse.status()).toBe(200);
});
