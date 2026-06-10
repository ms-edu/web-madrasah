/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { appPromise } from '../server.ts';

export default async function handler(req, res) {
  const app = await appPromise;
  return app(req, res);
}
