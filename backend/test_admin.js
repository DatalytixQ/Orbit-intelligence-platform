const jwt = require('jsonwebtoken');
require('dotenv').config();

const token = jwt.sign({
  user_id: 'some-id',
  client_id: 'test',
  role_id: 'some-role',
  is_admin: true
}, process.env.JWT_SECRET || 'secret');

fetch('http://localhost:3000/api/admin/roles', {
  headers: { 'Authorization': 'Bearer ' + token }
})
.then(res => {
  console.log("STATUS:", res.status);
  return res.text();
})
.then(text => {
  console.log("BODY:", text);
})
.catch(err => {
  console.error("ERROR:", err);
});
