const STORMWALL_DETECTION_REGEXP = /https:\/\/static\.stormwall\.pro\/(.+).js/gm;
const CE_REGEXP = /cE = "(.+)"/;
const CK_REGEXP = /cK = (.+);/;
const SUBSTITUTION_ALPHABET = '0123456789qwertyuiopasdfghjklzxcvbnm:?!';

function extract(string, regexp, errorMessage) {
  const match = string.match(regexp);
  if (match) {
    return match[1];
  }
  if (errorMessage) {
    throw new Error(errorMessage);
  }
}

function decipherChar(startIndex, char) {
	const charIndex = SUBSTITUTION_ALPHABET.indexOf(char);
	if (charIndex !== -1) {
		let index = startIndex + charIndex;
		if (index < 0) {
			index += SUBSTITUTION_ALPHABET.length;
		}
		return SUBSTITUTION_ALPHABET[index];
	}
	return char;
}

function getCookie(cE, cK) {
	const swpToken = cE
		.split('')
		.map((c) => decipherChar((cK++ * -1) % SUBSTITUTION_ALPHABET.length, c))
		.join('');
	return `swp_token=${swpToken};path=/;max-age=1800`;
}

function getStormwallCookie(body) {
	const cE = extract(body, CE_REGEXP, "could't find cE variable to bypass stormwall");
	const cK = extract(body, CK_REGEXP, "could't find cK variable to bypass stormwall");
	return getCookie(cE, parseInt(cK));
}

function isProtectedByStormwall(body) {
	return STORMWALL_DETECTION_REGEXP.test(body);
}

module.exports = { isProtectedByStormwall, getStormwallCookie };
