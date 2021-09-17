# stormwall-bypass

A library to help bypass stormwall protected websites.

## Install

```bash
npm install stormwall-bypass
```

## Quick Example

```js
const axios = require('axios');
const { CookieJar } = require('tough-cookie');
const { isProtectedByStormwall, getStormwallCookie } = require('stormwall-bypass');

(async () => {
  try {
    const url = 'https://stormwall-protected-url.com';
    let response = await axios.get(url);

    if (isProtectedByStormwall(response.data)) {
      const jar = new CookieJar();
      const cookie = getStormwallCookie(response.data);
      jar.setCookieSync(cookie, url);

      response = await axios.get(url, {
        headers: {
          Cookie: jar.getCookieStringSync(url)
        }
      });
    }
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
})();
```

> **NOTE:** Keep your stormwall cookie to reuse it otherwise you'll get blocked by stormwall.

# API

### isProtectedByStormwall

```js
const { isProtectedByStormwall } = require('stormwall-bypass');

const url = 'https://stormwall-protected-url.com';
const { data: body } = await axios.get(url);

const isProtected = isProtectedByStormwall(body);
console.log(isProtected);
// true
```

### getStormwallCookie

```js
const { getStormwallCookie } = require('stormwall-bypass');

const url = 'https://stormwall-protected-url.com';
const { data: body } = await axios.get(url);

const cookie = getStormwallCookie(body);
console.log(cookie);
// swp_token=1591688909:432fcabef0817198c94d8f20864bb8f6:15af8b664352d0407f587b2c3e7b5432;path=/;max-age=1800
````
