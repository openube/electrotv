import fs from 'fs';

export default {
  isFollowed
};

const BASE = `${process.env['HOME']}/.eltv`;
const BASE_STORE = `${BASE}/store`;

function isFollowed(id) {
  return fs.existsSync(`${BASE_STORE}/${id}`);
}
