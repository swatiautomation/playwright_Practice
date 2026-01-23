//Load playwright module
import { test, expect } from '@playwright/test';
const bookingDynamicReq = require('../test-data/test-data-dynamic.json');
const putReq = require('../test-data/put-data.json');
const putReqBody = require('../test-data/put_req_body.json');
import { stringFormat } from '../utils/common.js';
import { get } from 'node:http';

//write tests
test('Create PUT request', async ({ request }) => {
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
  // console.log(await getResponse.json());

  expect(getResponse.ok).toBeTruthy();
  expect(getResponse.status()).toBe(200);

  //Token generation for PUT request
  const putResponse = await request.post('/auth', {
    data: putReq,
  });

  const tokenData = await putResponse.json();
  const token = tokenData.token;
  console.log(`Generated Token: ${token}`);

  //PUT request to update the created booking
  const putRes = await request.put(`/booking/${bookingID}`, {
    data: putReqBody,
    headers: {
      'content-type': 'application/json',
      // Accept: 'application/json',
      Cookie: `token=${token}`,
    },
  });
  const putData = await putRes.json();
  console.log(putData);

  expect(putRes.ok).toBeTruthy();
  expect(putRes.status()).toBe(200);
});
