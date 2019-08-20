import { ajax } from 'discourse/lib/ajax';

export function getLatestActivity(context) {
  return ajax('/latest.json').then(function (result) {
  	return result;
  }).catch(() => {
    console.log('getting topic list failed')
    return [];
  })
}
