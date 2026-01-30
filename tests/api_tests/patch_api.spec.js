//Load playwright module
import { test, expect } from '@playwright/test';
import bookingDynamicReq from '../../test-data/test-data-dynamic.json' assert { type: 'json' };
import putReq from '../../test-data/put-data.json' assert { type: 'json' };
import putReqBody from '../../test-data/put_req_body.json' assert { type: 'json' };
import patchReq from '../../test-data/patch_req.json' assert { type: 'json' };
import { stringFormat } from '../../utils/common.js';

//write tests
test('Create PATCH request', async ({ request }) => {
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

  //Token generation for PATCH request
  const tokenResponse = await request.post('/auth', {
    data: putReq,
  });

  const tokenData = await tokenResponse.json();
  const token = tokenData.token;
  console.log(`Generated Token: ${token}`);

  //PATCH request to update the created booking
  const patchRes = await request.patch(`/booking/${bookingID}`, {
    data: patchReq,
    headers: {
      'content-type': 'application/json',
      // Accept: 'application/json',
      Cookie: `token=${token}`,
    },
  });
  const patchData = await patchRes.json();
  console.log(patchData);
  expect(patchRes.ok).toBeTruthy();
  expect(patchRes.status()).toBe(200);
});
