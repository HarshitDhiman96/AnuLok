import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePhone } from './src/storage/mongo.js';
import { User } from './src/models/User.js';

test('normalizes supported Indian mobile number formats', () => {
  assert.equal(normalizePhone('98765 43210'), '+919876543210');
  assert.equal(normalizePhone('+91 98765 43210'), '+919876543210');
});

test('rejects invalid Indian mobile numbers', () => {
  assert.throws(() => normalizePhone('12345'), /valid 10-digit Indian mobile number/);
  assert.throws(() => normalizePhone('5123456789'), /valid 10-digit Indian mobile number/);
});

test('does not serialize password hashes from user records', () => {
  const user = new User({
    id: 'user-test',
    name: 'Test Customer',
    phone: '+919876543210',
    passwordHash: 'private-hash',
    age: 30,
    gender: 'prefer-not-to-say'
  });

  assert.equal(user.toJSON().passwordHash, undefined);
});
