import 'isomorphic-fetch';
import { arrayOf, normalize } from 'normalizr';
import { camelizeKeys, decamelizeKeys } from 'humps';

import { API_ROOT, APP_ROOT } from '../constants/Config';

function getPageInfo(json) {
  const info = Object.keys(json).reduce((result, item, index, array) => {
    if (typeof json[item] === 'number') {
      result['total'] = json[item];
    }
    if ( item === 'paging' ) {
      result['paging'] = json[item];
    }
    return result;
  }, {});
  return info;
}

export function callApi({ endpoint, schema, method, body = {}, version = 'v1' }) {
  const fullUrl = ( endpoint.indexOf('http://') === -1 && endpoint.indexOf('https://')) ? `${(version !== 'v1' ? APP_ROOT + version : API_ROOT) + encodeURI(endpoint)}` : encodeURI(endpoint);
  switch (method) {
    case 'GET':
      return fetch(fullUrl).then(
        response => response.json().then( json => ({ json, response }) )
      ).then( ({ json, response }) => {
        if (!response.ok) {
          return Promise.reject(json);
        }
        const camelizedJSON = camelizeKeys(json);
        if (!schema) {
          return Object.assign({}, camelizedJSON);
        }
        let dataIndex = Object.keys(camelizedJSON).find((item) => Array.isArray(camelizedJSON[item]));
        const normalizableData = camelizedJSON[dataIndex];
        const pageInfo = getPageInfo(camelizedJSON, dataIndex) || undefined;
        return Object.assign({}, normalize(normalizableData, schema), pageInfo);
      });
    case 'POST':
    case 'PUT':
      const form = new FormData();
      Object.keys(body).forEach( item => {
        form.append(item, body[item]);
      });
      return fetch(fullUrl, {
        method,
        body: form
      }).then(
        response => response.json().then( json => ({ json, response }) )
      ).then( ({ json, response }) => {
        if (!response.ok) {
          return Promise.reject(json);
        }
        const camelizedJSON = camelizeKeys(json);
        return Object.assign({}, camelizedJSON);
      })
    case 'DELETE':
      return fetch(fullUrl, {
        method: 'DELETE'
      }).then(
        response => response.json().then( json => ({ json, response }) )
      ).then( ({ json, response }) => {
        if (!response.ok) {
          return Promise.reject(json);
        }
        const camelizedJSON = camelizeKeys(json);
        return Object.assign({}, camelizedJSON);
      });
    default:
      throw new Error('Unrecognized request method. Please make a correct one.');
  }
}
