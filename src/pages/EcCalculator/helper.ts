// ref -> https://github.com/MrMaxweII/Secp256k1-Calculator/blob/master/Secp256k1.java

import bigInt from 'big-integer';

export const p = bigInt('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F', 16);

export const ZERO = bigInt(0);
const ONE = bigInt(1);
const TWO = bigInt(2);
export const THREE = bigInt(3);
const FOUR = bigInt(4);
export const SEVEN = bigInt(7);

export const add = (a: bigInt.BigInteger, b: bigInt.BigInteger) => {
  return a.add(b).mod(p);
};

export const neg = (a: bigInt.BigInteger) => {
  return p.subtract(a);
};

export const sub = (a: bigInt.BigInteger, b: bigInt.BigInteger) => {
  return add(a, neg(b));
};

export const mul = (a: bigInt.BigInteger, b: bigInt.BigInteger) => {
  return a.multiply(b).mod(p);
};

export const inv = (a: bigInt.BigInteger) => {
  return a.modInv(p);
};

export const div = (a: bigInt.BigInteger, b: bigInt.BigInteger) => {
  return mul(a, inv(b));
};

export const abs = (a: bigInt.BigInteger) => {
  if (a.compareTo(p.subtract(ONE).divide(TWO)) === 1) return neg(a);
  return a;
};

export const pow = (x: bigInt.BigInteger, n: bigInt.BigInteger) => {
  return x.modPow(n, p);
};

export const sqrt = (n: bigInt.BigInteger) => {
  let s = ZERO;
  let q = p.subtract(ONE);
  while (q.and(ONE).equals(ZERO)) {
    q = q.divide(TWO);
    s = s.add(ONE);
  }
  if (s.equals(ONE)) {
    let r = pow(n, p.add(ONE).divide(FOUR));
    if (r.multiply(r).mod(p).equals(n)) return abs(r);
    {
      console.log('\nFehler!  sqrt(' + n + ') existiert nicht! (Math_Modulo.sqrt) \n');
      return ZERO;
    }
  }

  // Find the first quadratic non-residue z by brute-force search
  let z = ZERO;
  while (pow((z = z.add(ONE)), p.subtract(ONE).divide(TWO)).equals(p.subtract(ONE)) == false);
  let c = pow(z, q);
  let r = pow(n, q.add(ONE).divide(TWO));
  let t = pow(n, q);
  let m = s;
  while (t.equals(ONE) === false) {
    let tt = t;
    let i = ZERO;
    while (tt.equals(ONE) === false) {
      tt = tt.multiply(tt).mod(p);
      i = i.add(ONE);
      if (i.equals(m)) {
        if (n.equals(ZERO) === false) console.log('\nFehler!  sqrt(' + n + ') existiert nicht! (Math_Modulo.sqrt) \n');
        return ZERO;
      }
    }
    let b = pow(c, pow(TWO, m.subtract(i).subtract(ONE)));
    let b2 = b.multiply(b).mod(p);
    r = r.multiply(b).mod(p);
    t = t.multiply(b2).mod(p);
    c = b2;
    m = i;
  }
  if (r.multiply(r).mod(p).equals(n)) return abs(r);
  return ZERO;
};
